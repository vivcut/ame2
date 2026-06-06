import Link from "next/link";
import { FolderIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { segmentsToHref, type ContentFolder } from "@/lib/content";

interface FolderCardProps {
  folder: ContentFolder;
}

function countFiles(folder: ContentFolder): number {
  let count = 0;
  for (const child of folder.children) {
    if (child.type === "file") count++;
    else count += countFiles(child);
  }
  return count;
}

export default function FolderCard({ folder }: FolderCardProps) {
  const href = segmentsToHref(folder.segments);
  const totalFiles = countFiles(folder);
  const directFolders = folder.children.filter((c) => c.type === "folder").length;
  const directFiles = folder.children.filter((c) => c.type === "file").length;

  return (
    <Link href={href} className="group block">
      <Card className="h-full border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 p-1.5">
              <FolderIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {folder.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {directFolders > 0 && `${directFolders} folder${directFolders !== 1 ? "s" : ""}`}
                {directFolders > 0 && directFiles > 0 && " · "}
                {directFiles > 0 && `${directFiles} file${directFiles !== 1 ? "s" : ""}`}
                {totalFiles > 0 && directFiles !== totalFiles && ` · ${totalFiles} total`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
