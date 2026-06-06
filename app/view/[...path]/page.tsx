import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PdfViewer from "@/components/PdfViewer";
import { getContentAtPath } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface ViewPageProps {
  params: Promise<{ path: string[] }>;
}

function buildTitle(segments: string[]): string {
  const fileName = segments[segments.length - 1] ?? "";
  const nameWithoutExt = fileName.replace(/\.pdf$/i, "");
  const parent = segments.length > 1 ? segments[segments.length - 2] : "";
  return parent ? `${nameWithoutExt} – ${parent}` : nameWithoutExt;
}

function buildDescription(segments: string[]): string {
  const fileName = segments[segments.length - 1] ?? "";
  const subject = segments.length >= 3 ? segments[segments.length - 3] : "";
  const season = segments.length >= 2 ? segments[segments.length - 2] : "";
  const qualification = segments.length >= 4 ? segments[segments.length - 4] : "";
  const parts = [qualification, subject, season].filter(Boolean);
  return `View and download ${fileName} ${parts.length ? "– " + parts.join(" › ") + " " : ""}past paper on ${SITE_NAME}. Free to view, download and revise.`;
}

export async function generateMetadata(props: ViewPageProps): Promise<Metadata> {
  const { path: pathSegments } = await props.params;
  const segments = pathSegments.map((s) => decodeURIComponent(s));
  const title = buildTitle(segments);
  const description = buildDescription(segments);
  const canonicalPath = "/view/" + segments.map(encodeURIComponent).join("/");

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      type: "article",
    },
  };
}

export default async function ViewPage(props: ViewPageProps) {
  const { path: pathSegments } = await props.params;
  const segments = pathSegments.map((s) => decodeURIComponent(s));

  // Verify the file exists
  const node = getContentAtPath(segments);
  if (!node || node.type !== "file") {
    notFound();
  }

  const fileName = segments[segments.length - 1] ?? "document.pdf";

  return <PdfViewer segments={segments} fileName={fileName} />;
}
