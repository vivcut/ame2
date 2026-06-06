import fs from "fs";
import path from "path";

export type FileType = "qp" | "ms" | "er" | "other";

export interface ContentFile {
  type: "file";
  name: string;
  /** Path segments relative to /content, e.g. ["IGCSE","Biology","...","file.pdf"] */
  segments: string[];
  fileType: FileType;
  extension: string;
}

export interface ContentFolder {
  type: "folder";
  name: string;
  segments: string[];
  children: ContentNode[];
}

export type ContentNode = ContentFile | ContentFolder;

const CONTENT_DIR = path.join(process.cwd(), "content");

function detectFileType(name: string): FileType {
  const lower = name.toLowerCase();
  if (lower.includes("_qp") || lower.includes("_qp_") || lower.endsWith("_qp.pdf") || lower.includes("qp.pdf")) return "qp";
  if (lower.includes("_ms") || lower.includes("_ms_") || lower.endsWith("_ms.pdf") || lower.includes("ms.pdf")) return "ms";
  if (lower.includes("_er") || lower.includes("_er.") || lower.endsWith("_er.pdf") || lower.includes("er.pdf")) return "er";
  return "other";
}

function readDir(dirPath: string, segments: string[]): ContentNode[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const nodes: ContentNode[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue; // skip hidden files

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

export function getContentTree(): ContentNode[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return readDir(CONTENT_DIR, []);
}

export function getContentAtPath(segments: string[]): ContentNode | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;

  if (segments.length === 0) {
    // Return a virtual root folder
    return {
      type: "folder",
      name: "content",
      segments: [],
      children: getContentTree(),
    };
  }

  const targetPath = path.join(CONTENT_DIR, ...segments);

  if (!fs.existsSync(targetPath)) return null;

  const stat = fs.statSync(targetPath);

  if (stat.isDirectory()) {
    const children = readDir(targetPath, segments);
    return {
      type: "folder",
      name: segments[segments.length - 1],
      segments,
      children,
    };
  } else {
    const name = segments[segments.length - 1];
    const ext = path.extname(name).replace(".", "").toLowerCase();
    return {
      type: "file",
      name,
      segments,
      fileType: detectFileType(name),
      extension: ext,
    };
  }
}

export function segmentsToHref(segments: string[]): string {
  if (segments.length === 0) return "/";
  return "/browse/" + segments.map(encodeURIComponent).join("/");
}

export function getFileDownloadUrl(segments: string[]): string {
  return "/api/file/" + segments.map(encodeURIComponent).join("/");
}
