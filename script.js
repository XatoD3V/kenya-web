/* ===== Datos ===== */
const dishes = [
  { name: "Kimchi", ko: "김치", emoji: "🥬", c: ["#ffd1e5", "#f9a8d4"],
    text: "Col napa fermentada con gochugaru, ajo y jengibre. Es el acompañamiento esencial de casi toda comida coreana." },
  { name: "Bibimbap", ko: "비빔밥", emoji: "🍚", c: ["#ffe3ef", "#d8b4fe"],
    text: "Arroz con verduras salteadas, carne, huevo y salsa gochujang. Se mezcla todo antes de comer." },
  { name: "Bulgogi", ko: "불고기", emoji: "🥩", c: ["#e9d5ff", "#f9a8d4"],
    text: "Finas láminas de ternera marinadas en soja, pera y azúcar, cocinadas a la parrilla." },
  { name: "Tteokbokki", ko: "떡볶이", emoji: "🌶️", c: ["#ffc2dc", "#c4a1ff"],
    text: "Pastelitos de arroz en una salsa dulce y picante. Es la comida callejera favorita en Seúl." },
  { name: "Samgyeopsal", ko: "삼겹살", emoji: "🥓", c: ["#ffd9e8", "#b57bff"],
    text: "Panceta de cerdo asada en la mesa y envuelta en hojas de lechuga con ajo y ssamjang." },
  { name: "Japchae", ko: "잡채", emoji: "🍜", c: ["#f3e8ff", "#ffb3d1"],
    text: "Fideos de batata salteados con verduras y aceite de sésamo, un plato típico de celebraciones." }
];

const videos = ["Cómo preparar kimchi", "Mercado callejero de Seúl", "Barbacoa coreana en casa"];

const audios = [
  { name: "Melodía del mercado", notes: [0, 2, 4, 7, 9, 7, 4, 2], bpm: 110, icon: "🎶" },
  { name: "Té al atardecer", notes: [9, 7, 4, 2, 0, 2, 4, 0], bpm: 80, icon: "🍵" },
  { name: "Festival de primavera", notes: [0, 4, 7, 9, 12, 9, 7, 4], bpm: 140, icon: "🌸" }
];

/* ===== Utilidades ===== */
const $ = (id) => document.getElementById(id);

function svgImage(emoji, [a, b], label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="640" height="480" fill="url(#g)"/>
    <text x="320" y="250" font-size="170" text-anchor="middle">${emoji}</text>
    <text x="320" y="420" font-size="34" text-anchor="middle" fill="#7c3aed" font-family="sans-serif" font-weight="bold">${label}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function makeWav(notes, bpm) {
  const rate = 22050, beat = 60 / bpm, loops = 4;
  const total = Math.floor(rate * beat * notes.length * loops);
  const buf = new ArrayBuffer(44 + total * 2), v = new DataView(buf);
  const str = (o, s) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  str(0, "RIFF"); v.setUint32(4, 36 + total * 2, true); str(8, "WAVEfmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, "data"); v.setUint32(40, total * 2, true);
  const per = Math.floor(rate * beat);
  for (let i = 0; i < total; i++) {
    const n = notes[Math.floor(i / per) % notes.length], t = (i % per) / rate;
    const f = 261.63 * Math.pow(2, n / 12), env = Math.exp(-3 * t / beat);
    const s = (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)) * env * 0.45;
    v.setInt16(44 + i * 2, s * 32767, true);
  }
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

/* Botones para cambiar un recurso (archivo local o enlace) */
function mediaActions(el, kind, accept) {
  const box = document.createElement("div");
  box.className = "actions";

  const label = document.createElement("label");
  label.className = "file-btn";
  label.textContent = `Cambiar ${kind}`;
  const input = document.createElement("input");
  input.type = "file"; input.accept = accept;
  input.addEventListener("change", () => {
    const f = input.files[0];
    if (f) setSource(el, URL.createObjectURL(f));
  });
  label.appendChild(input);

  const link = document.createElement("button");
  link.type = "button"; link.className = "link-btn"; link.textContent = "Usar enlace";
  link.addEventListener("click", () => {
    const url = prompt(`Pega el enlace del ${kind}:`);
    if (url) setSource(el, url.trim());
  });

  box.append(label, link);
  return box;
}

function setSource(el, url) {
  el.src = url;
  if (el.tagName !== "IMG") { el.removeAttribute("poster"); el.load(); }
}

/* ===== Render ===== */
dishes.forEach((d) => {
  const card = document.createElement("article");
  card.className = "card";
  const img = document.createElement("img");
  img.src = svgImage(d.emoji, d.c, d.name);
  img.alt = `Imagen de ${d.name}`;
  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `<h3>${d.name}<small>${d.ko}</small></h3><p>${d.text}</p>`;
  body.appendChild(mediaActions(img, "imagen", "image/*"));
  card.append(img, body);
  $("dishes").appendChild(card);
});

videos.forEach((title, i) => {
  const card = document.createElement("article");
  card.className = "card";
  const vid = document.createElement("video");
  vid.controls = true; vid.preload = "metadata";
  vid.poster = svgImage("🎬", ["#e9d5ff", "#ffc8dd"], `Video ${i + 1}`);
  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `<h3>${title}</h3>`;
  body.appendChild(mediaActions(vid, "video", "video/*"));
  card.append(vid, body);
  $("videoGrid").appendChild(card);
});

audios.forEach((a) => {
  const card = document.createElement("article");
  card.className = "card audio-card";
  const au = document.createElement("audio");
  au.controls = true; au.src = makeWav(a.notes, a.bpm);
  const body = document.createElement("div");
  body.className = "card-body";
  body.style.padding = "0";
  body.innerHTML = `<div class="audio-icon">${a.icon}</div><h3>${a.name}</h3>`;
  body.append(au, mediaActions(au, "audio", "audio/*"));
  card.appendChild(body);
  $("audioGrid").appendChild(card);
});

/* ===== Título dinámico ===== */
const title = $("title");
[...title.textContent].forEach((ch, i) => {
  const s = document.createElement("span");
  s.className = ch === " " ? "ch sp" : "ch";
  s.style.setProperty("--i", i);
  s.textContent = ch === " " ? "\u00A0" : ch;
  s.setAttribute("aria-hidden", "true");
  title.appendChild(s);
});
title.firstChild && [...title.childNodes].filter((n) => n.nodeType === 3).forEach((n) => n.remove());

const words = ["김치 Kimchi", "비빔밥 Bibimbap", "불고기 Bulgogi", "떡볶이 Tteokbokki", "삼겹살 Samgyeopsal", "잡채 Japchae"];
let w = 0;
setInterval(() => { w = (w + 1) % words.length; $("rotator").textContent = words[w]; }, 2200);

/* Pétalos cayendo */
const petals = document.querySelector(".petals");
for (let i = 0; i < 16; i++) {
  const p = document.createElement("span");
  p.textContent = "🌸";
  p.style.left = Math.random() * 100 + "%";
  p.style.animationDuration = 7 + Math.random() * 8 + "s";
  p.style.animationDelay = -Math.random() * 10 + "s";
  petals.appendChild(p);
}