# Accessibility Motion Audit

## Overview
Reviewed project components for autoplaying or looping decorative animations. Goal was to ensure the site loads with no decorative motion and that any motion requires user interaction.

## Findings
- `styles.css` and `assets/css/style.css` only use transitions for hover/focus states; no animations run on initial load.
- `script.js` includes smooth scrolling behavior triggered by the user.
- No `animation` or `@keyframes` declarations or autoplaying media were detected.

## Result
The application loads in a static state with zero decorative motion by default.
