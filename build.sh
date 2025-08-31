#!/bin/sh
set -e
# Build script for CyberSecuirtyDictionary
# Generates static assets required for the site

# Generate oEmbed responses for each term
node scripts/generate-oembed.js

# Generate .well-known/security.txt following RFC 9116
mkdir -p .well-known
cat <<'TXT' > .well-known/security.txt
# Security contact for CyberSecuirtyDictionary
# See https://www.rfc-editor.org/rfc/rfc9116.html for format details
Contact: mailto:security@example.com
TXT

echo "Generated .well-known/security.txt"
