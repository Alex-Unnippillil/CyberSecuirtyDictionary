# Motion Audit

## Findings

- No components were using explicit `top`/`left` animations. The scroll-to-top button used `display` toggling and was updated to animate with `opacity` and `transform` for GPU-friendly rendering.
- Rendering the term list could produce long main-thread tasks when many items were processed in a single loop.

## Improvements

- Added `components/scroll-to-top.js` and associated styles so the button fades and slides using `opacity` and `transform` instead of `display` changes.
- Refactored `populateTermsList` in `script.js` to chunk DOM updates with `requestAnimationFrame`, preventing long tasks and keeping the UI responsive.

These changes reduce layout thrashing and improve animation performance across the site.
