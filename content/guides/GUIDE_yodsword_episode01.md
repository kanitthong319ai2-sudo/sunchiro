# คู่มือทำหนังสั้นจีนย้อนยุค 1 นาที — ตอนที่ 1 "ดาบหาย ณ โรงเตี๊ยม"

ซีรีส์ตัวอย่าง: **ยอดดาบขี้ลืม** (ตลก จีนย้อนยุค ตอนละ 1 นาที แนวตั้ง 9:16)
คู่มือนี้ใช้คู่กับวิดีโอสอน `tutorial.mp4` — ทุก prompt ก๊อปไปวางได้เลย

ลำดับงานทั้งหมด (9 ขั้น):

| # | ขั้น | เครื่องมือ | ได้อะไรออกมา |
|---|---|---|---|
| 1 | สร้าง Skill | Claude | ไฟล์ `SKILL.md` ที่จำซีรีส์ทั้งเรื่อง |
| 2 | สร้างตัวละคร | Claude + Google Flow (สร้างภาพ) | Character bible 3 ตัว |
| 3 | ล็อคหน้า | Google Flow | ภาพหมุนรอบตัว + master reference + handle `@ชื่อ` |
| 4 | คิดฉาก | Claude | บท + shot list 7 ช็อต × 8 วินาที |
| 5 | สร้างเสียง | ElevenLabs | ไฟล์เสียง `S1.mp3` – `S7.mp3` |
| 6 | ถอดเวลา | SayToWord | timestamp รายคำของแต่ละช็อต |
| 7 | Prompt กำกับเวลา | Claude | prompt 7 ชุด ที่บอกว่าวินาทีไหนใครพูด |
| 8 | สร้างวิดีโอ | Google Flow (Veo) | คลิป `S1.mp4` – `S7.mp4` |
| 9 | ตัดต่อ + เสียง | CapCut | หนังสั้น 1 นาที พร้อมโพสต์ |

---

## ขั้นที่ 1 — สร้าง Skill

Skill คือโฟลเดอร์ที่มีไฟล์ `SKILL.md` บอก Claude ว่าซีรีส์นี้คืออะไร ตัวละครหน้าตาแบบไหน และต้องเขียน prompt แบบไหน พอมี skill แล้ว ทุกตอนจะออกมาเหมือนกัน ไม่ต้องอธิบายใหม่

1. สร้างโฟลเดอร์ `yodsword-studio/`
2. ใส่ไฟล์ `SKILL.md` (ตัวเต็มอยู่ที่ [skill/SKILL.md](skill/SKILL.md) ในโฟลเดอร์นี้)
3. ใส่ใน Claude:
   - **Claude Code**: วางโฟลเดอร์ไว้ที่ `~/.claude/skills/yodsword-studio/`
   - **Claude.ai**: Settings → Capabilities → Skills → Upload skill (zip โฟลเดอร์ก่อน)
4. ทดสอบด้วยคำสั่ง:

```
ใช้สกิล yodsword-studio เขียนตอนที่ 1 ความยาว 1 นาที 7 ช็อต ช็อตละ 8 วินาที
ชื่อตอน "ดาบหาย ณ โรงเตี๊ยม" ตัวละคร @หลิวเฟิง @เหม่ยหลิน @ลุงจาง
ขอบท shot list และ prompt Google Flow ครบทุกช็อต
```

---

## ขั้นที่ 2 — สร้างตัวละคร (Character Bible)

เขียนให้ครบ 6 อย่างทุกตัว: **หน้า · ผม · รูปร่าง · ชุด · นิสัย · เสียง** และใส่ "จุดจำ" 1 อย่างที่ไม่ซ้ำใคร (ช่วยให้ AI จำหน้าได้)

