import Script from "next/script";

export const metadata = {
  title: "Import Terms",
};

export default function ImportPage() {
  return (
    <>
      <main className="container">
        <h1>Import Terms from CSV</h1>
        <div id="step1">
          <input type="file" id="csvFile" accept=".csv" aria-label="CSV file" />
        </div>
        <div id="mapping" style={{ display: "none" }}>
          <h2>Map Columns</h2>
          <label>
            Term Column:
            <select id="termColumn"></select>
          </label>
          <label>
            Definition Column:
            <select id="definitionColumn"></select>
          </label>
          <button id="previewBtn" type="button">Preview</button>
        </div>
        <div id="preview" style={{ display: "none" }}>
          <h2>Preview</h2>
          <table id="previewTable"></table>
          <button id="importBtn" type="button">Import</button>
        </div>
        <div id="summary" style={{ display: "none" }}>
          <h2>Summary</h2>
          <p id="summaryText"></p>
        </div>
      </main>
      <Script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js" />
      <Script src="/import.js" />
    </>
  );
}
