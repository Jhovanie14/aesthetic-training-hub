# Aesthetic Training Hub — Practitioner Directory

A public-facing directory where students browse vetted UK aesthetics trainers by specialism, see who's credible and available, and click through to a profile. Built as a test task.

---

## 1. How to Run It

```bash
npm install
npm run dev
# Open http://localhost:3000
```

`/` redirects to `/directory`. Profile pages live at `/practitioners/[id]`.

To verify the production build:

```bash
npm run build
```

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Lucide icons · in-memory typed dataset (no DB).

---

## 2. Progress Report

**What I built**
- Directory page in a **Clinical Precision** visual language: cool paper (`#F6F7F6`), green-ink (`#10201C`), a single clinical teal accent (`#0F766E`), hairline rules, and a deliberate type system — Space Grotesk (tight technical display) / Inter (body) / IBM Plex Mono (data, labels, credentials). No serif, no gold — a deliberate move away from the templated cream-and-serif look.
- 10 seed practitioners (4 Premium, 6 Standard) typed end-to-end.
- **Premium differentiation via inversion (the signature):** Premium isn't a gold trim — Premium trainers get the **inverted dark ink card**. Because Premium sorts to the top, the dark cards cluster into a band at the top of the grid; Standard cards stay disciplined white with hairline borders. A mono "Premium" tag and teal-outlined avatar reinforce it. Standard cards carry no "Standard" label.
- **Specialism filter** — derived from the data, instant client-side filtering, horizontally scrollable on mobile, resets pagination on change.
- **Pagination** — 6 per page; with 10 records this proves the component across two pages.
- **"View Profile" CTA** on every card, routing to a real (statically generated) profile page.
- **Responsive:** 1 column mobile → 2 tablet → 3 desktop; usable at 390px.
- **AI Smart Discovery (built, optional):** a natural-language search above the filter pills. A student types an outcome ("make clients look more rested") and an LLM maps it to the controlled specialism vocabulary, then drives the existing filter. See §4 — it degrades gracefully without an API key.

**What I left out (deliberately, per scope)**
- No database or API — the dataset is in-memory and pagination slices in memory.
- Profile page is intentionally minimal (name, bio, specialisms, location, tier, rating, experience, back link).
- No compound (specialism + location) filtering, no search bar, no auth/onboarding/payments, no animations, no dark mode.

**What I'd do next**
- Compound filters (specialism **and** location) with URL-synced query params so filters are shareable and back-button friendly.
- Real data source with server-side, cursor-based pagination instead of in-memory slicing.
- Trainer onboarding + subscription management to feed the directory.

---

## 3. Where the Brief Was Unclear (honest feedback)

1. **"Stand out" is underspecified.** Border, badge, background tint, sort order, and featured placement are *different product decisions with different tradeoffs*. I implemented sort + border + tint + badge together, but the spec should define "stand out" in terms of the student behaviour it's meant to drive (more profile clicks for Premium?), not a visual treatment. Otherwise you're guessing at the commercial intent.

2. **Filter: specialism OR location — why not both?** Students filter by *what* they want to learn and *where* they can travel to. Constraining this to a single axis is artificial; any real marketplace needs a compound filter. I built specialism (the primary "job to be done") but flagged location as the obvious next axis.

3. **No CTA specified.** A directory with no next step is a broken journey. I added "View Profile" on every card because finding a trainer and then hitting a dead end is worse than no directory at all. The brief should say what happens after discovery.

4. **Tier display to students creates a tension the spec ignores.** Labelling listings "Standard" risks devaluing perfectly qualified practitioners and undermining student trust. I show the Premium badge only and let card treatment carry the signal — protecting Standard subscribers' value while still rewarding Premium spend. This is a product call the brief should have made explicitly.

5. **Mobile isn't mentioned.** UK aesthetics students discover primarily on phones. Omitting mobile from a discovery surface is a blind spot, so I treated it as mobile-first (single column, scrollable filter pills, usable at 390px).

6. **No pagination spec.** "A handful of seed practitioners" hides the fact that this page breaks at scale. The brief should state expected dataset size and pagination behaviour. I built pagination now (6/page) and noted that production needs server-side cursor pagination.

7. **No design direction.** Is this for the *practitioner's* brand (professional, credentialed) or the *student's* exploratory UX? They produce different products. I chose **Clinical Precision** — a lab/record-sheet register (mono credentials, hairline structure, the profile page laid out as a clinical "Record") — because the audience is healthcare professionals choosing who to trust with their training. The Premium tier is signalled by inverting the card to dark ink rather than adding ornament, so the commercial signal reads as *more authoritative*, not *more decorated*.

---

## 4. AI Integration — Smart Discovery (built)

**The idea.** A student types a natural-language query like *"I want to learn how to make clients look more rested and natural"* and an LLM maps that intent to the directory's controlled specialism vocabulary (here: Skin Boosters) before the existing filter runs. This removes the assumption that students already know the clinical terminology for what they want — they describe the *outcome*, the model translates it into the vocabulary, and the same filtering UI does the rest.

**The implementation.** It's wired up as a small, optional, self-contained feature:

- **`app/api/discover/route.ts`** — a Next.js Route Handler. `POST { query }` → `{ specialisms, source }`. When `ANTHROPIC_API_KEY` is set it calls Claude (`claude-opus-4-8`, official `@anthropic-ai/sdk`) with a **strict tool** whose schema constrains the output to an `enum` of the real specialisms — so the model can only ever return valid filter values, never free text. Results are validated again server-side against the same vocabulary.
- **`components/directory/SmartSearch.tsx`** — the natural-language input. On submit it calls the route and drives the existing single-select filter, showing what it matched (e.g. *"Matched Skin Boosters · via Claude"*).
- **`lib/discover.ts`** — the controlled vocabulary (derived from the dataset, so it always matches the pills) plus a keyword fallback.

**Graceful degradation.** With **no API key** (a fresh `npm install`), the route falls back to a local keyword matcher and the response is tagged `keyword match` — so the page works fully in a demo, and quietly upgrades to real Claude when a key is present. Any model/transport error also falls back rather than breaking the page. To run the live version: `cp .env.local.example .env.local` and add your key.

**Honest scope.** It applies the single best match to the current single-select filter. The natural next step is multi-select (the LLM already returns an ordered list) so a query like *"lips and cheek volume"* filters to Lip Filler **and** Dermal Filler at once.
