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

try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.png"), data);
} catch (e) {
  fail(`cannot write to ${outDir}: ${(e as Error).message}`);
}
console.log(`wrote ${join(outDir, "entry.png")} (${data.length} bytes, ${isPng ? "PNG" : "JPEG"})`);
