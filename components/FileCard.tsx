import Link from "next/link";
import { DocumentIcon, ArrowDownTrayIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import FileTypeBadge from "@/components/FileTypeBadge";
import { getFileDownloadUrl, type ContentFile } from "@/lib/content";
import { cn } from "@/lib/utils";

interface FileCardProps {
  file: ContentFile;
}

function getPdfViewerUrl(segments: string[]): string {
  return "/view/" + segments.map(encodeURIComponent).join("/");
}

export default function FileCard({ file }: FileCardProps) {
  const downloadUrl = getFileDownloadUrl(file.segments);
  const isPdf = file.extension === "pdf";

  const iconBtnClass = cn(
    buttonVariants({ variant: "ghost", size: "icon-sm" }),
    "h-7 w-7"
  );

  return (
    <Card className="border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-200">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-slate-50 dark:bg-slate-900/50 p-1.5 shrink-0">
          <DocumentIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate" title={file.name}>
            {file.name}
          </p>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <FileTypeBadge fileType={file.fileType} />
            <span className="text-xs text-muted-foreground uppercase">{file.extension}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isPdf && (
            <Link
              href={getPdfViewerUrl(file.segments)}
              title="View PDF"
              className={iconBtnClass}
            >
              <EyeIcon className="h-4 w-4" />
            </Link>
          )}
          <a
            href={downloadUrl}
            download={file.name}
            title="Download"
            className={iconBtnClass}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