| Handle | หน้า | ผม | รูปร่าง / ชุด | นิสัย | เสียง | จุดจำ |
|---|---|---|---|---|---|---|
| `@หลิวเฟิง` | ชาย 26 ปี หน้ารูปไข่ คิ้วเข้มเฉียง ตาเรียว | ดำยาว มวยสูง ปิ่นครอบผมสีเงิน | สูงเพรียว ชุดคลุมขาวขลิบฟ้าอ่อน เข็มขัดเงิน | หยิ่ง ชอบโพสท่า ขี้ลืม | ทุ้ม ช้า ดราม่า → ตกใจเสียงแหลม | ไฝเล็กใต้ตาซ้าย |
| `@เหม่ยหลิน` | หญิง 23 ปี หน้ารูปหัวใจ ตาหงส์ | ดำ เกล้าครึ่งหัว ปิ่นหยกเขียว | เล็ก สง่า ชุดแดงเลือดนก ปักทอง | นิ่ง ปากคม ฉลาด | ใส เย็น เรียบ แซวแบบไม่ยิ้ม | จุดแดง (ฮวาเตี้ยน) กลางหน้าผาก |
| `@ลุงจาง` | ชาย 60 ปี หน้ากลม คิ้วขาวดก | ล้านกลาง มวยเทาเล็ก เคราแพะขาว | ท้วม ชุดน้ำตาล แขนเสื้อปะ ถือลูกคิด | งก เจ้าเล่ห์ ยิ้มตลอด | แหบ สูง หัวเราะคิก ๆ | ลูกคิดไม้ไม่เคยห่างมือ |

### Prompt สร้างภาพตัวละคร (Google Flow → สร้างภาพ / Nano Banana หรือ Imagen)

**@หลิวเฟิง — Master Reference**
```
Photorealistic cinematic portrait of a 26-year-old Chinese man, Chinese historical wuxia drama style.
Oval face, sharp slanted dark eyebrows, narrow confident eyes, small mole under his LEFT eye,
clean-shaven, fair skin. Long black hair tied in a high topknot held by a silver hair crown.
Tall slim athletic build. White hanfu robe with pale-blue trim, silver belt, a long sword with a blue tassel at his hip.
Proud, theatrical expression. Neutral grey studio background, soft key light, 85mm lens, chest-up framing,
sharp focus on the face, natural skin texture. No text, no watermark.
```

**@เหม่ยหลิน — Master Reference**
```
Photorealistic cinematic portrait of a 23-year-old Chinese woman, Chinese historical drama style.
Heart-shaped face, elegant phoenix eyes, calm unimpressed expression, small red huadian mark in the center of her forehead.
Black hair in a half-up bun with a green jade hairpin, the rest falling straight past her shoulders.
Petite graceful build. Crimson hanfu with fine gold embroidery on the collar and sleeves.
Neutral grey studio background, soft key light, 85mm lens, chest-up framing, sharp focus on the face,
natural skin texture. No text, no watermark.
```

**@ลุงจาง — Master Reference**
```
Photorealistic cinematic portrait of a 60-year-old Chinese man, comedic innkeeper in a Chinese historical drama.
Round chubby face, thick bushy white eyebrows, small white goatee, sly wide grin, bald crown with a small grey bun at the back.
Short round build. Faded brown cotton robe with a patched right sleeve, holding a wooden abacus.
Neutral grey studio background, soft key light, 85mm lens, chest-up framing, sharp focus on the face,
natural skin texture. No text, no watermark.
```

> สร้างตัวละ 4 ภาพ เลือกภาพที่ "ใช่" ที่สุดภาพเดียว เก็บไว้เป็น Master Reference ห้ามเปลี่ยนภาพนี้ตลอดซีรีส์

---

## ขั้นที่ 3 — ล็อคหน้า (Face Lock)

**3.1 สร้างภาพหมุนรอบตัว (Set 1 – Turnaround)** — ใส่ Master Reference เป็นภาพอ้างอิง แล้วใช้ prompt:
```
Character turnaround sheet of the SAME person in the reference image, keep the exact face, mole under the left eye,
hairstyle, body proportions and costume. Four full-body views side by side: front, three-quarter, side profile, back.
Plain white background, even studio lighting, consistent scale, no text labels, no extra people.
Do not beautify, do not change age, do not change face shape.
```

**3.2 สร้างภาพสีหน้า (Set 2 – Expression & Pose)**
```
Expression sheet of the SAME person in the reference image, identical face and costume.
Six chest-up panels: proud smile, shocked wide eyes, whispering, embarrassed bow, angry shout, sly smirk.
Plain white background, even lighting, no text, no extra people. Do not change the face.
```

**3.3 ตั้ง handle ใน Google Flow**
1. เข้า Flow → โปรเจกต์ใหม่ "ยอดดาบขี้ลืม"
2. อัปโหลด Master Reference ของแต่ละตัวเข้า **Ingredients / Assets**
3. ตั้งชื่อให้ตรงกับ handle: `หลิวเฟิง`, `เหม่ยหลิน`, `ลุงจาง` → เรียกใน prompt ด้วย `@หลิวเฟิง`
4. ทุก prompt ที่ตัวละครออก ต้องมี **handle + คำบรรยายหน้า/ผม/ชุด/เสียงซ้ำทุกครั้ง** (อย่าเขียนแค่ "same face")

