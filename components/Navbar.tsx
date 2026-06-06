import Link from "next/link";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
            <div className="rounded-md bg-foreground p-1">
              <BookOpenIcon className="h-4 w-4 text-background" />
            </div>
            <span className="text-base font-bold tracking-tight">AceMyExams</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              2025/2026
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link href="/browse/IGCSE" className="text-muted-foreground hover:text-foreground transition-colors">
              IGCSE
            </Link>
            <Link href="/browse/GCSE" className="text-muted-foreground hover:text-foreground transition-colors">
              GCSE
            </Link>
            <Link href="/browse/IB" className="text-muted-foreground hover:text-foreground transition-colors">
              IB
            </Link>
          </nav>

          {/* Right side */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
