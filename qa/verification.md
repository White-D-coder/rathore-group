# Real-footage update verification — 13 November 2026

The CGI homepage sequence was replaced with 16 seconds of a real, continuous drone flight through a cable-stayed bridge. Frames are extracted directly from licensed Mixkit footage. The background is identified as illustrative footage, and the top label refers to Mumbai headquarters rather than implying the filmed location. All company records, approved PDF assets, projects, equipment, leadership portraits and certificates are retained.

## Sequence checks

- 180 desktop WebP frames at 1280 × 800; 120 mobile frames at 600 × 900.
- All 300 files are checked for count, format, dimensions and truncation before the production build.
- Scroll maps directly to `round(progress × (frameCount - 1))` in both directions.
- Production Chrome checks pass at 11 forward/reverse scroll positions per device, including the first and last frame.
- Stopping holds the selected frame. Returning to a prior position produces the same view.
- Chapter controls, mobile scrubbing and reduced-motion still behavior pass.
- The final chapter’s continuation link reaches the company overview on desktop and mobile.
- Native image loading works when `connect-src` is blocked by CSP (the test first confirms fetch is actually blocked).
- A simulated failed frame automatically retries. Two consecutive failures show a visible error and Retry button; manual recovery draws the exact requested frame while retaining the last good view during the outage.
- Decoded frame memory is bounded. The hero does not use live WebGL, autoplay or a time-driven camera loop.
- Actual displayed frames drive chapter copy. Frame URLs include a content fingerprint to avoid stale cached sequences after future revisions.

The return-view check allows a measured canvas resampling difference below 1/255 per channel; Chrome can switch GPU/CPU resampling after pixel readbacks. It still requires exact frame indices and checks distinct camera views.

## Build and regression checks

The production static export succeeds for all generated pages. Project status/sector filters, project modal Escape dismissal, regional project selection, enquiry-to-email-draft generation, mobile navigation, seven main mobile routes without horizontal overflow and reduced motion pass. The checks send no email. No uncaught browser errors or failed asset requests were recorded.

Desktop and mobile captures of the beginning, three middle chapters and end were reviewed. The old extra pinned capability and equipment sections were removed; the main sequence supplies the continuous pinned journey. Other sections scroll normally.

## Historical Lighthouse measurements

The following scores were measured before the real-footage replacement and are retained as historical data, not measurements of the current footage or loader. No new Lighthouse run is claimed. The earlier isolated mobile run used standard simulated mobile throttling:

| Category | Score |
| --- | ---: |
| Performance | 98 |
| Accessibility | 100 (final correction verified) |
| Best Practices | 100 |
| SEO | 100 |

First Contentful Paint: 1.5 s. Largest Contentful Paint: 2.2 s. Total Blocking Time: 10 ms. Cumulative Layout Shift: 0.016.

Reports and screenshots are local QA artifacts under `/tmp/rathore-redesign`. These are lab measurements, not field guarantees. No desktop hardware-GPU performance claim is made. The final accessibility-only audit confirms the certificate-label contrast repair.

## Content provenance

The primary content source remains the 32-page `RNB CORPORATE PROFILE 2026.pdf`. Actual photographs are used for 15 named projects, three leaders and all 12 equipment types. The Pali rendering and two electrical/solar sector illustrations remain explicitly identified. All 17 documented regions distinguish regional presence from named project status. Six original certificate scans remain available in the lightbox.

## Loading investigation and publication limit

The production Worker error log query returned no events. Anonymous access to the owner-private URL returns 401, so an unauthenticated browser cannot verify the owner’s exact failure. The previous fetch/blob decoding path could silently retain the first frame after errors; the new native image path removes those dependencies and exposes recoverable failures. Local production-browser checks confirm the new behavior under a blocked connection policy and simulated image outages; they do not establish the exact cause of the original report.

All 300 replacement files validate. The optimized footage totals 9.25 MiB desktop and 3.62 MiB mobile, loaded on demand rather than all at startup. `/film` replaces the previous CGI path and each frame URL contains the content fingerprint. The source and license are recorded in `src/data/footage-sources.json`; raw video stays outside the repository.

## Local HTTP 500 repair

A direct request to the existing local Next.js development server on port 3000 reproduced HTTP 500. Loading its compiled homepage module failed with `Cannot find module './770.js'`: the active development runtime and production page chunks had been mixed in `.next/`. Development now uses `.next-dev/` and production retains `.next/`; the development directory is ignored and its generated types are included.

A fresh development process additionally exposed `ERR_REQUIRE_ESM` from the Tailwind 4.3.5 compiler requiring the ESM-only `magic-string` 1.4.5. Tailwind and its PostCSS plugin are pinned together to 4.1.18, which uses the compatible `magic-string` 0.30.21. Dependencies were reinstalled from the updated lockfile.

The homepage, a project detail page and the first film frame returned HTTP 200 after the repair. A production build completed all 30 pages while the development server stayed running, and the homepage still returned HTTP 200 afterward. Local Chrome regression checks passed for portfolio filtering, modals, regional selection, enquiry drafts, mobile navigation and all seven main mobile routes, with no browser errors or failed asset requests.