**กฎกันหน้าเพี้ยน**
- ใช้ medium / close-up และเลนส์ 50mm ในช็อตพูด
- ลดการเคลื่อนไหวกล้องในช็อตที่หน้าต้องชัด
- ไม่ใช้ภาพแบ่งช่อง (turnaround sheet) เป็น Start Frame — Start Frame ต้องเป็นภาพฉากเดียวที่สะอาด
- ถ้าหน้าเพี้ยน: เอาเฟรมที่ดีที่สุดจากคลิปก่อนหน้ามาเป็น Start Frame ใหม่

---

## ขั้นที่ 4 — คิดฉาก (บท + Shot List)

**ตอนที่ 1: ดาบหาย ณ โรงเตี๊ยม** — โครง: ปูเรื่อง → คาดหวัง → หักมุม → มุกปิด
สถานที่: โรงเตี๊ยมไม้เก่า ยามโพล้เพล้ ฝนตก โคมแดงแขวน ไอชาลอย

| ช็อต | เวลาในเรื่อง | ภาพ | ใครพูด | บทพูด (ห้ามแก้คำ) |
|---|---|---|---|---|
| S1 | 0:00–0:08 | Wide → medium: ประตูโรงเตี๊ยมเปิดผาง หลิวเฟิงก้าวเข้ามาโพสท่า ผ้าคลุมพลิ้ว | @หลิวเฟิง | "ข้า... หลิวเฟิง ยอดดาบอันดับหนึ่งแห่งแผ่นดิน!" |
| S2 | 0:08–0:16 | Medium close-up: มือคลำที่เอว ไม่มีดาบ หน้าค้าง | @หลิวเฟิง | [กระซิบ] "เดี๋ยวนะ... ดาบข้าล่ะ?" |
| S3 | 0:16–0:24 | Medium: ลุงจางหลังเคาน์เตอร์ ดีดลูกคิด ยิ้มเจ้าเล่ห์ | @ลุงจาง | "ดาบหรือขอรับ... ค่าฝากดาบ คืนละสามตำลึง" |
| S4 | 0:24–0:32 | Close-up: หลิวเฟิงหันขวับ ตาโต | @หลิวเฟิง | "ข้าฝากไว้ตั้งแต่เมื่อไหร่!?" |
| S5 | 0:32–0:40 | Close-up: ลุงจางดีดลูกคิดเร็วขึ้น | @ลุงจาง | "ปีที่แล้วขอรับ... รวมดอกเบี้ย สามร้อยตำลึง" |
| S6 | 0:40–0:48 | Medium: มุมโต๊ะ เหม่ยหลินจิบชา ยกดาบพู่ฟ้าขึ้นมา | @เหม่ยหลิน | "หาสิ่งนี้อยู่หรือ... ยอดดาบอันดับหนึ่ง" |
| S7 | 0:48–0:56 | Medium: หลิวเฟิงโค้งคำนับต่ำสุดตัว | @หลิวเฟิง | "แม่นาง... ช่วยจ่ายให้ข้าก่อนได้ไหม" |
| End | 0:56–1:00 | การ์ดดำ ตัวหนังสือทอง (ทำใน CapCut) | — | "ตอนหน้า: ข้าลืมว่าข้าเป็นใคร" |

> ทำไม 8 วินาที? Google Flow (Veo) สร้างคลิปได้ครั้งละ 8 วินาที → 7 ช็อต = 56 วินาที + การ์ดปิด 4 วินาที = 1 นาทีพอดี

### Prompt ภาพเริ่มต้น (Start Frame) — ภาพฉากเดียว ไม่มีแบ่งช่อง
```
Cinematic still, vertical 9:16, interior of an old wooden Chinese inn at dusk during rain.
Red paper lanterns, steam rising from tea cups, wooden counter on the right, open double doors at the back with rain outside.
@หลิวเฟิง standing in the doorway: 26-year-old man, oval face, sharp slanted eyebrows, small mole under his left eye,
high topknot with silver hair crown, white hanfu with pale-blue trim, silver belt, NO sword at his hip.
Warm lantern key light, cool blue rain light from the door, shallow depth of field, 35mm lens, film grain.
No text, no extra characters.
```
(ทำแบบเดียวกันให้ครบ S1–S7 เปลี่ยนตัวละคร/ตำแหน่ง/ท่าตามตาราง)

