# Rathore Group

A Next.js App Router / TypeScript corporate website with a cinematic, frame-by-frame scroll sequence, real filmed infrastructure footage, an interactive geographic map, and Tailwind CSS. The site exports to static HTML for deployment. It does not replace the company's existing public domain.

## Run

```sh
npm ci
npm run dev
```

Build with `npm run build`. The deployment output is `out/`. `npm run typecheck` checks TypeScript. Use Node.js 22 or later.

For a production-style local preview with compression and caching, build and run `node qa/preview-server.mjs`, then open `http://127.0.0.1:3019`.

The development server uses `.next-dev/`; production builds use `.next/`. This lets a local server stay open during a production build without mixing development and production chunks. If an older server is already running after this configuration changes, restart it once with `npm run dev`. Tailwind and its PostCSS plugin are pinned together at 4.1.18 to keep their compiler compatible with this Node 22 development environment; update them together and check both `dev` and `build`.

## Content and structure

- `src/data/company.ts`: company details, independently editable metrics, all 17 supplied projects and values, capabilities, leadership, companies, equipment, and registrations.
- `src/components/ScrollJourney.tsx`: native-scroll image-sequence player, five chapters, bounded decoded-frame cache, reverse scrubbing and desktop, 4K Retina and mobile frames.
- `src/components/RevealText.tsx` and `Motion.tsx`: React-owned masked word reveals, scroll-triggered paragraph and photograph entrances, viewport-triggered numbers, reduced-motion support.
- `src/app/experience.css`: divider-free section compositions and the compact impact band.
- `qa/sequence/render.mjs` and `extract.py`: extract real footage into optimized WebP frames using ffmpeg and Pillow. The main sequence needs no live WebGL at runtime.
- `src/data/footage-sources.json`: original clip, license, extraction settings and usage provenance.
- `qa/sequence/validate.mjs`: validates all 480 frames before each build.
- `src/components/IndiaMapScene.tsx`: extruded geographic map with scroll-controlled camera framing.
- `src/data/india.json`: projected Natural Earth map geometry, not a boundary reference.
- `src/components/Sections.tsx`: corporate content and interactive portfolio, regional selection and equipment browser.
- `src/components/Contact.tsx`: validated enquiry-to-email-draft workflow. No information is submitted or stored by the site.
- `src/app/[section]/page.tsx`: about, capabilities, projects, presence, leadership, contact, privacy.
- `src/app/projects/[slug]/page.tsx`: statically generated project pages.
- `src/app/globals.css` and `src/app/redesign.css`: editorial design system, responsive layouts and motion preferences.

The crest is the original official artwork, displayed at its original proportions. The sequence is a continuous real drone flight from a native 3848 × 2160 source, used as illustrative stock footage rather than a company project. Desktop has 180 Full HD frames; Retina displays have 180 native 3840 × 2160 frames; mobile has 120 portrait 1080 × 1920 frames. Reduced-motion visitors receive a still image and can explicitly select chapters.

## Frame-by-frame behavior

Native scroll progress maps to `round(progress × (frameCount - 1))`. A single lightweight sprite sheet keeps the flight moving while scrolling, including on high-latency connections. After a 120ms pause, the exact Full HD, 4K Retina or portrait frame replaces the preview. No autoplay or delayed page scrolling drives the sequence. Reversing retraces the same flight; headings follow the displayed frame. The full-quality decoded cache is capped at eight Full HD frames, two 4K Retina frames or three mobile frames, plus one preview sheet. Canvas resolution follows device pixel ratio up to 2. Native image loading supports strict connection policies, automatic retry and manual recovery; the matching preview remains visible if a full-quality request fails.

The journey uses one sticky viewport. Subsequent company sections scroll normally. The previous extra pinned capability/equipment panels were removed. Project filters and modals, the regional map, actual equipment photographs, portraits, certificates and the enquiry workflow remain functional.

To regenerate the assets, download the licensed original linked in `src/data/footage-sources.json` outside the checkout, then run `node qa/sequence/render.mjs /absolute/path/to/highway.mp4` followed by `python3 qa/sequence/previews.py`. Requires ffmpeg and Python Pillow. The extractor writes the full-quality WebP files under `public/film-hq`; preview sheets are written under `public/film-preview`. The production build validates and fingerprints both.

