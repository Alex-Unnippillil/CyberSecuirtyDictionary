import Script from "next/script";

export const metadata = {
  title: "Category Sunburst",
};

export default function CategoriesPage() {
  return (
    <>
      <main className="container">
        <h1>Category Map</h1>
        <nav id="breadcrumbs" aria-label="Breadcrumb"></nav>
        <button id="back-btn" type="button" aria-label="Return to root">
          Back
        </button>
        <svg id="sunburst" width="600" height="600"></svg>
      </main>
      <Script src="https://d3js.org/d3.v7.min.js" />
      <Script src="/sunburst.js" />
    </>
  );
}
