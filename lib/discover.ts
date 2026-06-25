import { Specialism } from "@/types";
import { practitioners } from "@/data/practitioners";
import { getSpecialisms } from "@/lib/utils";

/**
 * Controlled vocabulary the model (or the fallback) is allowed to return.
 * Derived from the dataset so it always matches the filter pills exactly.
 */
export const DISCOVER_SPECIALISMS: Specialism[] = getSpecialisms(practitioners);

export type DiscoverSource = "llm" | "fallback";

export interface DiscoverResult {
  specialisms: Specialism[];
  source: DiscoverSource;
}

/**
 * Keyword fallback used when no ANTHROPIC_API_KEY is configured (e.g. a fresh
 * checkout). Maps natural-language cues to the controlled specialism vocabulary
 * so the feature still works in a demo without a key.
 */
const KEYWORD_MAP: { specialism: Specialism; cues: string[] }[] = [
  { specialism: "Lip Filler", cues: ["lip", "lips", "mouth", "pout"] },
  {
    specialism: "Botox",
    cues: ["wrinkle", "line", "frown", "forehead", "crow", "anti-age", "anti age", "ageing", "aging", "expression"],
  },
  {
    specialism: "Skin Boosters",
    cues: ["rested", "natural", "glow", "glowy", "hydrat", "dull", "tired", "radian", "dewy", "plump skin", "skin quality", "luminous"],
  },
  {
    specialism: "PRP",
    cues: ["platelet", "prp", "hair", "regenerat", "under eye", "vampire", "growth factor"],
  },
  {
    specialism: "Microneedling",
    cues: ["texture", "scar", "scarring", "pore", "collagen", "needling", "resurfac", "acne mark"],
  },
  {
    specialism: "Dermal Filler",
    cues: ["cheek", "jaw", "jawline", "chin", "contour", "volume", "mid-face", "midface", "structure", "sculpt"],
  },
];

export function keywordFallback(query: string): Specialism[] {
  const q = query.toLowerCase();
  const matched = KEYWORD_MAP.filter(({ cues }) =>
    cues.some((cue) => q.includes(cue)),
  ).map(({ specialism }) => specialism);

  // Keep only specialisms that exist in the dataset, in canonical order.
  return DISCOVER_SPECIALISMS.filter((s) => matched.includes(s));
}
