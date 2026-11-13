import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const base = process.env.RATHORE_BASE_URL || 'http://127.0.0.1:3001';
await mkdir('/tmp/rathore-refresh', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];
const errors = [];
try {
  for (const variant of [
    { name: 'desktop', width: 1440, height: 1000, deviceScaleFactor: 1 },
    { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2 },
  ]) {
    const page = await browser.newPage({ viewport: { width: variant.width, height: variant.height }, deviceScaleFactor: variant.deviceScaleFactor });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('.journey-canvas')?.dataset.frame === '0');
    assert.equal(await page.locator('.navbar').evaluate(el => getComputedStyle(el).borderBottomWidth), '0px');
    const heading = page.locator('.about-copy h2');
    assert.equal(await heading.locator('.reveal-word').count() > 4, true);
    assert.equal(await heading.evaluate(el => el.classList.contains('is-in-view')), false, 'Text must wait until the reader reaches it');
    await page.screenshot({ path: `/tmp/rathore-refresh/${variant.name}-hero.png` });
    for (const [name, selector] of [
      ['impact', '.stats-section'], ['story', '.about-section'], ['projects', '.projects-section'],
      ['expertise', '.capabilities-section'], ['presence', '.presence-section'], ['execution', '.strengths-section'],
      ['equipment', '.equipment-section'], ['leadership', '.leadership-section'], ['group', '.group-section'],
      ['trust', '.trust-section'], ['responsibility', '.responsibility-section'], ['contact', '.final-cta'],
    ]) {
      await page.locator(selector).evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: 'instant' }));
      await page.waitForTimeout(1500);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `${variant.name} ${name}: horizontal overflow`);
      const borders = await page.locator(selector).evaluate(el => ({ top: getComputedStyle(el).borderTopWidth, bottom: getComputedStyle(el).borderBottomWidth }));
      assert.deepEqual(borders, { top: '0px', bottom: '0px' }, `${name}: decorative section divider remains`);
      await page.screenshot({ path: `/tmp/rathore-refresh/${variant.name}-${name}.png` });
    }
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1400);
    assert.equal(await heading.evaluate(el => el.classList.contains('is-in-view')), true);
    assert.equal(await heading.locator('.reveal-word > span').first().evaluate(el => Number(getComputedStyle(el).opacity)), 1);
    await page.locator('.project-card').first().scrollIntoViewIfNeeded();
    await page.locator('.project-card').first().hover();
    assert.equal(await page.locator('.project-image > img').first().evaluate(el => getComputedStyle(el).transform), 'none', 'Hover must not zoom imagery');
    console.log('PASS', variant.name, 'all 12 section layouts, text reveals, no divider lines or hover zoom');
    await page.close();
  }
  const retina = await browser.newPage({ viewport: { width: 1512, height: 982 }, deviceScaleFactor: 2 });
  await retina.goto(base, { waitUntil: 'networkidle' });
  await retina.waitForFunction(() => document.querySelector('.journey-canvas')?.dataset.frame === '0');
  const detail = await retina.evaluate(() => {
    const section = document.querySelector('.scroll-journey');
    const canvas = document.querySelector('.journey-canvas');
    return { variant: section.dataset.sequenceVariant, width: canvas.width, height: canvas.height, poster: document.querySelector('.journey-poster img').currentSrc };
  });
  assert.equal(detail.variant, 'retina');
  assert.equal(detail.width, 3024);
  assert.equal(detail.height, 1964);
  assert.match(detail.poster, /retina\/000.webp/);
  await retina.evaluate(() => { const el = document.querySelector('.scroll-journey'); scrollTo({ top: (el.offsetHeight - innerHeight) * .485, behavior: 'instant' }); });
  await retina.waitForFunction(() => document.querySelector('.journey-canvas')?.dataset.frame === '87');
  await retina.screenshot({ path: '/tmp/rathore-refresh/retina-hero.png' });
  console.log('PASS Retina 4K frame selection, 3024 × 1964 canvas, exact frame scrubbing');
  await retina.close();
  const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  await reduced.goto(base);
  const word = reduced.locator('.about-copy h2 .reveal-word > span').first();
  assert.equal(await word.evaluate(el => getComputedStyle(el).transform), 'none');
  assert.equal(await word.evaluate(el => Number(getComputedStyle(el).opacity)), 1);
  console.log('PASS reduced-motion text stays fully readable');
  await reduced.close();
} finally { await browser.close(); }
assert.deepEqual(errors, []);
assert.deepEqual(failures, []);
console.log('PASS no uncaught browser errors or failed assets');
