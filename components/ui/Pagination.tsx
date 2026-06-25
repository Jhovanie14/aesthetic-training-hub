import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-line pt-6"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={cn(
          "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
          isFirst
            ? "cursor-not-allowed text-line"
            : "text-muted hover:text-ink",
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        Prev
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-9 w-9 items-center justify-center border font-mono text-xs transition-colors",
                  isActive
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-muted hover:border-ink hover:text-ink",
                )}
              >
                {page.toString().padStart(2, "0")}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className={cn(
          "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
          isLast ? "cursor-not-allowed text-line" : "text-muted hover:text-ink",
        )}
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
