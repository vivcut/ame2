import Link from "next/link";
import {
  FolderIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import FileTypeBadge from "@/components/FileTypeBadge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  segmentsToHref,
  getFileDownloadUrl,
  type ContentNode,
  type ContentFolder,
  type ContentFile,
} from "@/lib/content";

function getPdfViewerUrl(segments: string[]): string {
  return "/view/" + segments.map(encodeURIComponent).join("/");
}

function countItems(folder: ContentFolder): { folders: number; files: number } {
  let files = 0;
  let folders = 0;
  for (const child of folder.children) {
    if (child.type === "file") files++;
    else folders++;
  }
  return { folders, files };
}

function ItemDescription({ node }: { node: ContentNode }) {
  if (node.type === "folder") {
    const { folders, files } = countItems(node);
    const parts: string[] = [];
    if (folders) parts.push(`${folders} folder${folders !== 1 ? "s" : ""}`);
    if (files) parts.push(`${files} file${files !== 1 ? "s" : ""}`);
    return <span className="text-xs text-muted-foreground">{parts.join(", ") || "Empty"}</span>;
  }
  return <FileTypeBadge fileType={node.fileType} />;
}

interface RepoTableProps {
  nodes: ContentNode[];
  showHeader?: boolean;
  headerLabel?: string;
}

export default function RepoTable({ nodes, showHeader = true, headerLabel = "Name" }: RepoTableProps) {
  const iconBtnClass = cn(
    buttonVariants({ variant: "ghost", size: "icon-sm" }),
    "opacity-60 hover:opacity-100 transition-opacity"
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden shadow-sm">
      {/* Table header */}
      {showHeader && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="w-4 shrink-0" />
          <span className="flex-1">{headerLabel}</span>
          <span className="hidden sm:block w-40 text-right">Contents</span>
          <span className="w-16 text-right">Actions</span>
        </div>
      )}

      {nodes.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground">
          This folder is empty.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {nodes.map((node) => {
            if (node.type === "folder") {
              const href = segmentsToHref(node.segments);
              return (
                <Link
                  key={node.name}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
                >
                  <FolderIcon className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {node.name}
                  </span>
                  <span className="hidden sm:block w-40 text-right">
                    <ItemDescription node={node} />
                  </span>
                  <span className="w-16 flex justify-end">
                    <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              );
            } else {
              const file = node as ContentFile;
              const downloadUrl = getFileDownloadUrl(file.segments);
              const isPdf = file.extension === "pdf";
              return (
                <div
                  key={file.name}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group"
                >
                  <DocumentTextIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm text-foreground truncate font-mono text-[0.8rem]" title={file.name}>
                    {file.name}
                  </span>
                  <span className="hidden sm:block w-40 text-right">
                    <ItemDescription node={file} />
                  </span>
                  <span className="w-16 flex items-center justify-end gap-1">
                    {isPdf && (
                      <Link
                        href={getPdfViewerUrl(file.segments)}
                        title="View PDF"
                        className={iconBtnClass}
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <a
                      href={downloadUrl}
                      download={file.name}
                      title="Download"
                      className={iconBtnClass}
                    >
                      <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                    </a>
                  </span>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
