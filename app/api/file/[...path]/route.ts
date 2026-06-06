import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await props.params;

  // Sanitize: prevent path traversal
  const sanitized = pathSegments.map((s) => decodeURIComponent(s));
  const filePath = path.join(CONTENT_DIR, ...sanitized);
  const resolved = path.resolve(filePath);

  // Ensure resolved path is still under CONTENT_DIR
  if (!resolved.startsWith(path.resolve(CONTENT_DIR))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(resolved)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const stat = fs.statSync(resolved);
  if (!stat.isFile()) {
    return new NextResponse("Not a file", { status: 400 });
  }

  const fileName = path.basename(resolved);
  const ext = path.extname(fileName).toLowerCase();

  let contentType = "application/octet-stream";
  if (ext === ".pdf") contentType = "application/pdf";

  const fileBuffer = fs.readFileSync(resolved);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Content-Length": String(stat.size),
    },
  });
}
