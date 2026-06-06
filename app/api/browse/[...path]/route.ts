import { NextRequest, NextResponse } from "next/server";
import { getContentAtPath, type ContentNode } from "@/lib/content";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await props.params;
  const segments = pathSegments.map((s) => decodeURIComponent(s));

  const node = getContentAtPath(segments);

  if (!node || node.type === "file") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Return lightweight representation for the client
  const children = node.children.map((child: ContentNode) => ({
    type: child.type,
    name: child.name,
    segments: child.segments,
    ...(child.type === "file"
      ? { fileType: child.fileType, extension: child.extension }
      : {}),
  }));

  return NextResponse.json({ name: node.name, segments: node.segments, children });
}
