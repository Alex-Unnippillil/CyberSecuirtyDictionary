import Script from "next/script";

export const metadata = {
  title: "Paste Sanitizer",
};

export default function SanitizePage() {
  return (
    <>
      <main className="container">
        <h1>Paste Sanitizer</h1>
        <textarea id="paste-input" placeholder="Paste text here"></textarea>
        <div className="diff">
          <div>
            <h2>Original</h2>
            <pre id="original"></pre>
          </div>
          <div>
            <h2>Sanitized</h2>
            <pre id="sanitized"></pre>
          </div>
        </div>
        <button id="copy-clean" type="button" disabled>
          Copy Cleaned Text
        </button>
      </main>
      <Script src="/sanitize.js" />
    </>
  );
}
