import Script from "next/script";

export const metadata = {
  title: "Diagnostics",
};

export default function DiagnosticsPage() {
  return (
    <>
      <main className="container">
        <h1>Performance Diagnostics</h1>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>LCP</th>
              <th>CLS</th>
              <th>TBT</th>
            </tr>
          </thead>
          <tbody id="metrics-body"></tbody>
        </table>
      </main>
      <Script src="/preconnect.js" />
      <Script src="/diagnostics.js" />
    </>
  );
}
