// generate-course v1.4.1 — ส่ง status code ที่ถูกต้อง + เขียน log ทุก error (ดู RELEASE_NOTES.md)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
const OPENAI_TIMEOUT_MS = 140_000; // ต่ำกว่าเพดานเวลาของ Edge Function เล็กน้อย เพื่อให้ได้ข้อความที่อ่านเข้าใจ

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
    if (!auth.startsWith("Bearer ")) throw new HttpError(401, "กรุณาเข้าสู่ระบบก่อนใช้งาน");
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(url, anon, { global: { headers: { Authorization: auth } } });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new HttpError(401, `ไม่สามารถยืนยันตัวตนได้${userError ? ": " + userError.message : ""}`);
    const { data: profile, error: profileError } = await supabase.from("profiles").select("id,role,status").eq("id", user.id).single();
    if (profileError || !profile || profile.status !== "approved" || !["admin", "instructor"].includes(profile.role)) {
      console.error("profile check failed", { userId: user.id, profile, profileError: profileError?.message });
      throw new HttpError(403, "บัญชีนี้ไม่มีสิทธิ์สร้างหลักสูตรด้วย AI");
    }
    const body = await req.json();
    const required = ["title", "total_hours", "audience", "objectives"];
    for (const key of required) if (!body[key]) throw new HttpError(400, `ข้อมูลไม่ครบ: ${key}`);
    const apiKey = Deno.env.get("OPENAI_API_KEY")?.trim();
    if (apiKey && !/^[\x21-\x7E]+$/.test(apiKey)) {
      // ไม่ log ค่า key — บอกแค่ตำแหน่งและรหัสอักขระที่ผิด เพื่อช่วยหาสาเหตุ
      const bad = [...apiKey].findIndex((c) => !/^[\x21-\x7E]$/.test(c));
      const code = apiKey.codePointAt(bad)?.toString(16).toUpperCase().padStart(4, "0");
      console.error("invalid OPENAI_API_KEY", { length: apiKey.length, badIndex: bad, badChar: `U+${code}` });
      throw new HttpError(500, `OPENAI_API_KEY ใน Supabase Secrets มีอักขระที่ไม่ถูกต้อง (ตำแหน่งที่ ${bad + 1} จาก ${apiKey.length}, U+${code}) — กรุณาตั้งค่าใหม่โดยคัดลอกเฉพาะ key ที่ขึ้นต้นด้วย sk-`);
    }
    if (apiKey && !apiKey.startsWith("sk-")) console.warn("OPENAI_API_KEY does not start with sk-", { length: apiKey.length });
    if (!apiKey) throw new HttpError(500,"ยังไม่ได้ตั้งค่า OPENAI_API_KEY ใน Supabase Edge Function Secrets");
    const userPrompt = `สร้างร่างหลักสูตรจากข้อมูลต่อไปนี้\n${JSON.stringify(body, null, 2)}\n\nให้เขียนเนื้อหาบทเรียนอย่างละเอียด เหมาะกับชั่วโมงและกลุ่มเป้าหมาย ห้ามเปลี่ยนข้อกำหนดต้นทาง ถ้าชั่วโมงย่อยที่ผู้ใช้ระบุรวมกันไม่ตรงกับชั่วโมงรวม ให้คงชั่วโมงรวมและแจ้งความไม่สอดคล้องใน notes_to_reviewer แทนการแก้เงียบ ๆ`;
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini";
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        }),
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        throw new HttpError(504, `OpenAI ตอบช้าเกิน ${OPENAI_TIMEOUT_MS / 1000} วินาที (model: ${model}) — ลองลดขอบเขตเนื้อหาหรือแบ่งสร้างทีละหน่วย`);
      }
      throw new HttpError(502, `เชื่อมต่อ OpenAI ไม่ได้: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      clearTimeout(timer);
    }
    const raw = await response.text();
    console.log("openai response", { status: response.status, model, ms: Date.now() - started, bytes: raw.length });
    let result: any;
    try { result = JSON.parse(raw); } catch {
      throw new HttpError(502, `OpenAI ตอบกลับไม่ใช่ JSON (HTTP ${response.status}): ${raw.slice(0, 300)}`);
    }
    if (!response.ok) throw new HttpError(502, `OpenAI error ${response.status} (model: ${model}): ${result?.error?.message || raw.slice(0, 300)}`);
    const finish = result?.choices?.[0]?.finish_reason ?? "-";
    const content = result?.choices?.[0]?.message?.content;
    if (!content) throw new HttpError(502, `AI ไม่ส่งเนื้อหากลับมา (finish_reason: ${finish})`);
    let blueprint: any;
    try { blueprint = JSON.parse(content); } catch {
      throw new HttpError(502, `AI ส่ง JSON ไม่สมบูรณ์ (finish_reason: ${finish}, ยาว ${content.length} ตัวอักษร) — อาจถูกตัดเพราะเนื้อหายาวเกิน`);
    }
    const unitHours = (blueprint.units || []).reduce((s: number, u: any) => s + Number(u.hours || 0), 0);
    const planHours = (blueprint.teaching_plan || []).reduce((s: number, d: any) => s + Number(d.hours || 0), 0);
    const warnings: string[] = [];
    if (unitHours !== Number(body.total_hours)) warnings.push(`ชั่วโมงหน่วยเรียนรวม ${unitHours} ไม่ตรงกับ ${body.total_hours} ชั่วโมง`);
    if (planHours !== Number(body.total_hours)) warnings.push(`ชั่วโมงแผนการสอนรวม ${planHours} ไม่ตรงกับ ${body.total_hours} ชั่วโมง`);
    for (const u of blueprint.units || []) {
      if (Number(u.theory_hours || 0) + Number(u.practice_hours || 0) !== Number(u.hours || 0)) warnings.push(`หน่วย ${u.unit_no}: ชั่วโมงทฤษฎีและปฏิบัติไม่รวมเท่าชั่วโมงหน่วย`);
    }
    return new Response(JSON.stringify({ blueprint, warnings, model }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : String(error);
    console.error("generate-course error", { status, message });
    return new Response(JSON.stringify({ error: message }), {
      status, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
