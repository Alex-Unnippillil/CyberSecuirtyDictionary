import { test, expect } from "@playwright/test";
import path from "path";

// Pages to verify hydration: route is for test name only
const pages = [
  { route: "/", file: "index.html" },
  { route: "/search", file: "search.html" },
  { route: "/term/cidr", file: "cidr.html" },
  { route: "/chat", file: "chat.html" },
];

for (const { route, file } of pages) {
  test(`hydration markup for ${route} matches server output`, async ({
    browser,
  }) => {
    const filePath = path.join(__dirname, "..", file);
    const url = "file://" + filePath;

    // Helper to grab comparable HTML while ignoring dynamic-only sections
    const getSanitizedHTML = async (p: import("@playwright/test").Page) => {
      return await p.evaluate(() => {
        const body = document.body.cloneNode(true) as HTMLElement;
        body.querySelectorAll("[data-pro-only]").forEach((el) => el.remove());
        body.querySelectorAll("#search-help").forEach((el) => el.remove());
        body.querySelectorAll(".skeleton").forEach((el) => el.remove());
        const searchWrapper = body.querySelector("#search-wrapper");
        if (searchWrapper) {
          const searchInput = searchWrapper.querySelector("#search");
          searchWrapper.replaceWith(searchInput as Node);
        }
        const searchInput = body.querySelector("#search");
        if (searchInput) {
          searchInput.removeAttribute("style");
        }
        body
          .querySelectorAll("#search-token-overlay")
          .forEach((el) => el.remove());
        body
          .querySelectorAll("#definition-container")
          .forEach((el) => el.remove());
        return body.innerHTML;
      });
    };

    // Get server-rendered HTML with JS disabled
    const staticContext = await browser.newContext({
      javaScriptEnabled: false,
    });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(url);
    const serverHTML = await getSanitizedHTML(staticPage);
    await staticContext.close();

    // Get hydrated HTML with JS enabled
    const hydratedContext = await browser.newContext();
    const hydratedPage = await hydratedContext.newPage();
    await hydratedPage.goto(url);
    await hydratedPage.waitForLoadState("networkidle");
    const hydratedHTML = await getSanitizedHTML(hydratedPage);
    await hydratedContext.close();

    expect(hydratedHTML).toBe(serverHTML);
  });
}
