import { test, expect } from "@playwright/test";

// Dynamically import the Next.js config to access redirects
async function loadRedirects() {
  const config = await import("../next.config.js");
  return config.default?.redirects
    ? config.default.redirects()
    : config.redirects();
}

test("legacy slug redirects map to new paths", async () => {
  const redirects = await loadRedirects();
  const cases = [
    { source: "/term/:slug*", destination: "/:slug*", status: 308 },
    { source: "/terms/:slug*", destination: "/:slug*", status: 308 },
    { source: "/word/:slug*", destination: "/:slug*", status: 307 },
  ];

  for (const c of cases) {
    const match = redirects.find(
      (r: any) => r.source === c.source && r.destination === c.destination
    );
    expect(match, `Missing redirect for ${c.source}`).toBeTruthy();
    const expectedPermanent = c.status === 308;
    expect(match.permanent).toBe(expectedPermanent);
  }
});
