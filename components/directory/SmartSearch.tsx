'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Specialism } from '@/types'
import { cn } from '@/lib/utils'

interface SmartSearchProps {
  // Called with the model's matched specialisms (best first; may be empty). 
  onMatch: (specialisms: Specialism[]) => void
}

type Status =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'done'; matched: Specialism[]; source: 'llm' | 'fallback' }
  | { state: 'error' }

export function SmartSearch({ onMatch }: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || status.state === 'loading') return

    setStatus({ state: 'loading' })
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = (await res.json()) as {
        specialisms: Specialism[]
        source: 'llm' | 'fallback'
      }
      setStatus({ state: 'done', matched: data.specialisms, source: data.source })
      onMatch(data.specialisms)
    } catch {
      setStatus({ state: 'error' })
    }
  }

  return (
    <div className="border border-line bg-surface">
      <form onSubmit={handleSubmit} className="flex items-stretch">
        <label htmlFor="smart-search" className="sr-only">
          Describe what you want to learn
        </label>
        <span className="flex items-center pl-4 text-teal" aria-hidden="true">
          <Sparkles className="h-4 w-4" />
        </span>
        <input
          id="smart-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you want to learn — e.g. make clients look more rested"
          className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-ink placeholder:text-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={status.state === 'loading'}
          className={cn(
            'shrink-0 border-l border-line px-5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
            status.state === 'loading'
              ? 'cursor-wait text-faint'
              : 'text-ink hover:bg-ink hover:text-paper',
          )}
        >
          {status.state === 'loading' ? 'Matching…' : 'Match'}
        </button>
      </form>

      {status.state === 'done' && (
        <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
          {status.matched.length > 0 ? (
            <>
              Matched{' '}
              <span className="text-teal">{status.matched.join(' · ')}</span>
              <span className="text-line"> / </span>
              {status.source === 'llm' ? 'via Claude' : 'keyword match'}
            </>
          ) : (
            <>No specialism matched — showing all trainers</>
          )}
        </p>
      )}

      {status.state === 'error' && (
        <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          Something went wrong — try the filters below
        </p>
      )}
    </div>
  )
}
