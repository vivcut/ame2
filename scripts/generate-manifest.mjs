/**
 * Generates a content-manifest.json from the content directory tree.
 * Run this BEFORE `next build` so that lib/content.ts can use the manifest
 * instead of walking the filesystem at runtime.
 *
 * Usage: node scripts/generate-manifest.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "public", "content");
const OUTPUT = path.join(ROOT, "content-manifest.json");

function detectFileType(name) {
  const lower = name.toLowerCase();
  if (
    lower.includes("_qp") ||
    lower.includes("_qp_") ||
    lower.endsWith("_qp.pdf") ||
    lower.includes("qp.pdf")
  )
    return "qp";
  if (
    lower.includes("_ms") ||
    lower.includes("_ms_") ||
    lower.endsWith("_ms.pdf") ||
    lower.includes("ms.pdf")
  )
    return "ms";
  if (
    lower.includes("_er") ||
    lower.includes("_er.") ||
    lower.endsWith("_er.pdf") ||
    lower.includes("er.pdf")
  )
    return "er";
  return "other";
}

function readDir(dirPath, segments) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const childSegments = [...segments, entry.name];
    const childPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const children = readDir(childPath, childSegments);
      nodes.push({
        type: "folder",
        name: entry.name,
        segments: childSegments,
        children,
      });
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).replace(".", "").toLowerCase();
      nodes.push({
        type: "file",
        name: entry.name,
        segments: childSegments,
        fileType: detectFileType(entry.name),
        extension: ext,
      });
    }
  }

  // Sort: folders first, then files; alphabetically within each group
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

// Generate
if (!fs.existsSync(CONTENT_DIR)) {
  console.error(`Content directory not found: ${CONTENT_DIR}`);
  console.error("Make sure content is at public/content/");
  process.exit(1);
}

console.log(`Scanning: ${CONTENT_DIR}`);
const tree = readDir(CONTENT_DIR, []);
fs.writeFileSync(OUTPUT, JSON.stringify(tree, null, 0));

const stats = fs.statSync(OUTPUT);
console.log(
  `Generated ${OUTPUT} (${(stats.size / 1024).toFixed(1)} KB)`
);
