import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HomeIcon, ChevronRightIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RepoTable from "@/components/RepoTable";
import { getContentAtPath, type ContentFolder } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

function buildFolderTitle(segments: string[]): string {
  const name = segments[segments.length - 1] ?? "Browse";
  const parent = segments.length > 1 ? segments[segments.length - 2] : "";
  return parent ? `${name} – ${parent} Past Papers` : `${name} Past Papers`;
}

function buildFolderDescription(segments: string[], folder: ContentFolder): string {
  const fileCount = folder.children.filter((c) => c.type === "file").length;
  const folderCount = folder.children.filter((c) => c.type === "folder").length;
  const name = segments[segments.length - 1] ?? "this folder";
  const breadcrumb = segments.join(" › ");
  return `Browse ${folderCount > 0 ? folderCount + " sub-folders and " : ""}${fileCount > 0 ? fileCount + " past papers" : "resources"} for ${breadcrumb} on ${SITE_NAME}. Free to view and download.`;
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const segments = slug.map((s) => decodeURIComponent(s));
  const node = getContentAtPath(segments);

  if (!node || node.type === "file") {
    return { title: "Not Found" };
  }

  const folder = node as ContentFolder;
  const title = buildFolderTitle(segments);
  const description = buildFolderDescription(segments, folder);
  const canonicalPath = "/browse/" + segments.map(encodeURIComponent).join("/");

  // Build contextual keywords from the path
  const pathKeywords = segments.flatMap((seg) => [
    `${seg} past papers`,
    `${seg} mark schemes`,
    `${seg} 2025`,
    `${seg} 2026`,
  ]);

  return {
    title,
    description,
    keywords: pathKeywords,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      type: "website",
    },
  };
}

export default async function BrowsePage(props: PageProps<"/browse/[...slug]">) {
  const { slug } = await props.params;

  const segments = slug.map((s) => decodeURIComponent(s));
  const node = getContentAtPath(segments);

  if (!node || node.type === "file") {
    notFound();
  }

  const folder = node as ContentFolder;

  const breadcrumbs = segments.map((seg, i) => ({
    label: seg,
    href: "/browse/" + segments.slice(0, i + 1).map(encodeURIComponent).join("/"),
    isCurrent: i === segments.length - 1,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <HomeIcon className="h-3.5 w-3.5" />
                  Home
                </Link>
              }
            />
          </BreadcrumbItem>

          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="contents">
              <BreadcrumbSeparator>
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {crumb.isCurrent ? (
                  <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
                        {crumb.label}
                      </Link>
                    }
                  />
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Folder header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-muted p-2">
          <FolderOpenIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{folder.name}</h1>
          <p className="text-xs text-muted-foreground">
            {folder.children.filter((c) => c.type === "folder").length} folders
            {" · "}
            {folder.children.filter((c) => c.type === "file").length} files
          </p>
        </div>
      </div>

      {/* Repository Table */}
      <RepoTable nodes={folder.children} />
    </div>
  );
}
