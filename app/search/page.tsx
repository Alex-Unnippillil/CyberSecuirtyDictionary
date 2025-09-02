import Script from "next/script";

export const metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <>
      <main className="container">
        <h1>Search</h1>
        <input id="search-box" type="text" placeholder="Search terms..." />
        <section id="alias-manager">
          <h2>Aliases</h2>
          <form id="alias-form">
            <input id="alias-name" type="text" placeholder="Alias" />
            <input id="alias-target" type="text" placeholder="Term" />
            <button type="submit">Save Alias</button>
          </form>
          <ul id="alias-list"></ul>
        </section>
        <div id="results"></div>
      </main>
      <Script src="/preconnect.js" />
      <Script id="base-url">{`window.__BASE_URL__ = window.__BASE_URL__ || ''`}</Script>
      <Script src="/search.js" />
      <Script src="https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js" />
      <Script src="/metrics.js" />
    </>
  );
}
