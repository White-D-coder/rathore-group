import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const sample = process.argv.includes("--sample");
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const variants = sample
  ? [{ name: "desktop", width: 1600, height: 1000, total: 180 }]
  : [
      { name: "desktop", width: 1280, height: 800, total: 180 },
      { name: "mobile", width: 600, height: 900, total: 120 },
    ];
for (const v of variants) {
  const page = await browser.newPage({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => console.error(e.message));
  await page.goto(
    `http://127.0.0.1:3022/${v.name === "mobile" ? "?mobile" : ""}`,
  );
  await page.waitForFunction(() => window.sceneReady === true);
  const folder = sample ? "/tmp/rathore-redesign" : `public/sequence/${v.name}`;
  await mkdir(folder, { recursive: true });
  const frames = sample
    ? [0, 35, 70, 105, 140, 179]
    : Array.from({ length: v.total }, (_, i) => i);
  for (const i of frames) {
    await page.evaluate(({ i, total }) => window.setFrame(i, total), {
      i,
      total: v.total,
    });
    const data = await page.evaluate(
      () =>
        document
          .querySelector("canvas")
          .toDataURL("image/webp", 0.7)
          .split(",")[1],
    );
    await writeFile(
      `${folder}/${String(i).padStart(3, "0")}.webp`,
      Buffer.from(data, "base64"),
    );
    if (i % 30 === 0) console.log(v.name, i, "/", v.total);
  }
  await page.close();
}
await browser.close();
