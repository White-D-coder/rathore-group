import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const base = process.env.RATHORE_BASE_URL || 'http://127.0.0.1:3019';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const variant of [
    { name: 'desktop', width: 1440, height: 1000, deviceScaleFactor: 1 },
    { name: 'retina', width: 1512, height: 982, deviceScaleFactor: 2 },
    { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2 },
  ]) {
    const page = await browser.newPage({ viewport: { width: variant.width, height: variant.height }, deviceScaleFactor: variant.deviceScaleFactor, reducedMotion: 'no-preference' });
    await page.goto(base, { waitUntil: 'networkidle' });
    const session = await page.context().newCDPSession(page);
    await session.send('Network.emulateNetworkConditions', { offline: false, latency: 350, downloadThroughput: 2 * 1024 * 1024, uploadThroughput: 1024 * 1024 });
    let fullRequests = 0;
    page.on('request', request => { if (request.url().includes('/film-hq/')) fullRequests++; });
    for (const reverse of [false, true]) {
      const frames = [];
      for (let i = 0; i < 45; i++) {
        const progress = reverse ? (44 - i) / 60 : i / 60;
        await page.evaluate(p => {
          const section = document.querySelector('.scroll-journey');
          scrollTo({ top: section.getBoundingClientRect().top + scrollY + (section.offsetHeight - innerHeight) * p, behavior: 'instant' });
        }, progress);
        await page.waitForTimeout(45);
        frames.push(Number(await page.locator('.journey-canvas').getAttribute('data-frame')));
      }
      assert.ok(new Set(frames).size >= 20, `${variant.name}: hero froze during ${reverse ? 'reverse' : 'forward'} scrolling`);
      await page.waitForFunction(() => {
        const section = document.querySelector('.scroll-journey');
        return section.dataset.frameQuality === 'full' && section.dataset.requestedFrame === document.querySelector('.journey-canvas').dataset.frame;
      }, null, { timeout: 15000 });
    }
    assert.ok(fullRequests < 10, 'Continuous scrolling must not repeatedly start and cancel full-resolution requests');
    console.log(`PASS ${variant.name}: forward/reverse motion at 350ms latency, full-quality resting frames, ${fullRequests} full-frame requests`);
    await page.close();
  }
} finally { await browser.close(); }
