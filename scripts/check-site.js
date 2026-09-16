import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("_site");
const errors = [];

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(fullPath) : [fullPath];
  }));
  return nested.flat();
}

function addError(message) {
  errors.push(message);
}

function outputPathForUrl(url) {
  const cleanUrl = url.split("#")[0].split("?")[0];
  if (cleanUrl === "/") return path.join(outputDirectory, "index.html");
  if (cleanUrl.endsWith("/")) return path.join(outputDirectory, cleanUrl, "index.html");
  return path.join(outputDirectory, cleanUrl);
}

async function fileExists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

function hasMeta(html, name, value) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<meta[^>]+${escapedName}=["']${escapedValue}["']`, "i").test(html);
}

const requiredFiles = [
  "index.html",
  "about/index.html",
  "archive/index.html",
  "movies/index.html",
  "essays/index.html",
  "thanks/index.html",
  "404.html",
  "feed.xml",
  "sitemap.xml",
  "robots.txt",
  "CNAME",
  "style.css",
  "script.js"
];

for (const relativePath of requiredFiles) {
  if (!await fileExists(path.join(outputDirectory, relativePath))) {
    addError(`Missing generated file: ${relativePath}`);
  }
}

const feed = await readFile(path.join(outputDirectory, "feed.xml"), "utf8");
const sitemap = await readFile(path.join(outputDirectory, "sitemap.xml"), "utf8");
const robots = await readFile(path.join(outputDirectory, "robots.txt"), "utf8");
const cname = await readFile(path.join(outputDirectory, "CNAME"), "utf8");

if (!feed.includes("<feed ") || !feed.includes("<title>Driveway Avenue</title>")) addError("Atom feed is missing publication metadata.");
if (!sitemap.includes("<urlset") || !sitemap.includes("/movies/") || !sitemap.includes("/essays/")) addError("Sitemap is missing category URLs.");
if (!robots.includes("Sitemap:")) addError("robots.txt does not reference the sitemap.");

const siteUrl = "https://drivewayavenue.com";
if (!feed.includes(`<id>${siteUrl}</id>`) || !feed.includes(`${siteUrl}/feed.xml`)) addError("Atom feed does not use the production URL.");
if (!sitemap.includes(siteUrl)) addError("Sitemap does not use the production URL.");
if (!robots.includes(`${siteUrl}/sitemap.xml`)) addError("robots.txt does not use the production URL.");
if (cname.trim() !== "drivewayavenue.com") addError("CNAME does not use the production domain.");

const allFiles = await filesIn(outputDirectory);
const htmlFiles = allFiles.filter((filePath) => filePath.endsWith(".html"));

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, "utf8");
  const label = path.relative(outputDirectory, filePath);

  if (!/<html[^>]+lang="en"/i.test(html)) addError(`${label}: missing document language.`);
  if (!/<title>[^<]+<\/title>/i.test(html)) addError(`${label}: missing title.`);
  if (!html.includes("Driveway Avenue")) addError(`${label}: missing official site name.`);
  if (!hasMeta(html, "name", "description")) addError(`${label}: missing meta description.`);
  if (!/<link[^>]+rel="canonical"/i.test(html)) addError(`${label}: missing canonical URL.`);
  if (!html.includes(`rel="canonical" href="${siteUrl}`)) addError(`${label}: canonical URL does not use the production domain.`);
  if (!hasMeta(html, "property", "og:title")) addError(`${label}: missing Open Graph title.`);
  if (!hasMeta(html, "property", "og:description")) addError(`${label}: missing Open Graph description.`);
  if (!html.includes(`property="og:url" content="${siteUrl}`)) addError(`${label}: Open Graph URL does not use the production domain.`);
  if (!/<a class="skip-link" href="#main-content">/i.test(html)) addError(`${label}: missing skip link.`);
  if (!/<main id="main-content"/i.test(html)) addError(`${label}: missing main landmark.`);

  if (label === "404.html" && !hasMeta(html, "name", "robots")) addError("404.html: missing noindex directive.");
  if (label.startsWith("posts/") && !hasMeta(html, "property", "article:published_time")) addError(`${label}: missing article publication metadata.`);

  const images = html.match(/<img\b[^>]*>/gi) || [];
  for (const image of images) {
    const alt = image.match(/\balt=["']([^"']*)["']/i);
    if (!alt) addError(`${label}: an image is missing an alt attribute.`);
    else if (!alt[1].trim()) addError(`${label}: an image is missing meaningful alt text.`);
  }

  const references = html.matchAll(/(?:href|src)=["']([^"']+)["']/gi);
  for (const reference of references) {
    const url = reference[1];
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(url)) continue;

    const target = url.startsWith("/")
      ? outputPathForUrl(url)
      : path.resolve(path.dirname(filePath), url.split("#")[0].split("?")[0]);

    if (!await fileExists(target)) addError(`${label}: broken local reference ${url}`);
  }
}

for (const filePath of htmlFiles.filter((filePath) => path.relative(outputDirectory, filePath).startsWith("posts/"))) {
  const postUrl = "/" + path.relative(outputDirectory, filePath).split(path.sep).join("/").replace(/index\.html$/, "");
  if (!feed.includes(`${siteUrl}${postUrl}`)) addError(`${postUrl}: missing from Atom feed.`);
  if (!sitemap.includes(`${siteUrl}${postUrl}`)) addError(`${postUrl}: missing from sitemap.`);
}

if (errors.length) {
  console.error("Site checks failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Site checks passed for ${htmlFiles.length} HTML pages, feed, sitemap, robots.txt, metadata, images, and local links.`);
}
