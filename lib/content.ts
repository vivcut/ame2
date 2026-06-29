import manifest from "@/content-manifest.json";

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

const tree: ContentNode[] = manifest as unknown as ContentNode[];

export function getContentTree(): ContentNode[] {
  return tree;
}

export function getContentAtPath(segments: string[]): ContentNode | null {
  if (segments.length === 0) {
    // Return a virtual root folder
    return {
      type: "folder",
      name: "content",
      segments: [],
      children: tree,
    };
  }

  // Walk the tree to find the node at the given path
  let nodes: ContentNode[] = tree;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const found = nodes.find((n) => n.name === seg);

    if (!found) return null;

    if (i === segments.length - 1) {
      return found;
    }

    // Need to go deeper — must be a folder
    if (found.type !== "folder") return null;
    nodes = found.children;
  }

  return null;
}

export function segmentsToHref(segments: string[]): string {
  if (segments.length === 0) return "/";
  return "/browse/" + segments.map(encodeURIComponent).join("/");
}

export function getFileDownloadUrl(segments: string[]): string {
  // Files are served statically from public/content/
  return "/content/" + segments.map(encodeURIComponent).join("/");
}
