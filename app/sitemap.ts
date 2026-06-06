import type { MetadataRoute } from "next";
import { getContentTree, type ContentNode, type ContentFolder } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

const NOW = new Date();

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

/**
 * Recursively walk the content tree and emit:
 *  - one /browse/… URL per folder
 *  - one /view/… URL per PDF file
 */
function walkTree(nodes: ContentNode[], entries: SitemapEntry[]) {
  for (const node of nodes) {
    if (node.type === "folder") {
      const folder = node as ContentFolder;

      // Browse page for this folder
      const browseUrl =
        SITE_URL +
        "/browse/" +
        node.segments.map(encodeURIComponent).join("/");

      // Priority heuristic: deeper paths are slightly less important
      const depth = node.segments.length; // 1 = IGCSE, 2 = Cambridge, etc.
      const priority = Math.max(0.3, 0.9 - (depth - 1) * 0.1);

      entries.push({
        url: browseUrl,
        lastModified: NOW,
        changeFrequency: depth <= 2 ? "weekly" : "monthly",
        priority,
      });

      // Recurse into children
      walkTree(folder.children, entries);
    } else {
      // File — only include PDFs in the viewer sitemap
      if (node.extension === "pdf") {
        const viewUrl =
          SITE_URL +
          "/view/" +
          node.segments.map(encodeURIComponent).join("/");

        entries.push({
          url: viewUrl,
          lastModified: NOW,
          changeFrequency: "yearly",
          priority: 0.6,
        });
      }
    }
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = [];

  // 1. Home page
  entries.push({
    url: SITE_URL + "/",
    lastModified: NOW,
    changeFrequency: "daily",
    priority: 1.0,
  });

  // 2. Top-level qualification pages
  const topLevelSlugs = ["IGCSE", "GCSE", "IB"];
  for (const slug of topLevelSlugs) {
    entries.push({
      url: `${SITE_URL}/browse/${encodeURIComponent(slug)}`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.95,
    });
  }

  // 3. Aggregated category pages (high-value SEO landing pages)
  const categoryPages = [
    { path: "IGCSE/Cambridge", priority: 0.92 },
    { path: "IGCSE/Edexcel", priority: 0.92 },
  ];
  for (const { path, priority } of categoryPages) {
    entries.push({
      url: `${SITE_URL}/browse/${path.split("/").map(encodeURIComponent).join("/")}`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority,
    });
  }

  // 4. Walk the full content tree → all folders and all PDF viewer pages
  const tree = getContentTree();
  walkTree(tree, entries);

  return entries;
}
