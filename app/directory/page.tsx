import Link from "next/link";
import { practitioners } from "@/data/practitioners";
import { getSpecialisms } from "@/lib/utils";
import { DirectoryClient } from "@/components/directory/DirectoryClient";

export default function DirectoryPage() {
  const cities = new Set(practitioners.map((p) => p.location)).size;
  const specialisms = getSpecialisms(practitioners).length;

  const stats = [
    { value: practitioners.length, label: "Trainers" },
    { value: cities, label: "Cities" },
    { value: specialisms, label: "Specialisms" },
  ];

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/directory"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink"
          >
            <span className="h-2 w-2 bg-teal" aria-hidden="true" />
            ATH
          </Link>
          <Link
            href="/directory"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            For Trainers
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="pt-14 pb-12 sm:pt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-teal">
            Verified UK Directory
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[2rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl sm:leading-[1.02]">
            Find the right
            <br />
            aesthetics trainer.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            A vetted directory of practitioners across the UK. Filter by the
            technique you want to learn and see exactly who teaches it.
          </p>

          <dl className="mt-10 flex gap-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-3xl font-semibold tabular-nums text-ink">
                  {stat.value}
                </dd>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </section>

        <section className="pb-16">
          <DirectoryClient practitioners={practitioners} />
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          <span>Aesthetic Training Hub</span>
          <span>Est. 2026 · United Kingdom</span>
        </div>
      </footer>
    </div>
  );
}
