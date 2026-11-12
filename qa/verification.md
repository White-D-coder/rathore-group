# Verification — 12 November 2026

## Build and dependencies

- Next.js production static export succeeds for 30 generated routes, including all 17 project details.
- TypeScript passes during the production build and with `npm run typecheck`.
- Dependency installation after the PostCSS patch reports zero known vulnerabilities.

## Functional browser checks

Playwright with installed Google Chrome, desktop viewport 1440 × 1000 and touch viewport 390 × 844:

- The desktop hero creates a WebGL canvas and renders the original bridge scene.
- The four capability models render. Desktop scroll controls the hero camera and pinned capability progression.
- Completed/ongoing project filters, sector filter, project details dialog and Escape dismissal pass.
- Region selection shows the matching real project records.
- Validated enquiry drafts preserve entered content and route tender enquiries to the tender address. No email is sent by the check.
- Mobile drawer navigation works. All seven main routes have no horizontal document overflow.
- Reduced-motion visitors receive the static hero fallback.
- No uncaught browser errors or failed asset requests in the acceptance run.

Screenshots reviewed for desktop hero, about, capabilities, presence, contact and mobile hero/contact. Screenshots are local QA artifacts under `/tmp/rathore-qa`, not production assets, except the explicitly rendered scene fallbacks.

## Lighthouse

An isolated Lighthouse run against `http://127.0.0.1:3019/`, using the compressed production build, standard mobile simulated throttling and headless installed Chrome:

| Category       | Score |
| -------------- | ----: |
| Performance    |    92 |
| Accessibility  |   100 |
| Best Practices |   100 |
| SEO            |   100 |

First Contentful Paint: 1.5 s. Largest Contentful Paint: 3.2 s. Total Blocking Time: 20 ms. Cumulative Layout Shift: 0.036.

Report: `/tmp/rathore-qa/lighthouse-profile-final.json`.

These are local lab results, not field measurements or guarantees for every device. Desktop 3D rendering was checked with Chrome's software WebGL implementation; desktop hardware-GPU performance has not been benchmarked. CDN and device conditions affect deployed performance. A separate timing run made concurrently with software-GPU browser checks was not used as the isolated performance result.

## Source verification

The 32-page `RNB CORPORATE PROFILE 2026.pdf` was subsequently located in Downloads and used as the primary source. All 17 listed projects and values were checked. Actual images for 15 project records, all three leaders, all 12 equipment types and six certificate scans were extracted directly. The map includes all 17 documented regions. Original image references are recorded in `src/data/asset-sources.json`.

The Pali image is identified as an architectural visualization. The two electrical/solar project records use labelled sector illustrations where the PDF has no individual project photograph. Corporate launch should include a final review of current project status and the validity shown on certificate documents.

The contact page independently scores 100 Accessibility, 100 Best Practices and 100 SEO. Certificate lightbox opening, zoom and Escape dismissal, all three approved portraits, all 17 regional records, and matching equipment images also pass the final browser checks.
