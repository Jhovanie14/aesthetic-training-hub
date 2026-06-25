import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Practitioner } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface PractitionerCardProps {
  practitioner: Practitioner;
}

export function PractitionerCard({ practitioner }: PractitionerCardProps) {
  const isPremium = practitioner.tier === "premium";

  return (
    <article
      className={cn(
        "group flex h-full flex-col border rounded",
        isPremium ? "border-teal bg-ink text-paper" : "border-line bg-surface text-ink",
      )}
    >
      <div className="flex flex-1 flex-col p-6">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center border font-mono text-sm font-medium",
                isPremium ? "border-teal text-paper" : "border-ink/20 text-ink",
              )}
            >
              {practitioner.avatarInitials}
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold leading-tight tracking-tight">
                {practitioner.name}
              </h2>
              <p
                className={cn(
                  "mt-1 font-mono text-[11px] uppercase tracking-[0.14em]",
                  isPremium ? "text-ink-muted" : "text-faint",
                )}
              >
                {practitioner.location}
              </p>
            </div>
          </div>
          {isPremium && <Badge variant="premium" />}
        </header>

        <p
          className={cn(
            "mt-5 text-sm leading-relaxed",
            isPremium ? "text-ink-muted" : "text-muted",
          )}
        >
          {practitioner.bio}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {practitioner.specialisms.map((specialism) => (
            <li
              key={specialism}
              className={cn(
                "border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em]",
                isPremium
                  ? "border-ink-line text-ink-muted"
                  : "border-line text-muted",
              )}
            >
              {specialism}
            </li>
          ))}
        </ul>

        <div
          className={cn(
            "mt-5 flex flex-1 items-center gap-2 pt-1 font-mono text-xs",
            isPremium ? "text-ink-muted" : "text-faint",
          )}
        >
          <Star className="h-3.5 w-3.5 fill-teal text-teal" />
          <span
            className={cn(
              "font-medium",
              isPremium ? "text-paper" : "text-ink",
            )}
          >
            {practitioner.rating.toFixed(1)}
          </span>
          <span>/ {practitioner.reviewCount} reviews</span>
        </div>
      </div>

      <Link
        href={`/practitioners/${practitioner.id}`}
        className={cn(
          "flex items-center justify-between border-t px-6 py-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
          isPremium
            ? "border-ink-line text-paper hover:text-teal"
            : "border-line text-ink hover:text-teal",
        )}
      >
        View profile
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
