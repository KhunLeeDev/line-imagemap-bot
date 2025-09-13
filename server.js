// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.LINE_TOKEN;
const PORT = process.env.PORT || 3000;
const PUB  = process.env.PUBLIC_BASE; // เช่น https://615f1f74d354.ngrok-free.app

/** ---------- สำหรับปุ่ม Verify ของ LINE (GET /webhook) ---------- */
app.get("/webhook", (req, res) => res.status(200).send("OK"));

/** ---------- ตั้งแหล่งรูปจริงบน GitHub Pages ---------- */
const IMAGE_SOURCE = {
  "IMG_7937": "https://khunleedev.github.io/line-images/IMG_7937.JPG",
  "IMG_7938": "https://khunleedev.github.io/line-images/IMG_7938.JPG",
  "IMG_7939": "https://khunleedev.github.io/line-images/IMG_7939.JPG",
  "IMG_7940": "https://khunleedev.github.io/line-images/IMG_7940.JPG",
  "Imagemapp": "https://khunleedev.github.io/line-images/Imagemapp.jpg"
};

/**
 * เสิร์ฟรูปแบบที่ LINE ต้องการ
 * LINE จะเรียก:  {baseUrl}/{size}  เช่น /imaps/IMG_7937/1040
 * เรา proxy ไปยังไฟล์จริงบน GitHub แล้วส่งกลับเป็น image/jpeg
 */
app.get("/imaps/:name/:size", async (req, res) => {
  try {
    const name = req.params.name; // เช่น 'IMG_7937'
    const src = IMAGE_SOURCE[name];
    if (!src) return res.sendStatus(404);

    const resp = await axios.get(src, { responseType: "arraybuffer" });
    // ไฟล์ของคุณเป็น .JPG ดังนั้นตั้ง Content-Type เป็น image/jpeg
    res.set("Content-Type", "image/jpeg");
    // (ออปชัน) ใส่ cache header เล็กน้อย
    res.set("Cache-Control", "public, max-age=300");
    res.send(resp.data);
  } catch (e) {
    console.error("IMAGE PROXY ERROR:", e?.response?.status, e?.message);
    res.sendStatus(502);
  }
});

/** ---------- กำหนด Imagemap ทั้งหมด (baseUrl ชี้มาที่โดเมนเราเอง) ---------- */
const IMAPS = {
  1: {
    baseUrl: `${PUB}/imaps/IMG_7937`, // ไม่ใส่ .JPG ต่อท้าย
    baseHeight: 1362,
    altText: "Imagemap 1",
    actions: [
      { type: "message", text: "Buy",              area: { x: 179, y: 529, width: 314, height: 310 } },
      { type: "message", text: "Rent",             area: { x: 589, y: 531, width: 306, height: 309 } },
      { type: "message", text: "Sell | Rent Out",  area: { x: 185, y: 911, width: 306, height: 307 } },
      { type: "message", text: "Contact Us", area: { x: 592, y: 911, width: 304, height: 305 } },
    ]
  },
  2: {
    baseUrl: `${PUB}/imaps/IMG_7938`,
    baseHeight: 1362,
    altText: "Imagemap 2 (Buy)",
    actions: [
      { type: "message", text: "Buy → Condo",               area: { x: 187, y: 290, width: 308, height: 308 } },
      { type: "message", text: "Buy → Pool Villa",          area: { x: 178, y: 292, width: 720, height: 683 } },
      { type: "message", text: "Buy → Single House",        area: { x: 186, y: 671, width: 310, height: 310 } },
      { type: "message", text: "Buy → Townhome",            area: { x: 594, y: 668, width: 307, height: 316 } },
      { type: "message", text: "Buy → Commercial Building", area: { x: 188, y: 1052, width: 306, height: 307 } },
      { type: "message", text: "Buy → Land",                area: { x: 590, y: 1051, width: 308, height: 311 } },
    ]
  },
  3: {
    baseUrl: `${PUB}/imaps/IMG_7939`,
    baseHeight: 1363,
    altText: "Imagemap 3 (Rent)",
    actions: [
      { type: "message", text: "Rent → Condo",               area: { x: 186, y: 290, width: 308, height: 311 } },
      { type: "message", text: "Rent → Pool Villa",          area: { x: 588, y: 283, width: 309, height: 317 } },
      { type: "message", text: "Rent → Single House",        area: { x: 178, y: 670, width: 316, height: 313 } },
      { type: "message", text: "Rent → Townhome",            area: { x: 589, y: 670, width: 313, height: 311 } },
      { type: "message", text: "Rent → Commercial Building", area: { x: 184, y: 1055, width: 308, height: 303 } },
      { type: "message", text: "Rent → Land",                area: { x: 589, y: 1037, width: 310, height: 326 } },
    ]
  },
  4: {
    baseUrl: `${PUB}/imaps/IMG_7940`,
    baseHeight: 1322,
    altText: "Imagemap 4 (Service)",
    actions: [
      { type: "message", text: "Service → Living Management",   area: { x: 175, y: 409, width: 330, height: 328 } },
      { type: "message", text: "Service → Facility Management", area: { x: 575, y: 409, width: 328, height: 327 } },
      { type: "message", text: "Service → Home Construction",   area: { x: 176, y: 770, width: 331, height: 331 } },
      { type: "message", text: "Service → Insurance",           area: { x: 576, y: 771, width: 324, height: 328 } },
      { type: "message", text: "Service → Home Service",        area: { x: 182, y: 1129, width: 715, height: 193 } },
    ]
  },
  5: {
    baseUrl: `${PUB}/imaps/Imagemapp`,
    baseHeight: 1319,
    altText: "Imagemap 5 (Home Service)",
    actions: [
      { type: "message", text: "Home Service → Cleaning",           area: { x: 177, y: 405, width: 329, height: 330 } },
      { type: "message", text: "Home Service → Install, Repair",    area: { x: 573, y: 407, width: 329, height: 334 } },
      { type: "message", text: "Home Service → Swimming Pool",      area: { x: 176, y: 774, width: 329, height: 329 } },
      { type: "message", text: "Home Service → Home Improvements",  area: { x: 572, y: 772, width: 328, height: 328 } },
      { type: "message", text: "Home Service → Garden Management",  area: { x: 182, y: 1129, width: 716, height: 190 } },
    ]
  },
};

