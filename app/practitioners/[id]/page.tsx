import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { practitioners } from "@/data/practitioners";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return practitioners.map((p) => ({ id: p.id }));
}

export default async function PractitionerProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const practitioner = practitioners.find((p) => p.id === id);

  if (!practitioner) {
    notFound();
  }

  const isPremium = practitioner.tier === "premium";

  const record = [
    { label: "Location", value: practitioner.location },
    { label: "Experience", value: `${practitioner.yearsExperience} years` },
    { label: "Rating", value: `${practitioner.rating.toFixed(1)} / 5.0` },
    { label: "Reviews", value: `${practitioner.reviewCount}` },
    { label: "Tier", value: isPremium ? "Premium" : "Standard" },
  ];

  return (
    <div className="min-h-full">
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/directory"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink"
          >
            <span className="h-2 w-2 bg-teal" aria-hidden="true" />
            ATH
          </Link>
          <Link
            href="/directory"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Directory
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center border border-ink/20 font-mono text-lg font-medium text-ink"
            >
              {practitioner.avatarInitials}
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                {practitioner.location}
              </p>
              <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-ink">
                {practitioner.name}
              </h1>
            </div>
          </div>
          {isPremium && <Badge variant="premium" />}
        </div>

        <div className="mt-6 flex items-center gap-2 font-mono text-sm text-muted">
          <Star className="h-4 w-4 fill-teal text-teal" />
          <span className="font-medium text-ink">
            {practitioner.rating.toFixed(1)}
          </span>
          <span className="text-faint">
            / {practitioner.reviewCount} reviews · {practitioner.yearsExperience}{" "}
            years experience
          </span>
        </div>

        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink">
          {practitioner.bio}
        </p>

        <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          Specialisms
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {practitioner.specialisms.map((specialism) => (
            <li
              key={specialism}
              className="border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted"
            >
              {specialism}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          Record
        </h2>
        <dl className="mt-4 border-t border-line">
          {record.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between border-b border-line py-3"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                {row.label}
              </dt>
              <dd className="font-mono text-sm text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
