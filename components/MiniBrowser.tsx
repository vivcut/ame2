"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FolderIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

interface BrowseNode {
  type: "folder" | "file";
  name: string;
  segments: string[];
  fileType?: string;
  extension?: string;
}

interface BrowseFolder {
  name: string;
  segments: string[];
  children: BrowseNode[];
}

interface MiniBrowserProps {
  onSelect: (segments: string[], fileName: string) => void;
  onClose: () => void;
}

export default function MiniBrowser({ onSelect, onClose }: MiniBrowserProps) {
  const [stack, setStack] = useState<BrowseFolder[]>([]);
  const [current, setCurrent] = useState<BrowseFolder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolder = useCallback(async (segments: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        segments.length === 0
          ? "/api/browse"
          : "/api/browse/" + segments.map(encodeURIComponent).join("/");
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load");
      const data: BrowseFolder = await res.json();
      return data;
    } catch {
      setError("Failed to load folder contents.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load root on mount
  useEffect(() => {
    fetchFolder([]).then((data) => {
      if (data) setCurrent(data);
    });
  }, [fetchFolder]);

  const handleFolderClick = async (node: BrowseNode) => {
    const data = await fetchFolder(node.segments);
    if (data) {
      setStack((prev) => (current ? [...prev, current] : prev));
      setCurrent(data);
    }
  };

  const handleBack = () => {
    const prev = stack[stack.length - 1];
    if (prev) {
      setStack((s) => s.slice(0, -1));
      setCurrent(prev);
    }
  };

  const handleHome = async () => {
    const data = await fetchFolder([]);
    if (data) {
      setStack([]);
      setCurrent(data);
    }
  };

  const files = current?.children.filter(
    (n) => n.type === "file" && n.extension === "pdf"
  ) ?? [];
  const folders = current?.children.filter((n) => n.type === "folder") ?? [];

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <button
          onClick={handleHome}
          className="p-1 rounded hover:bg-muted transition-colors"
          title="Home"
        >
          <HomeIcon className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {stack.length > 0 && (
          <button
            onClick={handleBack}
            className="p-1 rounded hover:bg-muted transition-colors"
            title="Back"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
        <span className="flex-1 text-xs font-medium text-foreground truncate">
          {current?.name || "Browse"}
        </span>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
            Loading…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-24 text-xs text-red-500">
            {error}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {folders.map((node) => (
              <button
                key={node.name}
                onClick={() => handleFolderClick(node)}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left group"
              >
                <FolderIcon className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                <span className="flex-1 text-xs text-foreground truncate group-hover:text-primary transition-colors">
                  {node.name}
                </span>
                <ChevronRightIcon className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
            {files.map((node) => (
              <button
                key={node.name}
                onClick={() => onSelect(node.segments, node.name)}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors text-left group"
              >
                <DocumentTextIcon className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span className="flex-1 text-xs text-foreground truncate font-mono text-[0.7rem] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {node.name}
                </span>
              </button>
            ))}
            {folders.length === 0 && files.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No PDF files here
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
