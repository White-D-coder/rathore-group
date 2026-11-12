# Rathore Group

A Next.js App Router / TypeScript corporate website with original procedural Three.js scenes, React Three Fiber, Drei, GSAP ScrollTrigger, Lenis, and Tailwind CSS. The site exports to static HTML for deployment. It does not replace the company's existing public domain.

## Run

```sh
npm ci
npm run dev
```

Build with `npm run build`. The deployment output is `out/`. `npm run typecheck` checks TypeScript. Use Node.js 22 or later.

For a production-style local preview with compression and caching, build and run `node qa/preview-server.mjs`, then open `http://127.0.0.1:3019`.

## Content and structure

- `src/data/company.ts`: company details, independently editable metrics, all 17 supplied projects and values, capabilities, leadership, companies, equipment, and registrations.
- `src/components/InfrastructureScene.tsx`: original bridge, skyline and capability models; the camera follows scroll position.
- `src/components/Scene.tsx`: WebGL capability checks, lazy loading and device/reduced-motion fallbacks.
- `src/components/IndiaMapScene.tsx`: extruded geographic map with scroll-controlled camera framing.
- `src/data/india.json`: projected Natural Earth map geometry, not a boundary reference.
- `src/components/Sections.tsx`: corporate content and interactive portfolio, regional selection and equipment browser.
- `src/components/Contact.tsx`: validated enquiry-to-email-draft workflow. No information is submitted or stored by the site.
- `src/app/[section]/page.tsx`: about, capabilities, projects, presence, leadership, contact, privacy.
- `src/app/projects/[slug]/page.tsx`: statically generated project pages.
- `src/app/globals.css`: visual system, responsive layouts and motion preferences.

The crest is the original official artwork, displayed at its original proportions using a CSS crop. The procedural scene is an architectural study, not an actual project model. Phones and reduced-motion visitors receive WebP stills rendered from the same 3D scenes. Desktop scenes render on demand, with capped device pixel ratios.

## Source material and content review

The primary source is the user's `/Users/deeptanubhunia/Downloads/RNB CORPORATE PROFILE 2026.pdf` (32 pages). The initial design brief provides the creative direction. Approved photos, portraits, equipment images and certificate scans were extracted directly from that PDF, with original image object references recorded in `src/data/asset-sources.json`.

- All 17 listed project records and their documented values were checked against profile pages 18–23. Fifteen have project-specific images from the profile. The Pali image is explicitly labelled as a profile architectural visualization. CCTV and solar lighting records use clearly labelled sector illustrations because the profile provides descriptions rather than individual photos.
- Leadership portraits and biographies come from pages 8–9. All three portraits are original approved images.
- All 12 equipment types use the corresponding actual equipment images on page 24. Desktop visitors can scroll the gallery; all visitors can use previous/next and item selection.
- The interactive map includes all 17 regions documented on page 17. Regional presence is distinguished from the status of individual named projects; no project details are invented for profile-only regions.
- Six certificate scans from pages 25 and 27 open in an accessible lightbox with zoom and original-image download. The document names and source pages are visible; validity remains governed by the original scans. Government registrations from page 15 are listed separately.
- Company metrics remain editable. The ₹3,000+ crore executed-project metric (page 2) is kept separate from group turnover (page 4) and projects in hand (page 11), which are not conflated or added together.
- The registered address and contact details follow page 32. Check operational contact and project status at the time of public launch.

The original logo and a small number of sector illustrations also come from the company's existing website. The crest's artwork and proportions are preserved. The separate visual-reference attachment was not supplied; the navy/gold direction is implemented from the brief.

The contact form clearly prepares a local email draft for the visitor to review and send. Connect a mail backend if direct form submission is desired.

## Verification

`qa/browser-check.mjs` uses Playwright with installed Chrome and a local static server at port 3018. It checks WebGL rendering, project status and sector filters, project dialog dismissal, regional project selection, enquiry generation, mobile navigation, all main mobile routes for horizontal overflow, and reduced-motion fallback. It never sends an email.

Lighthouse targets in the brief are targets, not assumed results. Recorded measurements and environment details are in `qa/verification.md` after the final QA pass.

## Asset sources

- Corporate PDF: primary approved source for project, equipment, leadership and certificate images.
- Official company assets: `https://www.rathoregroup.co.in/images/`.
- Geographic data: [Natural Earth admin-0 1:110m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), public domain; simplified regional representation.
- Manrope and Inter: Google Fonts, self-hosted Latin WOFF2 subsets, SIL Open Font License.
- Hero and capability fallbacks: rendered from the original scene code in this repository.

## Hosting

`.openai/hosting.json` contains the private Sites project identity. The deployment packages the static `out/` output. Changes to the connected source are committed and pushed by the Sites workflow helper before a saved version is deployed.
