// SPDX-License-Identifier: MIT
// Copies the pre-rendered entry.png from the bot directory to $MAKEFUN_OUTPUT_DIR/entry.png.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1024 * 1024;

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

const botDir = process.env.MAKEFUN_BOT_DIR || dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const src = join(botDir, "entry.png");

let data: Buffer;
try {
  data = readFileSync(src);
} catch (e) {
  fail(`cannot read ${src}: ${(e as Error).message}`);
}

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_IEND = Buffer.from([0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]); // "IEND" + CRC

if (data.length === 0) fail(`${src} is empty`);
if (data.length > MAX_BYTES) fail(`${src} is ${data.length} bytes, over the ${MAX_BYTES}-byte (1 MiB) limit`);

const isPng = data.length > 16 && data.subarray(0, 8).equals(PNG_SIG);
const isJpeg = data.length > 4 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
if (!isPng && !isJpeg) {
  fail(`${src} is neither PNG nor JPEG (first bytes: ${data.subarray(0, 4).toString("hex")})`);
}
if (isPng && !data.subarray(data.length - 8).equals(PNG_IEND)) {
  fail(`${src} looks truncated: PNG does not end with an IEND chunk`);
}
if (isJpeg && !(data[data.length - 2] === 0xff && data[data.length - 1] === 0xd9)) {
  fail(`${src} looks truncated: JPEG does not end with the FFD9 end-of-image marker`);
}

// Pixel size from the PNG IHDR chunk or the JPEG SOF0/SOF2 marker; null if not found.
function imageSize(buf: Buffer, png: boolean): { w: number; h: number } | null {
  if (png) {
    if (buf.length >= 24 && buf.toString("latin1", 12, 16) === "IHDR") {
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }
    return null;
  }
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    if (marker === 0xff) { i++; continue; }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { i += 2; continue; }
    if (marker === 0xd9 || marker === 0xda) return null;
    const len = buf.readUInt16BE(i + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
    }
    if (len < 2) return null;
    i += 2 + len;
  }
  return null;
}

const size = imageSize(data, isPng);
const dims = size ? `, ${size.w}x${size.h}` : "";

try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.png"), data);
} catch (e) {
  fail(`cannot write to ${outDir}: ${(e as Error).message}`);
}
console.log(`wrote ${join(outDir, "entry.png")} (${data.length} bytes, ${isPng ? "PNG" : "JPEG"}${dims})`);
