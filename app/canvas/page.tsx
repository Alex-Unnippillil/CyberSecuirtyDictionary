import Script from "next/script";

export const metadata = {
  title: "Canvas Performance Demo",
};

export default function CanvasPage() {
  return (
    <>
      <main className="container">
        <h1>Canvas Performance Demo</h1>
        <p id="support-info"></p>
        <canvas id="perf-canvas" width="300" height="150"></canvas>
        <p id="frame-time"></p>
      </main>
      <Script src="/canvas-demo.js" />
    </>
  );
}
