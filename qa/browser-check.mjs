import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("/tmp/rathore-qa", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
const failures = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
});
await page.goto("http://127.0.0.1:3018/", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.locator(".scene-hero canvas").waitFor({ timeout: 15000 });
await page.screenshot({ path: "/tmp/rathore-qa/desktop-hero.png" });
console.log(
  "Hero:",
  await page.locator("h1").innerText(),
  "Canvases:",
  await page.locator("canvas").count(),
);
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await page.screenshot({ path: "/tmp/rathore-qa/desktop-about.png" });
await page.locator("#capabilities").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await page.screenshot({ path: "/tmp/rathore-qa/desktop-capabilities.png" });
await page.goto("http://127.0.0.1:3018/projects/", {
  waitUntil: "networkidle",
});
await page.getByRole("tab", { name: /Ongoing projects/ }).click();
if ((await page.locator(".project-card").count()) !== 9)
  throw Error("Ongoing projects filter failed");
await page
  .getByRole("combobox", { name: "Filter projects by sector" })
  .selectOption("Buildings");
if ((await page.locator(".project-card").count()) !== 2)
  throw Error("Sector filter failed");
await page.locator(".project-card").first().click();
if (!(await page.locator(".project-dialog").evaluate((d) => d.open)))
  throw Error("Project dialog did not open");
await page.keyboard.press("Escape");
if (await page.locator(".project-dialog").evaluate((d) => d.open))
  throw Error("Project dialog did not close with Escape");
console.log("PASS project filters and modal keyboard dismissal");
await page.goto("http://127.0.0.1:3018/our-presence/", {
  waitUntil: "networkidle",
});
await page.getByRole("button", { name: "Ladakh", exact: true }).click();
if (
  !(await page.locator(".region-detail").innerText()).includes("Lukung–Chartse")
)
  throw Error("Region project selection failed");
console.log("PASS region/project selection");
await page.goto("http://127.0.0.1:3018/contact/", { waitUntil: "networkidle" });
await page.getByLabel("Full name").fill("QA Reviewer");
await page.getByLabel("Email address").fill("qa@example.com");
await page
  .getByLabel("Organization", { exact: true })
  .fill("Test Organization");
await page.getByLabel("Enquiry type").selectOption("Tender opportunity");
await page
  .getByLabel("Your message")
  .fill(
    "We would like to discuss a water infrastructure project in Maharashtra.",
  );
await page.getByRole("button", { name: "Prepare enquiry" }).click();
const mailto = await page
  .getByRole("link", { name: "Open email app" })
  .getAttribute("href");
if (
  !mailto.startsWith("mailto:tender@rathoregroup.co?") ||
  !mailto.includes("QA%20Reviewer")
)
  throw Error("Enquiry draft failed");
console.log("PASS enquiry generation and tender routing; no email sent");
await page.screenshot({
  path: "/tmp/rathore-qa/desktop-contact.png",
  fullPage: true,
});
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
mobile.on("pageerror", (e) => errors.push(e.message));
await mobile.goto("http://127.0.0.1:3018/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(1800);
await mobile.screenshot({ path: "/tmp/rathore-qa/mobile-hero.png" });
await mobile.getByRole("button", { name: "Open navigation" }).click();
if (!(await mobile.locator(".mobile-menu").evaluate((d) => d.open)))
  throw Error("Mobile menu failed");
await mobile
  .getByRole("navigation", { name: "Mobile navigation" })
  .getByRole("link", { name: /Contact/ })
  .click();
await mobile.waitForURL("**/contact/");
console.log("PASS mobile navigation");
for (const route of [
  "/",
  "/about/",
  "/capabilities/",
  "/projects/",
  "/our-presence/",
  "/leadership/",
  "/contact/",
]) {
  await mobile.goto("http://127.0.0.1:3018" + route, {
    waitUntil: "networkidle",
  });
  const width = await mobile.evaluate(() => ({
    viewport: innerWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (width.page > width.viewport + 1)
    throw Error(`Horizontal overflow on ${route}: ${JSON.stringify(width)}`);
  console.log("PASS mobile route / overflow:", route);
}
await mobile.screenshot({
  path: "/tmp/rathore-qa/mobile-contact.png",
  fullPage: true,
});
const reduced = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await reduced.goto("http://127.0.0.1:3018/", { waitUntil: "networkidle" });
if (await reduced.locator(".scene-hero canvas").count())
  throw Error("Reduced motion hero should use static fallback");
console.log("PASS reduced motion fallback");
console.log(JSON.stringify({ errors, failures }, null, 2));
await browser.close();
if (errors.length || failures.length) process.exitCode = 1;
