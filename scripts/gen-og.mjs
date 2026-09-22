// Genera public/og.png (1200x630) — tarjeta social del brand kit arena, sin text engine.
// Blocarte el logo-module: cuadro volt redondeado + pulso carbon (idéntico a Logo.astro).
// Uso: node scripts/gen-og.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og.png");

const W = 1200;
const H = 630;

// Paleta del brand kit (tema arena)
const BG = [243, 241, 235]; // #F3F1EB
const LINE = [229, 223, 212]; // #E5DFD4
const CARBON = [17, 19, 17]; // #111311
const VOLT = [164, 238, 0]; // #A4EE00

const px = new Uint8Array(W * H * 4);

function set(x, y, [r, g, b], a = 255) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  px[i] = r;
  px[i + 1] = g;
  px[i + 2] = b;
  px[i + 3] = a;
}

function blend(x, y, [r, g, b], a) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  const na = Math.max(0, Math.min(1, a / 255));
  px[i] = Math.round(px[i] * (1 - na) + r * na);
  px[i + 1] = Math.round(px[i + 1] * (1 - na) + g * na);
  px[i + 2] = Math.round(px[i + 2] * (1 - na) + b * na);
}

function fill(r, g, b) {
  for (let i = 0; i < W * H * 4; i += 4) {
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = 255;
  }
}

/** Círculo con antialias */
function dot(cx, cy, radius, color) {
  const x0 = Math.floor(cx - radius - 1);
  const x1 = Math.ceil(cx + radius + 1);
  const y0 = Math.floor(cy - radius - 1);
  const y1 = Math.ceil(cy + radius + 1);
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= radius) set(x, y, color);
      else if (d < radius + 1) blend(x, y, color, Math.max(0, radius + 1 - d) * 255);
    }
}

/** Segmento grueso con antialias (caps redondeados) */
function stroke(x0, y0, x1, y1, thickness, color) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.max(2, Math.ceil(len * 2));
  const r = thickness / 2;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    dot(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, color);
  }
}

/** Rectángulo redondeado con antialias */
function roundRect(ox, oy, w, h, radius, color) {
  const x0 = Math.floor(ox);
  const y0 = Math.floor(oy);
  const x1 = Math.ceil(ox + w);
  const y1 = Math.ceil(oy + h);
  const cx0 = ox + radius;
  const cy0 = oy + radius;
  const cx1 = ox + w - radius;
  const cy1 = oy + h - radius;
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const nx = x < cx0 ? cx0 : x > cx1 ? cx1 : x;
      const ny = y < cy0 ? cy0 : y > cy1 ? cy1 : y;
      const d = Math.hypot(x - nx, y - ny);
      if (d <= radius) set(x, y, color);
      else if (d < radius + 1) blend(x, y, color, Math.max(0, radius + 1 - d) * 255);
    }
}

// ─── Fondo arena ───
fill(BG[0], BG[1], BG[2]);

// ─── Cuadrícula técnica (sutil, arena) ───
for (let x = 0; x < W; x += 44) for (let y = 0; y < H; y++) set(x, y, LINE);
for (let y = 0; y < H; y += 44) for (let x = 0; x < W; x++) set(x, y, LINE);

// ─── Marco interior carbon ───
const FR = 26;
for (let i = 0; i < 3; i++)
  for (let k = FR; k < W - FR; k++) {
    set(k, FR + i, CARBON);
    set(k, H - FR - 1 - i, CARBON);
  }
for (let i = 0; i < 3; i++)
  for (let k = FR; k < H - FR; k++) {
    set(FR + i, k, CARBON);
    set(W - FR - 1 - i, k, CARBON);
  }

// ─── Marca RivalFit (cuadro volt + pulso carbon), escala 1:8 desde 32px ───
const S = 8;
const MX = W - 250 - 32 * S; // margen derecho
const MY = (H - 32 * S) / 2;
roundRect(MX, MY, 32 * S, 32 * S, 30, VOLT);

const shape = [
  { kind: "line", x0: 8 * S + MX, y0: 20 * S + MY, x1: 15 * S + MX, y1: 20 * S + MY },
  { kind: "line", x0: 15 * S + MX, y0: 20 * S + MY, x1: 18 * S + MX, y1: 12 * S + MY },
  { kind: "line", x0: 18 * S + MX, y0: 12 * S + MY, x1: 23 * S + MX, y1: 21 * S + MY },
  { kind: "line", x0: 23 * S + MX, y0: 21 * S + MY, x1: 26 * S + MX, y1: 21 * S + MY },
  { kind: "dot", cx: 8 * S + MX, cy: 20 * S + MY, r: 2.4 * S },
  { kind: "dot", cx: 23 * S + MX, cy: 21 * S + MY, r: 2.4 * S },
];

const SW = 3.2 * S / 2; // medio ancho de trazo
for (const el of shape) {
  if (el.kind === "line") stroke(el.x0, el.y0, el.x1, el.y1, SW * 2, CARBON);
  else dot(el.cx, el.cy, el.r, CARBON);
}

// ─── Acento pequeño: barra volt bajo el marco (izquierda) ───
for (let x = FR + 40; x < FR + 40 + 120; x++)
  for (let i = 0; i < 8; i++) set(x, H - FR - 40 + i, VOLT);

// PNG encoder
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 6;
const raw = Buffer.alloc((W * 4 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0;
  Buffer.from(px.buffer, y * W * 4, W * 4).copy(raw, y * (W * 4 + 1) + 1);
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync(OUT, png);
console.log(`og.png generado → ${OUT} (${png.length} bytes)`);