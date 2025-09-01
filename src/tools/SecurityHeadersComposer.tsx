import React, { useState } from 'react';

interface Directive {
  /**
   * Identifier for internal state tracking
   */
  key: string;
  /**
   * Human friendly name displayed beside the toggle
   */
  label: string;
  /**
   * Actual header that will be emitted
   */
  header: string;
}

const DIRECTIVES: Directive[] = [
  {
    key: 'hsts',
    label: 'Strict-Transport-Security',
    header:
      'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'xFrame',
    label: 'X-Frame-Options',
    header: 'X-Frame-Options: DENY',
  },
  {
    key: 'xContentType',
    label: 'X-Content-Type-Options',
    header: 'X-Content-Type-Options: nosniff',
  },
  {
    key: 'referrer',
    label: 'Referrer-Policy',
    header: 'Referrer-Policy: no-referrer',
  },
  {
    key: 'csp',
    label: 'Content-Security-Policy',
    header: "Content-Security-Policy: default-src 'self'",
  },
  {
    key: 'permissions',
    label: 'Permissions-Policy',
    header: 'Permissions-Policy: geolocation=()',
  },
];

/**
 * Small helper that converts an HTTP header string into a server configuration
 * snippet (compatible with nginx `add_header`).
 */
function toServerSnippet(header: string): string {
  const idx = header.indexOf(':');
  const name = header.slice(0, idx);
  const value = header.slice(idx + 1).trim();
  return `add_header ${name} "${value}";`;
}

export default function SecurityHeadersComposer() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggle = (key: string) =>
    setSelected((s) => ({ ...s, [key]: !s[key] }));

  const headers = DIRECTIVES.filter((d) => selected[d.key]).map((d) => d.header);
  const headerString = headers.join('\n');

  const copyToClipboard = async () => {
    const snippet = headers.map(toServerSnippet).join('\n');
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard API not available', e);
    }
  };

  return (
    <div className="security-headers-composer">
      <h2>Security Headers Composer</h2>
      <ul>
        {DIRECTIVES.map((directive) => (
          <li key={directive.key}>
            <label>
              <input
                type="checkbox"
                checked={!!selected[directive.key]}
                onChange={() => toggle(directive.key)}
              />
              {directive.label}
            </label>
          </li>
        ))}
      </ul>
      <textarea
        readOnly
        value={headerString}
        rows={Math.max(3, headers.length + 1)}
        style={{ width: '100%' }}
      />
      <button onClick={copyToClipboard} disabled={!headers.length}>
        {copied ? 'Copied!' : 'Copy server snippet'}
      </button>
    </div>
  );
}