---

## ขั้นที่ 5 — สร้างเสียงใน ElevenLabs

**5.1 ออกแบบเสียง (Voices → Voice Design)** — ใส่คำบรรยายแล้วกด Generate เลือก 1 ใน 3 ตัวเลือก → Save เป็นชื่อตัวละคร

| ตัวละคร | Voice Design prompt |
|---|---|
| หลิวเฟิง | `A 26-year-old male wuxia hero. Deep, resonant, theatrical voice with slow dramatic pacing and long pauses, like a Chinese historical drama lead. Can switch to a high, panicked squeak when shocked. Clear studio quality.` |
| เหม่ยหลิน | `A 23-year-old young woman. Cool, clear, mid-pitched voice, calm and deadpan, slightly teasing, elegant like a noble lady in a Chinese costume drama. Clear studio quality.` |
| ลุงจาง | `A 60-year-old greedy innkeeper. Raspy, slightly high-pitched old man voice, sly and overly polite, with a little giggle. Comedic character voice. Clear studio quality.` |

**5.2 สร้างเสียงทีละช็อต (Text to Speech)**
- Model: **Eleven v3** (ใส่แท็กอารมณ์ได้ เช่น `[whispers]`, `[shocked]`, `[laughs]`) — ถ้าเสียงไทยยังไม่นิ่ง ลอง **Multilingual v2**
- Settings (v2): Stability 40–50% · Similarity 75% · Style 25–35% · Speaker Boost เปิด
- Settings (v3): Stability = **Natural** (ถ้าอยากเล่นใหญ่ใช้ Creative)

ข้อความที่วางใน ElevenLabs (ไฟล์ละช็อต):
```
S1 (หลิวเฟิง):  [proud, slow] ข้า... หลิวเฟิง ยอดดาบอันดับหนึ่งแห่งแผ่นดิน!
S2 (หลิวเฟิง):  [whispers] เดี๋ยวนะ... [nervous] ดาบข้าล่ะ?
S3 (ลุงจาง):    [sly] ดาบหรือขอรับ... [giggles] ค่าฝากดาบ คืนละสามตำลึง
S4 (หลิวเฟิง):  [shocked, high-pitched] ข้าฝากไว้ตั้งแต่เมื่อไหร่!?
S5 (ลุงจาง):    [overly polite] ปีที่แล้วขอรับ... [giggles] รวมดอกเบี้ย สามร้อยตำลึง
S6 (เหม่ยหลิน): [calm, teasing] หาสิ่งนี้อยู่หรือ... ยอดดาบอันดับหนึ่ง
S7 (หลิวเฟิง):  [embarrassed, soft] แม่นาง... ช่วยจ่ายให้ข้าก่อนได้ไหม
```
- แต่ละไฟล์ต้อง **ไม่เกิน 7 วินาที** (เหลือที่ให้ภาพ 8 วินาที)
- Download เป็น MP3 ตั้งชื่อ `S1.mp3` … `S7.mp3`
- ฟังแล้วอารมณ์ยังไม่ได้ → Regenerate (ไม่ต้องแก้ข้อความ)

---

## ขั้นที่ 6 — ถอดเวลาด้วย SayToWord (Timestamp)

1. อัปโหลด `S1.mp3`
2. ภาษา: **ไทย** · โหมด: **รายคำ (word-level)**
3. ตรวจคำที่ถอดให้ตรงบท (แก้ตัวสะกดถ้าผิด)
4. Export เป็น **SRT** หรือ **JSON**
5. ทำซ้ำ S2–S7

ตัวอย่างผลลัพธ์ S1 (เวลาจริงของคุณจะต่างกันเล็กน้อย — ใช้ค่าจริงเสมอ):
```
0.50 – 0.95  ข้า
0.95 – 1.60  (เงียบ / หยุดหายใจ)
1.60 – 2.40  หลิวเฟิง
2.55 – 3.30  ยอดดาบ
3.30 – 4.10  อันดับหนึ่ง
4.10 – 5.30  แห่งแผ่นดิน!
```
> ไม่มี SayToWord? ใช้ ElevenLabs → Speech to Text (เปิด timestamps) หรือ CapCut Auto Captions แล้วอ่านเวลาจากซับ ได้ผลเหมือนกัน

