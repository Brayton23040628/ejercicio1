import { readFile } from "node:fs/promises";
import { URL } from "node:url";

const html = await readFile("index.html", "utf8");
const links = [...html.matchAll(/<a\b[^>]*\bhref=["'](https?:\/\/[^"']+)["'][^>]*>/gi)];

for (const [, link, attributes] of links) {
  const url = new URL(link);
  if (url.protocol !== "https:") {
    throw new Error(`Enlace externo inseguro (requiere HTTPS): ${link}`);
  }

  if (/\btarget=["']_blank["']/i.test(attributes) && !/\brel=["'][^"']*\b(?:noopener|noreferrer)\b/i.test(attributes)) {
    throw new Error(`Enlace externo con target=_blank sin protección rel: ${link}`);
  }

  const response = await fetch(url, { method: "HEAD", redirect: "manual" });
  if (response.status >= 400 || (response.status >= 300 && response.status < 400 && !response.headers.get("location"))) {
    throw new Error(`Enlace externo no disponible (${response.status}): ${link}`);
  }
}

console.log(`Enlaces externos verificados: ${links.length}`);