// course-guard.js v1.0 — แปะใน Landing page ของแต่ละหลักสูตรเพื่อเช็กการล็อกอินและการลงทะเบียน
//
// วิธีใช้ (ใน courses/<slug>/index.html):
//   <script type="module" src="../../course-guard.js"></script>
//
// - slug อ่านจากชื่อโฟลเดอร์ใน URL อัตโนมัติ หรือกำหนดเองด้วย <body data-course-slug="...">
// - องค์ประกอบที่ใส่ data-members-only  จะแสดงเฉพาะผู้ที่ลงทะเบียนหลักสูตรนี้ (หรือผู้สอน/แอดมิน)
// - องค์ประกอบที่ใส่ data-guest-only    จะแสดงเฉพาะผู้ที่ยังไม่มีสิทธิ์ (ใช้ใส่ปุ่ม "เข้าสู่ระบบ")
// - ใส่ <a data-login-link> เพื่อให้ลิงก์ชี้ไปหน้าล็อกอินของ Hub อัตโนมัติ
// - body จะได้ class: is-member | is-guest และ event "course-guard" (detail: {member, reason})
//
// หมายเหตุความปลอดภัย: นี่คือการซ่อน/แสดงบนหน้าเว็บเท่านั้น ไฟล์บน GitHub Pages ใครรู้ลิงก์ก็เปิดอ่านได้
// เนื้อหาที่ต้องปกป้องจริงให้ดึงจาก Supabase (ตาราง lessons ที่มี RLS) หลังตรวจว่า member แล้ว
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://dmjeovprirkuhixpnqrs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Fi3LdMawtOAmOkTcoFuk5g_APkDBSt-'; // publishable key — เปิดเผยได้ ความปลอดภัยอยู่ที่ RLS
const HUB_URL = new URL('../../', import.meta.url).href; // หน้า Hub (index.html) อยู่ที่ root ของเว็บ

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const style = document.createElement('style');
style.textContent = '[data-members-only],[data-guest-only]{display:none!important}' +
  'body.is-member [data-members-only]{display:revert!important}' +
  'body.is-guest [data-guest-only]{display:revert!important}';
document.head.appendChild(style);

function slugFromUrl() {
  const m = location.pathname.match(/\/courses\/([^/]+)/);
  return decodeURIComponent(document.body?.dataset.courseSlug || m?.[1] || '');
}

async function check() {
  const slug = slugFromUrl();
  if (!slug) return { member: false, reason: 'ไม่พบ slug ของหลักสูตร' };
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { member: false, reason: 'ยังไม่ได้ล็อกอิน' };
  const uid = session.user.id;

  const { data: profile } = await supabase.from('profiles').select('role,status').eq('id', uid).maybeSingle();
  if (!profile || profile.status !== 'approved') return { member: false, reason: 'บัญชียังไม่ได้รับการอนุมัติ' };
  if (['admin', 'instructor'].includes(profile.role)) return { member: true, reason: profile.role };

  const { data: course } = await supabase.from('courses').select('id').eq('slug', slug).maybeSingle();
  if (!course) return { member: false, reason: 'ไม่พบหลักสูตรนี้ในระบบ หรือยังไม่เผยแพร่' };
  const { data: enroll } = await supabase.from('enrollments').select('id')
    .eq('user_id', uid).eq('course_id', course.id).eq('status', 'active').maybeSingle();
  return enroll ? { member: true, reason: 'enrolled' } : { member: false, reason: 'ยังไม่ได้ลงทะเบียนหลักสูตรนี้' };
}

function apply(result) {
  document.body.classList.toggle('is-member', result.member);
  document.body.classList.toggle('is-guest', !result.member);
  document.querySelectorAll('[data-login-link]').forEach((a) => { a.href = HUB_URL; });
  window.courseGuard = result;
  document.dispatchEvent(new CustomEvent('course-guard', { detail: result }));
}

const run = async () => {
  try { apply(await check()); }
  catch (e) { console.error('course-guard error', e); apply({ member: false, reason: 'ตรวจสิทธิ์ไม่สำเร็จ' }); }
};
if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
