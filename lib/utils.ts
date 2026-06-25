import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Practitioner, Specialism } from '@/types'

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Canonical display order for the filter pills. Specialisms present in the
 * dataset are returned in this order so the filter bar reads consistently
 * regardless of how the seed data is arranged.
 */
const SPECIALISM_ORDER: Specialism[] = [
  'Lip Filler',
  'Botox',
  'Skin Boosters',
  'PRP',
  'Microneedling',
  'Dermal Filler',
  'Chemical Peel',
  'Thread Lift',
]

/** Unique list of specialisms present across the given practitioners. */
export function getSpecialisms(list: Practitioner[]): Specialism[] {
  const present = new Set<Specialism>()
  for (const p of list) {
    for (const s of p.specialisms) present.add(s)
  }
  return SPECIALISM_ORDER.filter((s) => present.has(s))
}
