"use client";

import { useMemo, useState } from "react";
import { Practitioner, Specialism } from "@/types";
import { getSpecialisms } from "@/lib/utils";
import { FilterBar, type SpecialismFilter } from "./FilterBar";
import { PractitionerGrid } from "./PractitionerGrid";
import { SmartSearch } from "./SmartSearch";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 6;

interface DirectoryClientProps {
  practitioners: Practitioner[];
}

export function DirectoryClient({ practitioners }: DirectoryClientProps) {
  const [selected, setSelected] = useState<SpecialismFilter>("All");
  const [page, setPage] = useState(1);

  const specialisms = useMemo(
    () => getSpecialisms(practitioners),
    [practitioners],
  );

  // Premium always sorts to the top, before any filtering is applied.
  const sorted = useMemo(() => {
    return [...practitioners].sort((a, b) => {
      if (a.tier === b.tier) return 0;
      return a.tier === "premium" ? -1 : 1;
    });
  }, [practitioners]);

  const filtered = useMemo(() => {
    if (selected === "All") return sorted;
    return sorted.filter((p) => p.specialisms.includes(selected));
  }, [sorted, selected]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  function handleFilterChange(value: SpecialismFilter) {
    setSelected(value);
    setPage(1); // reset pagination when the filter changes
  }

  // Smart discovery returns specialisms best-first; apply the top match to the existing single-select filter (or reset to All when nothing matched).
  function handleSmartMatch(matched: Specialism[]) {
    handleFilterChange(matched.length > 0 ? matched[0] : "All");
  }

  return (
    <div className="space-y-6">
      <SmartSearch onMatch={handleSmartMatch} />

      <FilterBar
        specialisms={specialisms}
        selected={selected}
        onChange={handleFilterChange}
      />

      <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
        <span>{selected === "All" ? "All trainers" : selected}</span>
        <span aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </div>

      <PractitionerGrid practitioners={pageItems} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