---

## ขั้นที่ 7 — Prompt กำกับเวลา (ตัวเต็ม ใช้ได้ทันที)

หลักคิด: เอาเวลาจากขั้นที่ 6 มาแบ่งช่วงในคลิป 8 วินาที บอกว่า **วินาทีไหน · ใครพูด · ทำอะไร · กล้องไปไหน** → ปากใน Veo จะขยับตรงช่วงเดียวกับไฟล์เสียง ElevenLabs

### S1
```
Format: 8 seconds, vertical 9:16, cinematic Chinese historical comedy drama, photorealistic.

Character: ONLY @หลิวเฟิง appears; no other visible or speaking characters.
@หลิวเฟิง: 26-year-old Chinese man, oval face, sharp slanted dark eyebrows, narrow eyes, small mole under his LEFT eye,
long black hair in a high topknot with a silver hair crown, tall slim build, white hanfu robe with pale-blue trim, silver belt,
NO sword at his hip. Proud, theatrical personality. Voice: deep, slow, dramatic male voice.

Location: old wooden Chinese inn at dusk, rain outside, red paper lanterns, steam from tea cups, wooden counter.

Timeline:
0.0–0.5s: the inn doors burst open, wind and rain blow in, his robe flutters.
0.5–1.0s: he steps in and says "ข้า..." then pauses with chin raised.
1.0–1.6s: dramatic pause, he slowly flicks his sleeve.
1.6–5.3s: he speaks to the room: "หลิวเฟิง ยอดดาบอันดับหนึ่งแห่งแผ่นดิน!" with a heroic pose, hand on his hip.
5.3–8.0s: he holds the pose, proud smile, lanterns sway behind him.

Dialogue (exact Thai, do not add, remove or change any word):
@หลิวเฟิง: "ข้า... หลิวเฟิง ยอดดาบอันดับหนึ่งแห่งแผ่นดิน!"

Camera: starts wide from inside the inn, slow push-in to a medium shot by 1.6s, 35mm lens then 50mm feel,
focus locked on his face, shallow depth of field.
Lighting & color: warm orange lantern key light, cool blue rain rim light from the door, teal-and-amber grade, soft film grain.
Sound: rain and wind, doors banging open, cloth flutter, low inn murmur; music: one deep drum hit at 0.0s and a short heroic dizi phrase at 5.3s, music very low under the dialogue.
Constraints: no face morphing, keep the exact face and mole, no extra characters, no split screen, no subtitles, no on-screen text, no modern objects.
```

### S2
```
Format: 8 seconds, vertical 9:16, cinematic Chinese historical comedy drama, photorealistic.

Character: ONLY @หลิวเฟิง appears; no other visible or speaking characters.
@หลิวเฟิง: 26-year-old Chinese man, oval face, sharp slanted dark eyebrows, narrow eyes, small mole under his LEFT eye,
high topknot with silver hair crown, white hanfu with pale-blue trim, silver belt, NO sword at his hip. Voice: deep male voice, now a nervous whisper.

Location: same wooden inn at dusk, lanterns, rain outside.

Timeline:
0.0–1.5s: still proud, he casually reaches his right hand down to his hip to touch his sword.
1.5–2.2s: his hand pats empty air, he freezes, smile fades.
2.2–3.4s: he whispers: "เดี๋ยวนะ..." eyes slowly look down.
3.4–5.0s: nervous whisper: "ดาบข้าล่ะ?" pats both hips quickly.
5.0–8.0s: frozen awkward face, one eyebrow twitches, a single bead of sweat.

Dialogue (exact Thai, do not add, remove or change any word):
@หลิวเฟิง: "เดี๋ยวนะ... ดาบข้าล่ะ?"

Camera: medium close-up, 50mm lens, locked-off, tiny push-in on the freeze at 5.0s, focus on his face.
Lighting & color: warm lantern light, teal-and-amber grade, soft film grain.
Sound: rain ambience, cloth rustle on hand pats; music stops completely at 1.5s; a small comedic "ting" at 5.0s.
Constraints: no face morphing, keep the exact face and mole, no sword visible, no extra characters, no split screen, no on-screen text.
```

