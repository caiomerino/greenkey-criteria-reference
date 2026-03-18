import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'

function highlightText(text, query) {
  if (!query || !text) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  )
}

function formatDefinition(text, searchQuery) {
  if (!text) return null
  const paragraphs = text.split('\n').filter(p => p.trim())

  return paragraphs.map((para, j) => {
    const trimmed = para.trim()
    // Bullet-like lines
    if (/^[-–—•]/.test(trimmed)) {
      return (
        <p key={j} className="text-sm text-gk-text leading-relaxed mb-1.5 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:bg-gk-blue/30 before:rounded-full">
          {searchQuery ? highlightText(trimmed.replace(/^[-–—•]\s*/, ''), searchQuery) : trimmed.replace(/^[-–—•]\s*/, '')}
        </p>
      )
    }
    return (
      <p key={j} className="text-sm text-gk-text leading-relaxed mb-2 last:mb-0">
        {searchQuery ? highlightText(trimmed, searchQuery) : trimmed}
      </p>
    )
  })
}

export default function GlossaryView({ terms, searchQuery }) {
  const [expandedTerms, setExpandedTerms] = useState({})

  const toggleTerm = (term) => {
    setExpandedTerms(prev => ({ ...prev, [term]: !prev[term] }))
  }

  // Group by first letter
  const grouped = terms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {})

  const letters = Object.keys(grouped).sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-gk-blue to-gk-blue-dark rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen size={28} />
          <h1 className="text-2xl font-black">Glossary</h1>
        </div>
        <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
          A glossary clarifying the terminology and concepts used in the Green Key criteria. <strong className="text-white">{terms.length} terms</strong> defined.
        </p>
      </div>

      {/* Letter jump nav */}
      <div className="bg-white rounded-xl border border-gk-border p-4 no-print">
        <div className="flex flex-wrap gap-1">
          {letters.map(letter => (
            <a
              key={letter}
              href={`#glossary-${letter}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(`glossary-${letter}`)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold text-gk-blue hover:bg-gk-blue-light transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      {/* Terms by letter */}
      {letters.map(letter => (
        <div key={letter} id={`glossary-${letter}`}>
          <div className="sticky top-0 bg-gk-surface z-10 py-2">
            <span className="inline-flex w-10 h-10 rounded-lg bg-gk-blue text-white font-black text-lg items-center justify-center">
              {letter}
            </span>
          </div>
          <div className="space-y-2 mt-2">
            {grouped[letter].map((term, i) => {
              const isExpanded = expandedTerms[term.term]
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gk-border overflow-hidden"
                >
                  <button
                    onClick={() => toggleTerm(term.term)}
                    className="w-full text-left p-4 flex items-center gap-3 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gk-text">
                        {searchQuery ? highlightText(term.term, searchQuery) : term.term}
                      </h3>
                      {!isExpanded && (
                        <p className="text-xs text-gk-text-muted mt-1 line-clamp-1">
                          {term.definition.split('\n')[0]}
                        </p>
                      )}
                    </div>
                    {isExpanded
                      ? <ChevronDown size={16} className="text-gk-text-muted shrink-0" />
                      : <ChevronRight size={16} className="text-gk-text-muted shrink-0" />
                    }
                  </button>
                  {isExpanded && (
                    <div className="border-t border-gk-border bg-slate-50/50 p-4">
                      {formatDefinition(term.definition, searchQuery)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
