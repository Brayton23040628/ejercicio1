import { readFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
const documentHtml = html.toLowerCase();

const requiredElements = [
  ["HTML5 doctype", /^<!doctype html>/i],
  ["lang en the html element", /<html\b[^>]*\blang=["'][^"']+["']/i],
  ["title", /<title>[^<]+<\/title>/i],
  ["header", /<header\b/i],
  ["nav", /<nav\b/i],
  ["main", /<main\b/i],
  ["section", /<section\b/i],
  ["footer", /<footer\b/i],
  ["single h1", /<h1\b[^>]*>[^<]+<\/h1>/i]
];

const missing = requiredElements
  .filter(([, pattern]) => !pattern.test(html))
  .map(([name]) => name);

const h1Count = (documentHtml.match(/<h1\b/g) ?? []).length;
if (h1Count !== 1) {
  missing.push(`exactly one h1 (found ${h1Count})`);
}

const externalLinks = [...html.matchAll(/<a\b[^>]*\bhref=["'](https?:\/\/[^"']+)["'][^>]*>/gi)];
for (const [, url, attributes] of externalLinks) {
  if (/\btarget=["']_blank["']/i.test(attributes) && !/\brel=["'][^"']*\b(?:noopener|noreferrer)\b/i.test(attributes)) {
    missing.push(`safe rel on external link ${url}`);
  }
}

if (missing.length > 0) {
  throw new Error(`HTML structure/security checks failed: ${missing.join(", ")}`);
}

console.log(`HTML5/semantic checks passed; external links inspected: ${externalLinks.length}`);