### S3
```
Format: 8 seconds, vertical 9:16, cinematic Chinese historical comedy drama, photorealistic.

Character: ONLY @ลุงจาง appears; no other visible or speaking characters.
@ลุงจาง: 60-year-old Chinese man, round chubby face, thick bushy white eyebrows, small white goatee, bald crown with a small grey bun,
short round build, faded brown cotton robe with a patched right sleeve, holding a wooden abacus. Sly, greedy, always grinning.
Voice: raspy, slightly high-pitched old man voice with a giggle.

Location: behind the wooden counter of the inn, shelves of wine jars, a ledger book, lantern light.

Timeline:
0.0–0.6s: he looks up from the ledger with a sly grin.
0.6–2.3s: he says: "ดาบหรือขอรับ..." slowly sliding one abacus bead.
2.3–2.9s: small giggle, shoulders shake.
2.9–6.2s: he says: "ค่าฝากดาบ คืนละสามตำลึง" flicking abacus beads rhythmically.
6.2–8.0s: holds out an open palm toward the camera, eyebrows wiggle.

Dialogue (exact Thai, do not add, remove or change any word):
@ลุงจาง: "ดาบหรือขอรับ... ค่าฝากดาบ คืนละสามตำลึง"

Camera: medium shot, 50mm, slow dolly-in, focus on his face and the abacus.
Lighting & color: warm lantern light from the left, amber grade, film grain.
Sound: crisp wooden abacus clicks, rain ambience, inn murmur; playful pipa plucks very low under the dialogue.
Constraints: no face morphing, no extra characters, no split screen, no on-screen text, no modern objects.
```

### S4
```
Format: 8 seconds, vertical 9:16, cinematic Chinese historical comedy drama, photorealistic.

Character: ONLY @หลิวเฟิง appears; no other visible or speaking characters.
@หลิวเฟิง: 26-year-old Chinese man, oval face, sharp slanted dark eyebrows, small mole under his LEFT eye, high topknot with silver hair crown,
white hanfu with pale-blue trim, silver belt. Voice: deep male voice cracking into a high, shocked shout.

Location: the inn, counter behind camera, lanterns in soft background.

Timeline:
0.0–0.8s: he snaps his head toward camera, topknot swings.
0.8–3.2s: shocked shout: "ข้าฝากไว้ตั้งแต่เมื่อไหร่!?" eyes wide, pointing finger.
3.2–8.0s: frozen in disbelief, mouth open, slow breathing.

Dialogue (exact Thai, do not add, remove or change any word):
@หลิวเฟิง: "ข้าฝากไว้ตั้งแต่เมื่อไหร่!?"

Camera: close-up, 50mm, quick whip-in at 0.0s then locked, focus on his eyes.
Lighting & color: warm lantern key, teal shadows, film grain.
Sound: whoosh on the head turn, rain ambience; a dramatic gong hit at 0.8s; music low.
Constraints: no face morphing, keep the exact face and mole, no extra characters, no split screen, no on-screen text.
```

### S5
```
Format: 8 seconds, vertical 9:16, cinematic Chinese historical comedy drama, photorealistic.

Character: ONLY @ลุงจาง appears; no other visible or speaking characters.
@ลุงจาง: 60-year-old Chinese man, round chubby face, thick bushy white eyebrows, small white goatee, bald crown with a small grey bun,
faded brown robe with patched right sleeve, wooden abacus. Voice: raspy, high-pitched, overly polite, giggling.

Location: behind the inn counter, ledger and wine jars.

Timeline:
0.0–2.0s: calm polite bow, says: "ปีที่แล้วขอรับ..."
2.0–2.6s: giggle, eyes squint with greed.
2.6–6.0s: flicks the abacus faster and faster while saying: "รวมดอกเบี้ย สามร้อยตำลึง"
6.0–8.0s: slams the last bead, satisfied grin.

Dialogue (exact Thai, do not add, remove or change any word):
@ลุงจาง: "ปีที่แล้วขอรับ... รวมดอกเบี้ย สามร้อยตำลึง"

Camera: close-up, 50mm, slight handheld feel, focus on face then rack focus to the abacus at 6.0s.
Lighting & color: warm amber, film grain.
Sound: fast abacus clicks building up, one loud final click at 6.0s, rain ambience; music low.
Constraints: no face morphing, no extra characters, no split screen, no on-screen text.
```

