import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown } from 'lucide-react'
import { Card } from '../components/ui/card'
import FadeIn from '../components/FadeIn'

function highlightText(text, query) {
  if (!query || !text) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  )
}

/* ── Formatting helpers (mirrored from CriterionCard) ── */

function isListItem(line) {
  if (!line) return false
  const t = line.trim()
  if (t.endsWith(';') || /;\s*(and|or|and\/or)\s*$/.test(t)) return true
  if (/^[-–—•]/.test(t)) return true
  if (/^[a-z]\)\s/.test(t)) return true
  return false
}

function isListIntroducer(line) {
  if (!line) return false
  return line.trim().endsWith(':')
}

function startsWithLowercase(line) {
  if (!line) return false
  const t = line.trim()
  return t.length > 0 && t[0] === t[0].toLowerCase() && t[0] !== t[0].toUpperCase()
}

function cleanListItem(text) {
  let t = text.trim()
  t = t.replace(/^[-–—•]\s*/, '')
  t = t.replace(/^[a-z]\)\s*/, '')
  t = t.replace(/;\s*(and|or|and\/or)\s*$/, '')
  t = t.replace(/;\s*$/, '')
  return t
}

function renderHighlightedLine(text, searchQuery) {
  if (!text) return text
  const colonIdx = text.indexOf(': ')
  if (colonIdx > 0 && colonIdx < 80 && !text.trim().endsWith(':')) {
    const label = text.substring(0, colonIdx)
    const rest = text.substring(colonIdx + 2)
    if (label.length < 80 && /^[A-Z]/.test(label.trim())) {
      return (
        <>
          <strong className="text-foreground">{searchQuery ? highlightText(label, searchQuery) : label}:</strong>{' '}
          <span className="italic text-foreground/90">{searchQuery ? highlightText(rest, searchQuery) : rest}</span>
        </>
      )
    }
  }
  return searchQuery ? highlightText(text, searchQuery) : text
}

function formatDefinition(text, searchQuery) {
  if (!text) return null
  const lines = text.split('\n').filter(p => p.trim())
  const elements = []
  let inList = false
  let listItems = []
  let listIntro = null

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <div key={`list-${elements.length}`} className="my-2">
          {listIntro && (
            <p className="text-sm text-foreground leading-relaxed mb-1.5 italic">
              {searchQuery ? highlightText(listIntro, searchQuery) : listIntro}
            </p>
          )}
          <ul className="list-none space-y-1 ml-1">
            {listItems.map((item, j) => (
              <li key={j} className="text-sm text-foreground leading-relaxed flex gap-2">
                <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-primary/40" />
                <span>{searchQuery ? highlightText(cleanListItem(item), searchQuery) : cleanListItem(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      )
      listItems = []
      listIntro = null
      inList = false
    }
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const trimmed = lines[idx].trim()

    // List introducer (ends with colon)
    if (isListIntroducer(trimmed)) {
      flushList()
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (isListItem(nextLine) || startsWithLowercase(nextLine)) {
        inList = true
        listIntro = trimmed
      } else {
        elements.push(
          <p key={idx} className="text-sm text-foreground leading-relaxed mb-2 italic">
            {searchQuery ? highlightText(trimmed, searchQuery) : trimmed}
          </p>
        )
      }
      continue
    }

    // List item
    if (inList && (isListItem(trimmed) || startsWithLowercase(trimmed))) {
      listItems.push(trimmed)
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (!isListItem(nextLine) && !startsWithLowercase(nextLine)) {
        flushList()
      }
      continue
    }

    // Standalone list item
    if (!inList && isListItem(trimmed)) {
      inList = true
      listItems.push(trimmed)
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (!isListItem(nextLine) && !startsWithLowercase(nextLine)) {
        flushList()
      }
      continue
    }

    // Regular paragraph with Label: description highlighting
    flushList()
    elements.push(
      <p key={idx} className="text-sm text-foreground leading-relaxed mb-2 last:mb-0">
        {renderHighlightedLine(trimmed, searchQuery)}
      </p>
    )
  }

  flushList()
  return elements
}

export default function GlossaryView({ terms, searchQuery, highlightTerm }) {
  const [expandedTerms, setExpandedTerms] = useState({})
  const highlightRef = useRef(null)

  // Auto-expand and scroll to highlighted term (from deep-link)
  useEffect(() => {
    if (highlightTerm) {
      setExpandedTerms(prev => ({ ...prev, [highlightTerm]: true }))
      const timer = setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [highlightTerm])

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
      <FadeIn>
        <Card className="bg-gradient-to-br from-[hsl(var(--gk-blue))] to-[hsl(211,100%,30%)] border-0 p-6 sm:p-8 text-white overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={28} />
            <h1 className="text-2xl font-black">Glossary</h1>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
            A glossary clarifying the terminology and concepts used in the Green Key criteria. <strong className="text-white">{terms.length} terms</strong> defined.
          </p>
        </Card>
      </FadeIn>

      {/* Letter jump nav */}
      <FadeIn delay={0.05}>
        <Card className="p-4 no-print">
          <div className="flex flex-wrap gap-1">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#glossary-${letter}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`glossary-${letter}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold text-[hsl(var(--gk-blue))] hover:bg-secondary transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </Card>
      </FadeIn>

      {/* Terms by letter */}
      {letters.map(letter => (
        <div key={letter} id={`glossary-${letter}`}>
          <div className="sticky top-0 bg-background z-10 py-2">
            <span className="inline-flex w-10 h-10 rounded-lg bg-[hsl(var(--gk-blue))] text-white font-black text-lg items-center justify-center">
              {letter}
            </span>
          </div>
          <div className="space-y-2 mt-2">
            {grouped[letter].map((term, i) => {
              const isExpanded = expandedTerms[term.term]
              return (
                <div
                  key={i}
                  ref={highlightTerm === term.term ? highlightRef : null}
                >
                  <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                    highlightTerm === term.term
                      ? 'border-[hsl(var(--gk-blue))] ring-2 ring-[hsl(var(--gk-blue))]/30'
                      : ''
                  }`}>
                    <button
                      onClick={() => toggleTerm(term.term)}
                      className="w-full text-left p-4 flex items-center gap-3 hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground">
                          {searchQuery ? highlightText(term.term, searchQuery) : term.term}
                        </h3>
                        {!isExpanded && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {term.definition.split('\n')[0]}
                          </p>
                        )}
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="shrink-0"
                      >
                        <ChevronDown size={16} className="text-muted-foreground" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] },
                            opacity: { duration: 0.2, delay: 0.05 },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border bg-secondary/30 p-4">
                            {formatDefinition(term.definition, searchQuery)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
