import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const base = process.env.RATHORE_BASE_URL || "http://127.0.0.1:3019";
await mkdir("/tmp/rathore-redesign", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const failures = [];
for (const variant of [
  { name: "desktop", width: 1440, height: 1000, count: 180 },
  { name: "mobile", width: 390, height: 844, count: 120 },
]) {
  const page = await browser.newPage({
    viewport: { width: variant.width, height: variant.height },
    isMobile: variant.name === "mobile",
    hasTouch: variant.name === "mobile",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.querySelector(".journey-canvas")?.dataset.frame === "0",
  );
  const hashes = new Map();
  for (const p of [
    0, 0.08, 0.245, 0.485, 0.735, 0.955, 1, 0.62, 0.32, 0.08, 0,
  ]) {
    await page.evaluate((progress) => {
      const el = document.querySelector(".scroll-journey");
      window.scrollTo({
        top:
          el.getBoundingClientRect().top +
          scrollY +
          (el.offsetHeight - innerHeight) * progress,
        behavior: "instant",
      });
    }, p);
    const expected = Math.round(p * (variant.count - 1));
    await page.waitForFunction(
      (expected) =>
        Number(document.querySelector(".journey-canvas")?.dataset.frame) ===
        expected,
      expected,
      { timeout: 15000 },
    );
    const sample = await page.evaluate(() => {
      const c = document.querySelector(".journey-canvas");
      const data = c
        .getContext("2d")
        .getImageData(0, 0, c.width, c.height).data;
      const pixels = [];
      let hash = 0;
      for (let i = 0; i < data.length; i += 7919) {
        hash = (hash * 31 + data[i]) >>> 0;
        pixels.push(data[i]);
      }
      return { hash, pixels, width: c.width, height: c.height };
    });
    if (hashes.has(expected)) {
      const previous = hashes.get(expected);
      const deltas = sample.pixels.map((v, i) =>
        Math.abs(v - previous.pixels[i]),
      );
      const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      // Chrome may switch from GPU to CPU canvas resampling after readbacks.
      // Measured same-frame difference is ~0.32/255; different camera frames remain distinct.
      if (
        previous.width !== sample.width ||
        previous.height !== sample.height ||
        mean > 1 ||
        Math.max(...deltas) > 24
      )
        throw Error(
          `${variant.name}: returning to frame ${expected} changed the rendered view (mean ${mean})`,
        );
    }
    hashes.set(expected, sample);
    await page.waitForTimeout(280);
    if (
      (await page.locator(".journey-canvas").getAttribute("data-frame")) !==
      String(expected)
    )
      throw Error(`${variant.name}: frame moved without scrolling`);
    console.log(
      "PASS",
      variant.name,
      "scroll",
      p,
      "→ frame",
      expected,
      "holds still",
    );
    if ([0, 0.245, 0.485, 0.735, 1].includes(p))
      await page.screenshot({
        path: `/tmp/rathore-redesign/${variant.name}-frame-${expected}.png`,
      });
    if (p === 1) {
      await page.getByRole("link", { name: "Continue to company overview" }).click();
      await page.waitForFunction(() => {
        const rect = document.querySelector("#at-a-glance")?.getBoundingClientRect();
        return !!rect && rect.top >= -1 && rect.top <= 150;
      });
      if (!page.url().endsWith("#at-a-glance"))
        throw Error(`${variant.name}: final chapter did not continue to the overview`);
      console.log("PASS", variant.name, "final chapter continues to company overview");
    }
  }
  if (new Set([...hashes.values()].map((s) => s.hash)).size < 7)
    throw Error("The sequence does not contain enough distinct images");
  await page.getByRole("button", { name: /Go to The purpose/ }).click();
  await page.waitForFunction(
    (expected) =>
      Number(document.querySelector(".journey-canvas")?.dataset.frame) ===
      expected,
    Math.round(0.485 * (variant.count - 1)),
    { timeout: 15000 },
  );
  console.log("PASS", variant.name, "chapter navigation");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  );
  if (overflow) throw Error(`${variant.name}: horizontal page overflow`);
  await page.close();
}
const reduced = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await reduced.goto(base, { waitUntil: "networkidle" });
await reduced.waitForFunction(
  () => document.querySelector(".journey-canvas")?.dataset.frame === "0",
);
await reduced.evaluate(() =>
  window.scrollTo({ top: 200, behavior: "instant" }),
);
await reduced.waitForTimeout(300);
if (
  (await reduced.locator(".journey-canvas").getAttribute("data-frame")) !== "0"
)
  throw Error("Reduced motion animated unexpectedly");
console.log("PASS reduced-motion still image");
await reduced.close();
await browser.close();
console.log(JSON.stringify({ errors, failures }, null, 2));
if (errors.length || failures.length) process.exitCode = 1;
