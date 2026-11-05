import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const systemPrompt = `คุณเป็นผู้เชี่ยวชาญด้านการพัฒนาหลักสูตรฝึกอบรมวิชาชีพและการออกแบบการเรียนรู้เชิงสมรรถนะ
งานของคุณคือจัดทำร่างหลักสูตรภาษาไทยอย่างเป็นระบบ โดยยึดข้อมูลต้นทางที่ผู้ใช้ให้เป็นหลัก
ห้ามแต่งรหัสมาตรฐานอาชีพ กฎหมาย มาตรฐานหน่วยงาน หรือแหล่งอ้างอิงที่ไม่มีข้อมูลยืนยัน
หากข้อมูลไม่พอ ให้ใส่รายการใน references_to_verify หรือ notes_to_reviewer ไม่เดาข้อเท็จจริง
ต้องคืนค่าเป็น JSON object ที่ถูกต้องเท่านั้น ห้ามมี Markdown code fence หรือข้อความนอก JSON
โครงสร้าง JSON:
{
 "course_summary":"string",
 "target_audience":["string"],
 "prerequisites":["string"],
 "learning_outcomes":["string"],
 "units":[{"unit_no":1,"title":"string","summary":"string","hours":0,"theory_hours":0,"practice_hours":0,"objectives":["string"],"lessons":[{"title":"string","hours":0,"content":"เนื้อหาสอนละเอียดเป็นภาษาไทย มีหัวข้อ อธิบาย ตัวอย่าง ขั้นตอนปฏิบัติ สรุป และข้อควรระวัง","activities":["string"],"materials":["string"],"assessment":["string"]}]}],
 "teaching_plan":[{"day":1,"topics":["string"],"hours":0}],
 "final_project":{"title":"string","brief":"string","deliverables":["string"],"rubric":[{"criterion":"string","points":0}]},
 "ethical_considerations":["string"],
 "references_to_verify":["string"],
 "notes_to_reviewer":["string"]
}
ข้อกำหนด: ผลรวม hours ของ units ต้องเท่ากับชั่วโมงรวมที่ระบุ; theory_hours + practice_hours ต้องเท่ากับ hours ของแต่ละหน่วย; ผลรวม teaching_plan.hours ต้องเท่ากับชั่วโมงรวม; ทุกหน่วยต้องมีบทเรียนอย่างน้อย 1 บท; เนื้อหาบทเรียนต้องนำไปสอนได้จริง ไม่เขียนเพียงหัวข้อสั้น ๆ; ต้องแยกกิจกรรมภาคปฏิบัติจากเนื้อหาอธิบาย; สอดคล้องกับวัตถุประสงค์และระดับผู้เรียน; ไม่สมมติว่าฟีเจอร์ของเครื่องมือมีอยู่เสมอ ให้ระบุให้ตรวจสอบรุ่นและแพ็กเกจจริง`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) throw new Error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(url, anon, { global: { headers: { Authorization: auth } } });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("ไม่สามารถยืนยันตัวตนได้");
    const { data: profile, error: profileError } = await supabase.from("profiles").select("id,role,status").eq("id", user.id).single();
    if (profileError || !profile || profile.status !== "approved" || !["admin", "instructor"].includes(profile.role)) {
      throw new Error("บัญชีนี้ไม่มีสิทธิ์สร้างหลักสูตรด้วย AI");
    }
    const body = await req.json();
    const required = ["title", "total_hours", "audience", "objectives"];
    for (const key of required) if (!body[key]) throw new Error(`ข้อมูลไม่ครบ: ${key}`);
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("ยังไม่ได้ตั้งค่า OPENAI_API_KEY ใน Supabase Edge Function Secrets");
    const userPrompt = `สร้างร่างหลักสูตรจากข้อมูลต่อไปนี้\n${JSON.stringify(body, null, 2)}\n\nให้เขียนเนื้อหาบทเรียนอย่างละเอียด เหมาะกับชั่วโมงและกลุ่มเป้าหมาย ห้ามเปลี่ยนข้อกำหนดต้นทาง ถ้าชั่วโมงย่อยที่ผู้ใช้ระบุรวมกันไม่ตรงกับชั่วโมงรวม ให้คงชั่วโมงรวมและแจ้งความไม่สอดคล้องใน notes_to_reviewer แทนการแก้เงียบ ๆ`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.error?.message || `AI API error ${response.status}`);
    const content = result?.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI ไม่ส่งเนื้อหากลับมา");
    const blueprint = JSON.parse(content);
    const unitHours = (blueprint.units || []).reduce((s: number, u: any) => s + Number(u.hours || 0), 0);
    const planHours = (blueprint.teaching_plan || []).reduce((s: number, d: any) => s + Number(d.hours || 0), 0);
    const warnings: string[] = [];
    if (unitHours !== Number(body.total_hours)) warnings.push(`ชั่วโมงหน่วยเรียนรวม ${unitHours} ไม่ตรงกับ ${body.total_hours} ชั่วโมง`);
    if (planHours !== Number(body.total_hours)) warnings.push(`ชั่วโมงแผนการสอนรวม ${planHours} ไม่ตรงกับ ${body.total_hours} ชั่วโมง`);
    for (const u of blueprint.units || []) {
      if (Number(u.theory_hours || 0) + Number(u.practice_hours || 0) !== Number(u.hours || 0)) warnings.push(`หน่วย ${u.unit_no}: ชั่วโมงทฤษฎีและปฏิบัติไม่รวมเท่าชั่วโมงหน่วย`);
    }
    return new Response(JSON.stringify({ blueprint, warnings, model: Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini" }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
