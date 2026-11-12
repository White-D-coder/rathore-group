# Redesign verification — 13 November 2026

The homepage was rebuilt around a native-scroll frame sequence. All company records, approved PDF assets, projects, equipment, leadership portraits and certificates are retained.

## Sequence checks

- 180 desktop WebP frames at 1280 × 800; 120 mobile frames at 600 × 900.
- All 300 files are checked for count, format, dimensions and truncation before the production build.
- Scroll maps directly to `round(progress × (frameCount - 1))` in both directions.
- Production Chrome checks pass at 11 forward/reverse scroll positions per device, including the first and last frame.
- Stopping holds the selected frame. Returning to a prior position produces the same view.
- Chapter controls, mobile scrubbing and reduced-motion still behavior pass.
- Decoded frame memory is bounded. The hero does not use live WebGL, autoplay or a time-driven camera loop.
- Actual displayed frames drive chapter copy. Frame URLs include a content fingerprint to avoid stale cached sequences after future revisions.

The return-view check allows a measured canvas resampling difference below 1/255 per channel; Chrome can switch GPU/CPU resampling after pixel readbacks. It still requires exact frame indices and checks distinct camera views.

## Build and regression checks

The production static export succeeds for all generated pages. Project status/sector filters, project modal Escape dismissal, regional project selection, enquiry-to-email-draft generation, mobile navigation, seven main mobile routes without horizontal overflow and reduced motion pass. The checks send no email. No uncaught browser errors or failed asset requests were recorded.

Desktop and mobile captures of the beginning, three middle chapters and end were reviewed. The old extra pinned capability and equipment sections were removed; the main sequence supplies the continuous pinned journey. Other sections scroll normally.

## Lighthouse

An isolated mobile Lighthouse run against the compressed production preview, with standard simulated mobile throttling:

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