### S6
```
Format: 8 seconds, vertical 9:16, cinematic Chinese historical comedy drama, photorealistic.

Character: ONLY @เหม่ยหลิน appears; no other visible or speaking characters.
@เหม่ยหลิน: 23-year-old Chinese woman, heart-shaped face, elegant phoenix eyes, small red huadian mark on her forehead,
black hair in a half-up bun with a green jade hairpin, petite graceful build, crimson hanfu with gold embroidery.
Calm, deadpan, teasing. Voice: cool, clear, mid-pitched female voice.

Location: a corner table of the inn by a window with rain, a teapot and cup, a long sword with a BLUE tassel lying on the table.

Timeline:
0.0–1.2s: she sips tea calmly without looking up.
1.2–2.0s: sets the cup down, lifts the sword with the blue tassel.
2.0–3.8s: says: "หาสิ่งนี้อยู่หรือ..." tilting the sword toward camera.
3.8–6.4s: says: "ยอดดาบอันดับหนึ่ง" with a tiny smirk.
6.4–8.0s: raises one eyebrow, holds the pose.

Dialogue (exact Thai, do not add, remove or change any word):
@เหม่ยหลิน: "หาสิ่งนี้อยู่หรือ... ยอดดาบอันดับหนึ่ง"

Camera: medium shot, 50mm, slow push-in, focus on her face, the sword softly in the foreground.
Lighting & color: soft window light with rain reflections, warm lantern fill, elegant teal-and-red grade, film grain.
Sound: tea sip, porcelain cup set down, a soft metallic sword shimmer at 1.2s, rain ambience; gentle guzheng phrase very low.
Constraints: no face morphing, no extra characters, no split screen, no on-screen text, no modern objects.
```

### S7
```
Format: 8 seconds, vertical 9:16, cinematic Chinese historical comedy drama, photorealistic.

Character: ONLY @หลิวเฟิง appears; no other visible or speaking characters.
@หลิวเฟิง: 26-year-old Chinese man, oval face, sharp slanted dark eyebrows, small mole under his LEFT eye, high topknot with silver hair crown,
white hanfu with pale-blue trim, silver belt. Voice: deep male voice, now soft and embarrassed.

Location: the inn, facing the corner table, lanterns and rain behind.

Timeline:
0.0–1.0s: he clasps his hands in a formal wuxia salute.
1.0–2.2s: says softly: "แม่นาง..."
2.2–5.4s: bows deeply while saying: "ช่วยจ่ายให้ข้าก่อนได้ไหม" with a hopeful embarrassed smile.
5.4–8.0s: stays bowed, peeks up with one eye.

Dialogue (exact Thai, do not add, remove or change any word):
@หลิวเฟิง: "แม่นาง... ช่วยจ่ายให้ข้าก่อนได้ไหม"

Camera: medium shot, 50mm, locked-off then slow tilt down with the bow, focus on his face.
Lighting & color: warm lanterns, teal-and-amber grade, film grain.
Sound: cloth rustle on the salute and bow, rain ambience; music stops at 5.4s, then a comedic gong + small drum hit at 5.6s.
Constraints: no face morphing, keep the exact face and mole, no extra characters, no split screen, no on-screen text.
```

---

## ขั้นที่ 8 — สร้างวิดีโอใน Google Flow

1. เปิดโปรเจกต์ "ยอดดาบขี้ลืม" → **Frames to Video** (หรือ Ingredients to Video ถ้าไม่มี Start Frame)
2. ใส่ **Start Frame** ของช็อตนั้น (ภาพฉากเดียว)
3. เลือก Ingredient ตัวละครที่ออกในช็อต
4. วาง prompt จากขั้นที่ 7
5. Settings: Model **Veo (Quality หรือ Fast)** · Aspect **9:16** · Outputs **2**
6. กด Generate → ดูทั้ง 2 คลิป เลือกคลิปที่ **หน้าตรงกับ reference + ปากเริ่มขยับใกล้เวลาที่ตั้ง**
7. Download 1080p ตั้งชื่อ `S1.mp4` … `S7.mp4`

