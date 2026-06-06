"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  FolderOpenIcon,
  XMarkIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import MiniBrowser from "@/components/MiniBrowser";

interface PdfPanel {
  segments: string[];
  fileName: string;
}

function getDownloadUrl(segments: string[]): string {
  return "/api/file/" + segments.map(encodeURIComponent).join("/");
}

interface PdfViewerProps {
  segments: string[];
  fileName: string;
}

export default function PdfViewer({ segments, fileName }: PdfViewerProps) {
  const downloadUrl = getDownloadUrl(segments);

  const [secondPdf, setSecondPdf] = useState<PdfPanel | null>(null);
  const [showBrowser, setShowBrowser] = useState(false);

  const handleSelectSecond = (segs: string[], name: string) => {
    setSecondPdf({ segments: segs, fileName: name });
    setShowBrowser(false);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 57px)" }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/40 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          Back
        </Link>
        <div className="h-3.5 w-px bg-border" />
        <span className="flex-1 text-xs font-mono text-foreground truncate" title={fileName}>
          {fileName}
        </span>
        {secondPdf && (
          <>
            <div className="h-3.5 w-px bg-border hidden sm:block" />
            <span
              className="hidden sm:block text-xs font-mono text-muted-foreground truncate max-w-[200px]"
              title={secondPdf.fileName}
            >
              {secondPdf.fileName}
            </span>
          </>
        )}
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* PDF viewers */}
        <div className="flex flex-1 min-w-0 min-h-0 gap-0.5 bg-muted/20">
          {/* Primary PDF */}
          <div className={`flex flex-col min-h-0 ${secondPdf ? "w-1/2" : "flex-1"}`}>
            <iframe
              src={downloadUrl}
              className="flex-1 w-full border-0"
              title={fileName}
            />
          </div>

          {/* Secondary PDF */}
          {secondPdf && (
            <div className="w-1/2 flex flex-col min-h-0 border-l border-border relative">
              <button
                onClick={() => setSecondPdf(null)}
                className="absolute top-2 right-2 z-10 p-1 rounded bg-background/80 border border-border hover:bg-muted transition-colors"
                title="Close second document"
              >
                <XMarkIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <iframe
                src={getDownloadUrl(secondPdf.segments)}
                className="flex-1 w-full border-0"
                title={secondPdf.fileName}
              />
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-52 shrink-0 border-l border-border bg-background flex flex-col gap-0">
          <div className="p-3 border-b border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Actions
            </p>
            <div className="flex flex-col gap-1.5">
              {/* Download primary */}
              <a
                href={downloadUrl}
                download={fileName}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all text-xs font-medium text-foreground"
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                Download
              </a>

              {/* Fullscreen / open raw */}
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all text-xs font-medium text-foreground"
              >
                <ArrowsPointingOutIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                Fullscreen
              </a>

              {/* Open another document */}
              <button
                onClick={() => setShowBrowser((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all text-xs font-medium text-foreground"
              >
                <FolderOpenIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {showBrowser ? "Close browser" : "Open another"}
              </button>
            </div>
          </div>

          {/* Second PDF actions */}
          {secondPdf && (
            <div className="p-3 border-b border-border">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Second doc
              </p>
              <div className="flex flex-col gap-1.5">
                <a
                  href={getDownloadUrl(secondPdf.segments)}
                  download={secondPdf.fileName}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all text-xs font-medium text-foreground"
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  Download
                </a>
                <a
                  href={getDownloadUrl(secondPdf.segments)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all text-xs font-medium text-foreground"
                >
                  <ArrowsPointingOutIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  Fullscreen
                </a>
                <button
                  onClick={() => setSecondPdf(null)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 hover:bg-muted hover:border-red-300/30 transition-all text-xs font-medium text-foreground"
                >
                  <XMarkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Mini browser panel */}
          {showBrowser && (
            <div className="flex-1 min-h-0 overflow-hidden p-2">
              <MiniBrowser
                onSelect={handleSelectSecond}
                onClose={() => setShowBrowser(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
