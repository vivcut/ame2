import { Badge } from "@/components/ui/badge";
import type { FileType } from "@/lib/content";

interface FileTypeBadgeProps {
  fileType: FileType;
}

const config: Record<FileType, { label: string; className: string }> = {
  qp: {
    label: "Question Paper",
    className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
  ms: {
    label: "Mark Scheme",
    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  er: {
    label: "Examiner Report",
    className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  },
  other: {
    label: "File",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export default function FileTypeBadge({ fileType }: FileTypeBadgeProps) {
  const { label, className } = config[fileType];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}