## Source material and content review

The primary source is the user's `/Users/deeptanubhunia/Downloads/RNB CORPORATE PROFILE 2026.pdf` (32 pages). The initial design brief provides the creative direction. Approved photos, portraits, equipment images and certificate scans were extracted directly from that PDF, with original image object references recorded in `src/data/asset-sources.json`.

- All 17 listed project records and their documented values were checked against profile pages 18–23. Fifteen have project-specific images from the profile. The Pali image is explicitly labelled as a profile architectural visualization. CCTV and solar lighting records use clearly labelled sector illustrations because the profile provides descriptions rather than individual photos.
- Leadership portraits and biographies come from pages 8–9. All three portraits are original approved images.
- All 12 equipment types use the corresponding actual equipment images on page 24. Visitors use previous/next and item selection to inspect the corresponding approved photograph.
- The interactive map includes all 17 regions documented on page 17. Regional presence is distinguished from the status of individual named projects; no project details are invented for profile-only regions.
- Six certificate scans from pages 25 and 27 open in an accessible lightbox with zoom and original-image download. The document names and source pages are visible; validity remains governed by the original scans. Government registrations from page 15 are listed separately.
- Company metrics remain editable. The ₹3,000+ crore executed-project metric (page 2) is kept separate from group turnover (page 4) and projects in hand (page 11), which are not conflated or added together.
- The registered address and contact details follow page 32. Check operational contact and project status at the time of public launch.

The original logo and a small number of sector illustrations also come from the company's existing website. The crest's artwork and proportions are preserved. The separate visual-reference attachment was not supplied; the navy/gold direction is implemented from the brief.

The contact form clearly prepares a local email draft for the visitor to review and send. Connect a mail backend if direct form submission is desired.

## Verification

`qa/scroll-journey-check.mjs` checks exact forward/reverse frame indices, stopped playback, equivalent return views, chapter navigation, mobile scrubbing, overflow and reduced motion. Chrome GPU/CPU canvas resampling differs slightly at subpixel edges; the return-view check allows a measured mean difference below 1/255 while requiring the exact frame index.

`qa/frame-loading-check.mjs` checks scrubbing with connections blocked by CSP, automatic retry after an image failure, and explicit recovery after repeated failures.

`qa/hero-network-check.mjs` checks continuous forward/reverse scrolling at 350ms network latency on desktop, Retina and mobile, followed by full-quality resting frames. It also checks that wheel events do not repeatedly start full-resolution downloads.

`qa/experience-check.mjs` verifies all twelve desktop/mobile section layouts, word animation, photograph reveals, absence of decorative section borders, absence of hover image scaling, Retina frame selection and reduced-motion text visibility.

`qa/browser-check.mjs` checks project filters, modal dismissal, regional selection, enquiry draft generation, mobile navigation and all main mobile routes. Set `RATHORE_BASE_URL` to change its default `http://127.0.0.1:3019`. No check sends an email.

Current verification and lab measurements are recorded in `qa/verification.md`. Previous-design scores are historical and are not measurements of this redesign.

## Asset sources

- Corporate PDF: primary approved source for project, equipment, leadership and certificate images.
- Official company assets: `https://www.rathoregroup.co.in/images/`.
- Geographic data: [Natural Earth admin-0 1:110m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), public domain; simplified regional representation.
- Manrope and Inter: Google Fonts, self-hosted Latin WOFF2 subsets, SIL Open Font License.
- Scroll sequence: [Pexels — Aerial View of City Skyline with Bridge and River](https://www.pexels.com/video/aerial-view-of-city-skyline-with-bridge-and-river-31198061/) by 耀明 钟, under the [Pexels License](https://www.pexels.com/license/). Real filmed footage; illustrative use only. Source and extraction details are recorded in `src/data/footage-sources.json`. Capability photographs are approved PDF project images.

## Hosting

`.openai/hosting.json` contains the private Sites project identity. The deployment packages the static `out/` output. Changes to the connected source are committed and pushed by the Sites workflow helper before a saved version is deployed.
