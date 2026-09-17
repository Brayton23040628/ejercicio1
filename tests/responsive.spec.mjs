import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 }
];

for (const viewport of viewports) {
  test(`se adapta en ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("http://127.0.0.1:4173/index.html");
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}