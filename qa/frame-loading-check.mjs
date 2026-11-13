import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base = process.env.RATHORE_BASE_URL || 'http://127.0.0.1:3019';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function seek(page, index) {
  await page.evaluate(index => {
    const root = document.querySelector('.scroll-journey');
    scrollTo({ top: root.getBoundingClientRect().top + scrollY + (root.offsetHeight - innerHeight) * index / 179, behavior: 'instant' });
  }, index);
}
async function frame(page, index) {
  await page.waitForFunction(index => document.querySelector('.journey-canvas')?.dataset.frame === String(index), index, { timeout: 15000 });
}
try {
  const strict = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await strict.route(base + '/', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': "connect-src 'none'" } });
  });
  await strict.goto(base, { waitUntil: 'networkidle' });
  await frame(strict, 0);
  const blocked = await strict.evaluate(async () => {
    try { await fetch('/film-hq/desktop/087.webp'); return false; } catch { return true; }
  });
  assert.equal(blocked, true, 'Test must actually block fetch connections');
  await seek(strict, 87);
  await frame(strict, 87);
  console.log('PASS native frame loading with connect-src none');
  await strict.close();

  const automatic = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let failedOnce = false;
  await automatic.route('**/film-hq/desktop/087.webp?*', async route => {
    if (!failedOnce) {
      failedOnce = true;
      await route.fulfill({ status: 503, body: 'Temporary frame failure', headers: { 'cache-control': 'no-store' } });
    } else await route.continue();
  });
  await automatic.goto(base, { waitUntil: 'networkidle' });
  await frame(automatic, 0);
  await seek(automatic, 87);
  await frame(automatic, 87);
  assert.equal(failedOnce, true);
  console.log('PASS automatic recovery after a failed frame request');
  await automatic.close();

  const recovery = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let failing = true;
  let failures = 0;
  await recovery.route('**/film-hq/desktop/087.webp?*', async route => {
    if (failing) {
      failures++;
      await route.fulfill({ status: 503, body: 'Frame unavailable', headers: { 'cache-control': 'no-store' } });
    } else await route.continue();
  });
  await recovery.goto(base, { waitUntil: 'networkidle' });
  await frame(recovery, 0);
  await seek(recovery, 87);
  await recovery.getByRole('button', { name: 'Retry', exact: true }).waitFor();
  assert.equal(failures, 2, 'Bound automatic requests during a persistent outage');
  assert.equal(await recovery.locator('.journey-canvas').getAttribute('data-frame'), '0', 'Keep last good view while loading fails');
  await seek(recovery, 0);
  await recovery.waitForFunction(() => document.querySelector('.scroll-journey')?.dataset.loadState === 'ready');
  await seek(recovery, 87);
  await recovery.getByRole('button', { name: 'Retry', exact: true }).waitFor();
  await recovery.waitForTimeout(600);
  assert.equal(await recovery.getByRole('button', { name: 'Retry', exact: true }).isVisible(), true, 'Revisiting a failed frame keeps recovery available');
  failing = false;
  await recovery.getByRole('button', { name: 'Retry', exact: true }).click();
  await frame(recovery, 87);
  assert.equal(await recovery.locator('.scroll-journey').getAttribute('data-load-state'), 'ready');
  assert.equal(await recovery.getByRole('button', { name: 'Retry', exact: true }).count(), 0);
  console.log('PASS visible failure state and manual recovery to the requested frame');
  await recovery.close();
} finally { await browser.close(); }