ปัญหาที่เจอบ่อย:
| อาการ | วิธีแก้ |
|---|---|
| หน้าเปลี่ยน | ใช้ close-up 50mm, ลดการเคลื่อนกล้อง, ใช้เฟรมที่ดีที่สุดเป็น Start Frame ใหม่ |
| มีคนโผล่มาเกิน | ย้ำ "ONLY @ชื่อ appears" + "no extra characters" |
| ตัวหนังสือมั่ว | ใส่ "no on-screen text, no subtitles" → ใส่ข้อความเองใน CapCut |
| พูดไม่ตรงคำ | ไม่เป็นไร เราจะใช้เสียง ElevenLabs แทน ดูแค่จังหวะปาก |

---

## ขั้นที่ 9 — ตัดต่อใน CapCut + ใส่เสียง

### 9.1 เทียบเสียงกับภาพ
1. New project → Ratio **9:16** · 1080×1920 · 30 fps
2. ลาก `S1.mp4`–`S7.mp4` ลง Main track เรียงกัน (แต่ละคลิป 8 วินาที)
3. ลาก `S1.mp3`–`S7.mp3` ลงแทร็กเสียงใต้คลิปของตัวเอง ให้หัวไฟล์เสียงตรงกับหัวคลิป
4. เลือกคลิปวิดีโอทั้งหมด → **Volume 0** (หรือ -18 dB ถ้าอยากเก็บเสียงบรรยากาศจาก Veo)
5. ซูมไทม์ไลน์ (Ctrl + scroll) → หาเฟรมที่ปากเริ่มขยับคำแรก → ลากไฟล์เสียงให้คำแรกตรงเฟรมนั้น (ขยับทีละเฟรมด้วยลูกศร ← →)
6. ถ้าปากยาวกว่าเสียง: **Split** ตัดส่วนเกิน / ถ้าสั้นกว่า: **Speed** 0.9–1.1x หรือ **Freeze frame** ท่านิ่ง
7. เปิด Waveform บนแทร็กเสียง ช่วยดูจุดเริ่มคำได้ง่ายขึ้น

### 9.2 เสียง 3 ชั้น (CapCut → Audio → Sound effects / Music)

| ชั้น | อะไร | ระดับเสียง | หมายเหตุ |
|---|---|---|---|
| Voice | ElevenLabs S1–S7 | 0 dB (ยอด ~ -6 dB) | ดังสุดเสมอ |
| Ambience | rain, inn crowd murmur | **-24 dB** ตลอดเรื่อง | fade in/out 0.5s |
| SFX | ตามตารางข้างล่าง | **-8 ถึง -12 dB** | วางตรงเฟรมที่เกิดเหตุ |
| BGM | guzheng / Chinese comedy | **-20 dB** ใต้บทพูด, -12 dB ช่วงเงียบ | ใช้ keyframe volume |

ตาราง SFX (คำค้นใน CapCut ใส่ในวงเล็บ):
| เวลา | เสียง | คำค้น |
|---|---|---|
| 0:00.0 | ประตูกระแทก + ลม | `door slam`, `wind` |
| 0:00.0 | กลองหนัก 1 ที | `chinese drum hit` |
| 0:09.5 | มือคลำเอว ผ้าเสียดสี | `cloth rustle` |
| 0:13.0 | "ติ๊ง" ตลก | `comedy ding` |
| 0:16.6 | ลูกคิด | `abacus` |
| 0:24.8 | ฆ้องดราม่า | `gong` |
| 0:38.0 | ลูกคิดดังปัง | `wood click` |
| 0:40.0 | จิบชา + วางถ้วย | `tea sip`, `cup` |
| 0:41.2 | ดาบวาว | `sword shing` |
| 0:53.6 | ฆ้อง + กลองปิดมุก | `gong`, `drum` |

### 9.3 ปิดงาน
1. **Text → Auto captions** (ภาษาไทย) → ตรวจตัวสะกดให้ตรงบททุกคำ
2. การ์ดปิด 0:56–1:00: พื้นดำ ตัวหนังสือทอง "ตอนหน้า: ข้าลืมว่าข้าเป็นใคร" + ชื่อซีรีส์
3. Export: **1080p · 30 fps · H.264 · Bitrate Recommended**

---

## Checklist ก่อนโพสต์
- [ ] หน้าตัวละครเหมือนกันทุกช็อต (ดูไฝ / จุดแดง / ปิ่น)
- [ ] บทพูดตรงตามบททุกคำ
- [ ] ปากตรงเสียง (คลาดได้ไม่เกิน 2 เฟรม)
- [ ] เสียงพูดชัดกว่าดนตรีทุกช่วง
- [ ] ความยาว 1:00 พอดี
