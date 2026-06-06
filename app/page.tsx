import { ArrowRightIcon } from "@heroicons/react/24/outline";
import RepoTable from "@/components/RepoTable";
import { getContentTree } from "@/lib/content";
import Link from "next/link";

export default function HomePage() {
  const tree = getContentTree();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          2025/2026 Season Papers Available
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight mb-3">
          Latest Past Papers & Mark Schemes
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          The most recent IGCSE, GCSE & IB exam papers — including Cambridge and Edexcel's
          latest seasons. Free to browse, view and download instantly.
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { label: "Cambridge IGCSE", href: "/browse/IGCSE/Cambridge" },
            { label: "Edexcel IGCSE", href: "/browse/IGCSE/Edexcel" },
            { label: "GCSE", href: "/browse/GCSE" },
            { label: "IB", href: "/browse/IB" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-muted/50 hover:bg-muted hover:border-primary/30 text-xs font-medium text-foreground transition-all"
            >
              {label}
              <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* Repository Table */}
      <RepoTable nodes={tree} headerLabel="Qualification / Subject / Season" />
    </div>
  );
}
