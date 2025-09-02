import { test, expect } from "@playwright/test";
import path from "path";

// Ensure the main page renders the expected heading and title

test("index page has title and heading", async ({ page }) => {
  const filePath = path.join(__dirname, "..", "index.html");
  await page.goto("file://" + filePath);
  await expect(page).toHaveTitle("Cyber Security Dictionary");
  await expect(page.locator("h1")).toHaveText("Cyber Security Dictionary");
});
