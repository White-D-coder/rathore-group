import { spawn } from "node:child_process";
const source = process.argv[2];
if (!source) throw Error("Usage: node qa/sequence/render.mjs /absolute/path/to/highway.mp4");
// ffmpeg decodes the real flight; Pillow encodes the optimized WebP frames.
const child = spawn("python3", ["qa/sequence/extract.py", source], { stdio: "inherit" });
child.on("error", error => { throw error; });
child.on("close", code => { process.exitCode = code ?? 1; });
