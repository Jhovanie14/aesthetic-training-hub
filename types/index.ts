export type Tier = 'standard' | 'premium'

export type Specialism =
  | 'Lip Filler'
  | 'Botox'
  | 'Skin Boosters'
  | 'PRP'
  | 'Microneedling'
  | 'Dermal Filler'
  | 'Chemical Peel'
  | 'Thread Lift'

export interface Practitioner {
  id: string
  name: string
  specialisms: Specialism[]
  location: string
  tier: Tier
  bio: string
  yearsExperience: number
  rating: number // 4.0–5.0, one decimal
  reviewCount: number
  avatarInitials: string // e.g. "SK" for Sarah Kane
}
