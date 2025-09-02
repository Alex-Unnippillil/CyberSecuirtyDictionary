import Script from "next/script";

export const metadata = {
  title: "CIDR Calculator",
};

export default function CidrPage() {
  return (
    <>
      <main className="container">
        <h1>CIDR Calculator</h1>
        <input id="cidr-input" type="text" placeholder="e.g., 192.168.1.0/24" />
        <button id="calculate" type="button">Calculate</button>
        <div id="results"></div>
      </main>
      <Script src="/cidr.js" />
    </>
  );
}
