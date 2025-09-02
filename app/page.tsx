import Script from "next/script";

export const metadata = {
  title: "Cyber Security Dictionary",
};

export default function HomePage() {
  return (
    <>
      <main className="container">
        <h1>Cyber Security Dictionary</h1>
        <nav className="site-nav" aria-label="Site links">
          <a href="/templates/guidelines.html">Definition Guidelines</a> |{' '}
          <a href="/categories">Category Map</a>
        </nav>
        <div id="definition-container" style={{ display: "none" }}></div>
        <nav id="alpha-nav" aria-label="Alphabet navigation"></nav>
        <input type="text" id="search" placeholder="Search..." />
        <button id="random-term" type="button" aria-label="Show random term">Random Term</button>
        <button id="dark-mode-toggle" type="button" aria-label="Toggle dark mode">Toggle Dark Mode</button>
        <input type="checkbox" id="show-favorites" aria-label="Show favorites" />
        <label htmlFor="show-favorites">Show Favorites</label>
        <button id="export-terms" type="button" aria-label="Export terms">Export Terms</button>
        <div id="export-status" className="export-status" hidden>
          <progress id="export-progress" className="progress-ring" aria-label="Exporting"></progress>
          <button id="cancel-export" type="button" aria-label="Cancel export">Cancel</button>
        </div>
        <button id="reset-order" type="button" aria-label="Reset term order">Reset Order</button>
        <ul id="terms-list"></ul>
      </main>
      <footer className="container" aria-label="Contribute">
        <p><a href="/templates/contribute.html">Contribute</a></p>
      </footer>
      <button id="scrollToTopBtn" type="button" aria-label="Scroll to top">↑</button>
      <footer aria-label="Project contribution">
        <p><a href="/CONTRIBUTING.md">Contribute to this project</a></p>
      </footer>
      <div id="toast" className="toast" role="status" aria-live="polite" hidden></div>
      <Script src="/preconnect.js" />
      <Script src="/script.js" />
      <Script src="/app.js" />
      <Script src="https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js" />
      <Script src="/metrics.js" />
    </>
  );
}