function toImagemap(id) {
  const c = IMAPS[id];
  if (!c) return null;
  return {
    type: "imagemap",
    baseUrl: c.baseUrl, // ตอนส่งให้ LINE จะกลายเป็น {PUB}/imaps/IMG_xxxx/{size}
    altText: c.altText,
    baseSize: { width: 1040, height: c.baseHeight || 1040 },
    actions: c.actions
  };
}

// ข้อความที่ทำให้เด้งไป imagemap ตามเงื่อนไข
const TEXT_TO_IMAP = {
  "Buy": 2,
  "Rent": 3,
  "Hamilton Service": 4,
  "Service → Home Service": 5
};

// คำเริ่มต้น flow
const START_WORDS = new Set(["เมนู", "สนใจ", "start", "Start"]);

/** ---------- Webhook รับอีเวนต์จาก LINE ---------- */
app.post("/webhook", async (req, res) => {
  try {
    const events = Array.isArray(req.body?.events) ? req.body.events : [];

    for (const ev of events) {
      if (ev.type === "message" && ev.message?.type === "text") {
        const text = (ev.message.text || "").trim();

        if (START_WORDS.has(text)) {
          await reply(ev.replyToken, [toImagemap(1)]);
          continue;
        }

        const target = TEXT_TO_IMAP[text];
        if (target) {
          await reply(ev.replyToken, [toImagemap(target)]);
          continue;
        }

        // ถ้าไม่ตรงเงื่อนไข → เงียบ (ไม่ตอบกลับ)
      }
    }

    res.sendStatus(200); // ตอบ 200 เสมอ
  } catch (e) {
    console.error("WEBHOOK ERROR:", e?.response?.data || e);
    res.sendStatus(200);
  }
});

// === วางต่อท้ายไฟล์ server.js ตรงนี้ ===

// ส่งข้อความกลับไปยังผู้ใช้ผ่าน LINE Reply API
async function reply(replyToken, messages) {
  const url = "https://api.line.me/v2/bot/message/reply";
  await axios.post(
    url,
    { replyToken, messages },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}

// health check ง่าย ๆ
app.get("/", (_, res) => res.send("OK"));

// เริ่มฟังพอร์ต
app.listen(PORT, () => {
  console.log("Webhook running on port", PORT);
});
