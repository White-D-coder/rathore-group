# Experience refresh verification — 13 November 2026

The homepage now uses distinct, divider-free compositions for its twelve corporate sections. The impact section is a compact unframed band with five supplied metrics. The remaining compositions include an image-led story, offset portfolio photography, a capability index, geographic reach, numbered execution rows, equipment catalogue, staggered leadership portraits, group index, institutional clients and original certificates, responsibility and contact invitation.

## Motion and visual review

`qa/experience-check.mjs` passes on desktop and mobile:

- All twelve sections have no horizontal page overflow and no top/bottom divider borders.
- Heading words remain pending until the reader reaches them, then reveal in a masked stagger. Paragraphs and supporting information enter in sequence. Numeric counts start when their individual values enter the viewport.
- Photographs reveal on scroll; masks are applied to the image child so the observer can measure the unmasked parent. Images substantially within the viewport are checked for their completed reveal.
- Project hover does not scale the photograph. Leadership portrait and certificate hover scaling is also removed.
- The navbar and its enquiry link have no decorative bottom border. Decorative gold rules, card dividers and footer separators are removed.
- Reduced-motion visitors receive readable text and still imagery without the entrance animations.
- Desktop and mobile screenshots are reviewed under `/tmp/rathore-refresh`.

## Hero quality and loading

The source is real Pexels footage by 耀明 钟, `Aerial View of City Skyline with Bridge and River`, with a verified native 3848 × 2160 download. License, exact source URL and extraction settings are recorded in `src/data/footage-sources.json`. The background remains identified as illustrative, rather than a Rathore project.

- Desktop: 180 frames, 1920 × 1080.
- Retina: 180 frames, native 3840 × 2160.
- Mobile: 120 portrait frames, 1080 × 1920.
- WebP quality is 86 rather than the previous 74. Frame dimensions and complete file counts are validated before every build.
- A 1512 × 982 viewport at DPR 2 selects the Retina source and draws to a 3024 × 1964 canvas. This is tested explicitly, including a seek to frame 87.
- Frame cache: eight desktop, two Retina, three mobile. Pending requests are limited to four desktop or two Retina/mobile. Frames load on demand, not all at startup. Higher source quality increases bytes per requested frame; no mobile-network performance score is claimed.
- `qa/scroll-journey-check.mjs` passes exact forward/reverse indices, frozen frames, equivalent return views, chapter controls and final continuation on desktop and mobile. Reduced motion remains still.
- `qa/frame-loading-check.mjs` passes native loading with connect-src blocked, one failed request followed by automatic retry, repeated failures with a visible Retry button, and successful explicit recovery. The last good frame stays visible during a failure.

## Build and interaction regression

TypeScript and the static production build pass for all 30 pages. `qa/browser-check.mjs` passes project filtering, modal keyboard dismissal, region/project selection, enquiry draft creation, mobile navigation and all seven main mobile routes without overflow. No email is sent by a check. No uncaught browser errors or failed assets were recorded.

Prior Lighthouse measurements predate these changes and do not measure this refresh. No new performance audit is claimed.

## Local development repair retained

Development uses `.next-dev/` and production builds use `.next/`, preventing a production build from overwriting the active dev runtime. Tailwind and its PostCSS compiler remain pinned together at 4.1.18, avoiding the earlier ESM-only magic-string incompatibility. Port 3001 is the active development preview; duplicate development servers were stopped.

## Corporate provenance

Company content remains grounded in the supplied 32-page `RNB CORPORATE PROFILE 2026.pdf`. All 17 project records, three original leadership portraits, twelve equipment photographs, seventeen documented regions and six original certificate scans are retained. The Pali architectural visualization and electrical/solar sector illustrations remain identified. Executed project value is kept distinct from turnover and work in hand.
