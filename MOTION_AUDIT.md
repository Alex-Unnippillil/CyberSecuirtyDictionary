# Motion Audit Report

## Overview

An audit was conducted to ensure non-essential animations respect the user's `prefers-reduced-motion` setting.

## Findings and Updates

- No `components/` or `app/` directories were present in the project.
- **assets/css/style.css**: skip-link transition is disabled when reduced motion is requested.
- **styles.css**: transitions and hover scaling are disabled for list items, dictionary cards, favorite stars, and alphabet navigation buttons when reduced motion is requested.
- **script.js**: smooth scrolling is disabled in favor of instant scrolling for users who prefer reduced motion.

## Compliance

All identified non-essential animations now honor the `prefers-reduced-motion: reduce` media query.
