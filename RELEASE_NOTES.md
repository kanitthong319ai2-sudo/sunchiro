# Release Notes — AI Multimedia Learning Hub

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
