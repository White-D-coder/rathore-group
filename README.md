# Rathore Group

A Next.js App Router / TypeScript corporate website with a cinematic, frame-by-frame scroll sequence, original Three.js architecture, an interactive geographic map, and Tailwind CSS. The site exports to static HTML for deployment. It does not replace the company's existing public domain.

## Run

```sh
npm ci
npm run dev
```

Build with `npm run build`. The deployment output is `out/`. `npm run typecheck` checks TypeScript. Use Node.js 22 or later.

For a production-style local preview with compression and caching, build and run `node qa/preview-server.mjs`, then open `http://127.0.0.1:3019`.

## Content and structure

- `src/data/company.ts`: company details, independently editable metrics, all 17 supplied projects and values, capabilities, leadership, companies, equipment, and registrations.
- `src/components/ScrollJourney.tsx`: native-scroll image-sequence player, five chapters, bounded decoded-frame cache, reverse scrubbing and responsive frames.
- `qa/sequence/stage.mjs`: original infrastructure geometry, deterministic camera path and floor-by-floor construction.
- `qa/sequence/render.mjs`: offline renderer using installed Chrome. The main sequence needs no live WebGL at runtime.
- `qa/sequence/validate.mjs`: validates all 300 frames before each build.
- `src/components/IndiaMapScene.tsx`: extruded geographic map with scroll-controlled camera framing.
- `src/data/india.json`: projected Natural Earth map geometry, not a boundary reference.
- `src/components/Sections.tsx`: corporate content and interactive portfolio, regional selection and equipment browser.
- `src/components/Contact.tsx`: validated enquiry-to-email-draft workflow. No information is submitted or stored by the site.
- `src/app/[section]/page.tsx`: about, capabilities, projects, presence, leadership, contact, privacy.
- `src/app/projects/[slug]/page.tsx`: statically generated project pages.
- `src/app/globals.css` and `src/app/redesign.css`: editorial design system, responsive layouts and motion preferences.

The crest is the original official artwork, displayed at its original proportions. The sequence is a conceptual architectural study, not a company project. Desktop has 180 rendered frames; mobile has 120. Reduced-motion visitors receive a still image and can explicitly select chapters.

## Frame-by-frame behavior

Native scroll progress maps directly to `round(progress × (frameCount - 1))`. No autoplay, time-based camera loop or delayed smooth scrolling drives the sequence. Stopping freezes the view; reversing retraces the same source frames. Headings update with the frame that was actually drawn. Only nearby frames are fetched. Decoded memory is capped at 12 desktop frames or 8 mobile frames.

The journey uses one sticky viewport. Subsequent company sections scroll normally. The previous extra pinned capability/equipment panels were removed. Project filters and modals, the regional map, actual equipment photographs, portraits, certificates and the enquiry workflow remain functional.

To regenerate the assets, start `node qa/sequence/server.mjs`, then run `node qa/sequence/render.mjs` in another terminal. It writes the desktop/mobile WebP files under `public/sequence`. The renderer uses the frame index as its complete animation state.

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

`qa/browser-check.mjs` checks project filters, modal dismissal, regional selection, enquiry draft generation, mobile navigation and all main mobile routes. Set `RATHORE_BASE_URL` to change its default `http://127.0.0.1:3019`. No check sends an email.

Current verification and lab measurements are recorded in `qa/verification.md`. Previous-design scores are historical and are not measurements of this redesign.

## Asset sources

- Corporate PDF: primary approved source for project, equipment, leadership and certificate images.
- Official company assets: `https://www.rathoregroup.co.in/images/`.
- Geographic data: [Natural Earth admin-0 1:110m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), public domain; simplified regional representation.
- Manrope and Inter: Google Fonts, self-hosted Latin WOFF2 subsets, SIL Open Font License.
- Scroll sequence: all 300 frames rendered from the original code in `qa/sequence`. Capability photographs are approved PDF project images.

## Hosting

`.openai/hosting.json` contains the private Sites project identity. The deployment packages the static `out/` output. Changes to the connected source are committed and pushed by the Sites workflow helper before a saved version is deployed.
