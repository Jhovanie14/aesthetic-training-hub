import { Specialism } from "@/types";
import { cn } from "@/lib/utils";

export type SpecialismFilter = Specialism | "All";

interface FilterBarProps {
  specialisms: Specialism[];
  selected: SpecialismFilter;
  onChange: (value: SpecialismFilter) => void;
}

export function FilterBar({ specialisms, selected, onChange }: FilterBarProps) {
  const options: SpecialismFilter[] = ["All", ...specialisms];

  return (
    <div
      role="group"
      aria-label="Filter by specialism"
      className="flex gap-px overflow-x-auto border-y border-line scrollbar-hide"
    >
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={cn(
              "shrink-0 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
              isActive
                ? "bg-ink text-paper"
                : "text-muted hover:bg-white hover:text-ink",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
