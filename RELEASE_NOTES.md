# Release Notes — AI Multimedia Learning Hub

## v1.5 (2026-11-05) — รองรับ Google Gemini (ฟรี)

- `generate-course/index.ts`: เลือกผู้ให้บริการ AI จาก Secrets
  - มี `GEMINI_API_KEY` → ใช้ Gemini ผ่าน OpenAI-compatible endpoint (`gemini-2.5-flash`, เปลี่ยนได้ด้วย `GEMINI_MODEL`)
  - ไม่มี → ใช้ OpenAI เหมือนเดิม (`OPENAI_API_KEY`, `OPENAI_MODEL`)
  - บังคับเลือกได้ด้วย `AI_PROVIDER=gemini` หรือ `AI_PROVIDER=openai`
  - ตรวจรูปแบบ key ทั้งสองแบบ, รองรับรูปแบบ error ของ Gemini, แจ้ง 429 เมื่อโควตาฟรีหมด
  - response มี `provider` บอกว่าใช้ AI เจ้าไหน
- `index.html`: ปรับข้อความแนะนำการตั้งค่า
- ข้อควรรู้: Gemini รุ่นฟรีจำกัดจำนวนครั้ง/นาที/วัน และ Google อาจใช้ข้อมูลที่ส่งไปปรับปรุงบริการ — ห้ามใส่ข้อมูลส่วนบุคคลของผู้เรียน

## v1.4.1 (2026-11-05) — ตรวจรูปแบบ OPENAI_API_KEY

### หลักฐาน
หลังขึ้น v1.4 หน้าเว็บแสดง: `เชื่อมต่อ OpenAI ไม่ได้: Failed to construct 'Request': 'headers' of 'RequestInit' (Argument 2) is not a valid ByteString (HTTP 502)`
แปลว่าค่า `OPENAI_API_KEY` ใน Supabase Secrets มีอักขระนอกช่วง ASCII (เช่น ตัวอักษรไทย, zero-width space, BOM, เครื่องหมายคำพูดแบบโค้ง)
จึงใส่ลง header `Authorization` ไม่ได้ — คำขอไม่ถึง OpenAI เลย

### สิ่งที่แก้
- `generate-course/index.ts`: `trim()` key และตรวจว่าเป็น ASCII ที่พิมพ์ได้เท่านั้น ถ้าไม่ผ่าน ตอบ 500 พร้อมตำแหน่งและรหัสอักขระที่ผิด (ไม่เปิดเผยค่า key)

### วิธีแก้ secret (ผู้ใช้ทำเอง)
ตั้งค่าใหม่ใน Dashboard › Edge Functions › Secrets หรือ `npx supabase secrets set OPENAI_API_KEY=sk-...` โดยวางเฉพาะ key

## v1.4 (2026-11-05) — วินิจฉัยปัญหา "Edge Function returned a non-2xx status code"

### ปัญหาที่พบจากการตรวจไฟล์จริง
- `index.html` → `generateAICourse()` ใช้ `if(error)throw error` ทำให้ผู้ใช้เห็นแค่ข้อความกลางของ supabase-js
  ("Edge Function returned a non-2xx status code") ส่วนข้อความ error จริงที่ function ส่งกลับมาใน response body ถูกทิ้งไป
- `supabase/functions/generate-course/index.ts` → ทุก error ถูกตอบเป็น HTTP 400 และ **ไม่มีการเขียน log**
  จึงดูสาเหตุจาก Dashboard › Edge Functions › Logs ไม่ได้

### สิ่งที่แก้
- `index.html`: เพิ่ม `functionErrorDetail()` อ่าน body + HTTP status จาก `error.context` แล้วแสดงข้อความจริงใน alert และ console
- `generate-course/index.ts`:
  - ใช้ status ตามประเภทปัญหา: 400 ข้อมูลไม่ครบ, 401 ยืนยันตัวตนไม่ได้, 403 ไม่มีสิทธิ์, 500 ไม่มี OPENAI_API_KEY,
    502 OpenAI error / JSON เสีย, 504 OpenAI ตอบช้าเกิน 140 วินาที
  - `console.log` สถานะ/เวลา/ขนาดคำตอบของ OpenAI และ `console.error` ทุก error (ไม่ log API key)
  - ระบุ `finish_reason` เมื่อ JSON จาก AI ถูกตัดหรือแปลงไม่ได้

### Deploy
```bash
npx supabase functions deploy generate-course --project-ref dmjeovprirkuhixpnqrs
```
`index.html` ขึ้น GitHub Pages เมื่อ commit + push ไปที่ `main`

## v1.3 — Add AI Course Creator (commit 00a0e70)
