import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
const fingerprint=createHash('sha256');
const manifest={basePath:'/film-hq',kind:'real-footage',version:'',desktop:{count:180,width:1920,height:1080},retina:{count:180,width:3840,height:2160},mobile:{count:120,width:1080,height:1920}};
for (const [variant, count, width, height] of [
  ["desktop", 180, 1920, 1080],
  ["retina", 180, 3840, 2160],
  ["mobile", 120, 1080, 1920],
]) {
  const folder = path.resolve("public/film-hq", variant);
  const files = (await readdir(folder)).filter((n) => n.endsWith(".webp"));
  if (files.length !== count)
    throw Error(
      `${variant}: expected ${count} frames, received ${files.length}`,
    );
  let bytes = 0;
  for (let i = 0; i < count; i++) {
    const name = path.join(folder, `${String(i).padStart(3, "0")}.webp`);
    const file = await readFile(name);
    fingerprint.update(variant+String(i));fingerprint.update(file);
    if (
      file.subarray(0, 4).toString() !== "RIFF" ||
      file.subarray(8, 12).toString() !== "WEBP"
    )
      throw Error(`Invalid frame ${name}`);
    if (
      file.subarray(12, 16).toString() === "VP8 " &&
      ((file.readUInt16LE(26) & 0x3fff) !== width ||
        (file.readUInt16LE(28) & 0x3fff) !== height)
    )
      throw Error(`Wrong dimensions: ${name}`);
    if (file.length < 1000) throw Error(`Truncated frame: ${name}`);
    bytes += file.length;
  }
  console.log(
    `${variant}: ${count} complete WebP frames, ${width} × ${height}, ${(bytes / 1024 / 1024).toFixed(2)} MiB`,
  );
}
manifest.version=fingerprint.digest('hex').slice(0,12);
const manifestPath=path.resolve('src/data/sequence-manifest.json');
const text=JSON.stringify(manifest,null,2)+'\n';
let old='';try{old=await readFile(manifestPath,'utf8');}catch{}
if(old!==text)await writeFile(manifestPath,text);
