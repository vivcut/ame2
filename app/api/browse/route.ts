import { NextResponse } from "next/server";
import { getContentAtPath, type ContentNode } from "@/lib/content";

export async function GET() {
  const node = getContentAtPath([]);

  if (!node || node.type === "file") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const children = node.children.map((child: ContentNode) => ({
    type: child.type,
    name: child.name,
    segments: child.segments,
    ...(child.type === "file"
      ? { fileType: child.fileType, extension: child.extension }
      : {}),
  }));

  return NextResponse.json({ name: "root", segments: [], children });
}
