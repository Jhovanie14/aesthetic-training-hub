import { Practitioner } from "@/types";
import { PractitionerCard } from "./PractitionerCard";

interface PractitionerGridProps {
  practitioners: Practitioner[];
}

export function PractitionerGrid({ practitioners }: PractitionerGridProps) {
  if (practitioners.length === 0) {
    return (
      <p className="border border-line bg-surface px-6 py-20 text-center font-mono text-xs uppercase tracking-[0.14em] text-faint">
        No trainers match this specialism yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {practitioners.map((practitioner) => (
        <PractitionerCard key={practitioner.id} practitioner={practitioner} />
      ))}
    </div>
  );
}
