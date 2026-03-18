import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'
import Tooltip from './Tooltip'

const CATEGORY_LABELS = {
  'HH': 'Hotels & Hostels',
  'CHP': 'Campsites & Holiday Parks',
  'SA': 'Small Accommodations',
  'CC': 'Conference Centres',
  'R': 'Restaurants / Cafés',
  'A': 'Attractions',
}

function highlightText(text, query) {
  if (!query || !text) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  )
}

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

/**
 * Renders cross-reference links within text.
 * Matches patterns like "criterion 1.2", "criteria 3.1, 4.1, 5.6, 7.12",
 * "criterion 1.2 and criterion 1.3"
 */
function renderWithCrossRefs(text, navigateToCriterion) {
  if (!text || !navigateToCriterion) return text
  
  // Match "criterion X.Y" or "criteria X.Y" patterns
  const regex = /\b(criter(?:ion|ia))\s+([\d]+\.[\d]+(?:(?:\s*(?:,|and|or|and\/or)\s*(?:(?:criterion|criteria)\s+)?[\d]+\.[\d]+)*))/gi
  
  const parts = []
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    
    // Parse all criterion numbers from the match
    const fullMatch = match[0]
    const numberRegex = /(\d+\.\d+)/g
    const numbers = []
    let numMatch
    while ((numMatch = numberRegex.exec(fullMatch)) !== null) {
      numbers.push(numMatch[1])
    }
    
    // Build the rendered elements preserving the original text structure
    // but making criterion numbers clickable
    let rendered = fullMatch
    const renderedParts = []
    let renderedLastIdx = 0
    const numRegex2 = /(\d+\.\d+)/g
    let nm
    while ((nm = numRegex2.exec(fullMatch)) !== null) {
      if (nm.index > renderedLastIdx) {
        renderedParts.push(fullMatch.substring(renderedLastIdx, nm.index))
      }
      const num = nm[1]
      renderedParts.push(
        <button
          key={`ref-${match.index}-${nm.index}`}
          onClick={(e) => { e.stopPropagation(); navigateToCriterion(num) }}
          className="text-gk-blue hover:text-gk-blue-dark underline underline-offset-2 font-semibold cursor-pointer"
          title={`Go to criterion ${num}`}
        >
          {num}
        </button>
      )
      renderedLastIdx = nm.index + nm[0].length
    }
    if (renderedLastIdx < fullMatch.length) {
      renderedParts.push(fullMatch.substring(renderedLastIdx))
    }
    
    parts.push(<span key={`crossref-${match.index}`}>{renderedParts}</span>)
    lastIndex = match.index + match[0].length
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  return parts.length > 0 ? parts : text
}

function renderHighlightedLine(text, navigateToCriterion) {
  if (!text) return text
  
  const colonIdx = text.indexOf(': ')
  if (colonIdx > 0 && colonIdx < 80 && !text.trim().endsWith(':')) {
    const label = text.substring(0, colonIdx)
    const rest = text.substring(colonIdx + 2)
    
    if (label.length < 80 && /^[A-Z]/.test(label.trim())) {
      return (
        <>
          <strong className="text-gk-text dark:text-gk-dark-text">{renderWithCrossRefs(label, navigateToCriterion)}:</strong>{' '}
          <span className="italic text-gk-text/90 dark:text-gk-dark-text/90">{renderWithCrossRefs(rest, navigateToCriterion)}</span>
        </>
      )
    }
  }
  
  return renderWithCrossRefs(text, navigateToCriterion)
}

function formatNotes(text, navigateToCriterion) {
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
            <p className="text-sm text-gk-text dark:text-gk-dark-text leading-relaxed mb-1.5 italic">
              {renderWithCrossRefs(listIntro, navigateToCriterion)}
            </p>
          )}
          <ul className="list-none space-y-1 ml-1">
            {listItems.map((item, j) => (
              <li key={j} className="text-sm text-gk-text dark:text-gk-dark-text leading-relaxed flex gap-2">
                <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-gk-blue/40" />
                <span>{renderWithCrossRefs(cleanListItem(item), navigateToCriterion)}</span>
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
    
    if (/^Relevance$/i.test(trimmed)) {
      flushList()
      elements.push(
        <div key={idx} className="mt-5 first:mt-0 mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-gk-blue border-b border-gk-blue/20 pb-1">
            {trimmed}
          </h4>
        </div>
      )
      continue
    }
    
    if (/^Expectations for implementation$/i.test(trimmed)) {
      flushList()
      elements.push(
        <div key={idx} className="mt-5 first:mt-0 mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-gk-green-web border-b border-gk-green-web/20 pb-1">
            {trimmed}
          </h4>
        </div>
      )
      continue
    }

    if (/^Audit evidence$/i.test(trimmed)) {
      flushList()
      elements.push(
        <div key={idx} className="mt-5 first:mt-0 mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-300/50 dark:border-slate-600/50 pb-1">
            {trimmed}
          </h4>
        </div>
      )
      continue
    }
    
    if (/^ⓘ Note on national adaptation/.test(trimmed)) {
      flushList()
      elements.push(
        <div key={idx} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-3 mt-4">
          <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-amber-700 dark:text-amber-400">
            <Info size={12} className="inline mr-1 -mt-0.5" />
            {trimmed}
          </h4>
        </div>
      )
      continue
    }

    if (isListIntroducer(trimmed)) {
      flushList()
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (isListItem(nextLine) || startsWithLowercase(nextLine)) {
        inList = true
        listIntro = trimmed
      } else {
        elements.push(
          <p key={idx} className="text-sm text-gk-text dark:text-gk-dark-text leading-relaxed mb-2 italic">
            {renderWithCrossRefs(trimmed, navigateToCriterion)}
          </p>
        )
      }
      continue
    }
    
    if (inList && (isListItem(trimmed) || startsWithLowercase(trimmed))) {
      listItems.push(trimmed)
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (!isListItem(nextLine) && !startsWithLowercase(nextLine)) {
        flushList()
      }
      continue
    }
    
    if (!inList && isListItem(trimmed)) {
      inList = true
      listItems.push(trimmed)
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (!isListItem(nextLine) && !startsWithLowercase(nextLine)) {
        flushList()
      }
      continue
    }
    
    flushList()
    elements.push(
      <p key={idx} className="text-sm text-gk-text dark:text-gk-dark-text leading-relaxed mb-2 last:mb-0">
        {renderHighlightedLine(trimmed, navigateToCriterion)}
      </p>
    )
  }
  
  flushList()
  return elements
}

function cleanListItem(text) {
  let t = text.trim()
  t = t.replace(/^[-–—•]\s*/, '')
  t = t.replace(/^[a-z]\)\s*/, '')
  t = t.replace(/;\s*(and|or|and\/or)\s*$/, '')
  t = t.replace(/;\s*$/, '')
  return t
}

export default function CriterionCard({ criterion, searchQuery, autoExpand, navigateToCriterion }) {
  const [expanded, setExpanded] = useState(false)
  
  // Auto-expand when deep-linked
  useEffect(() => {
    if (autoExpand) setExpanded(true)
  }, [autoExpand])
  
  const { number, statement, type, categories, has_national_note, explanatory_notes } = criterion
  
  return (
    <div className={`criterion-card bg-white dark:bg-gk-dark-surface rounded-xl border overflow-hidden ${
      autoExpand
        ? 'border-gk-blue ring-2 ring-gk-blue/30'
        : 'border-gk-border dark:border-gk-dark-border'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
          type === 'imperative' ? 'bg-gk-blue' : 'bg-gk-green-web'
        }`}>
          {number}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gk-text dark:text-gk-dark-text leading-relaxed pr-4">
            {searchQuery ? highlightText(statement, searchQuery) : statement}
          </p>
          
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
              type === 'imperative' ? 'badge-imperative' : 'badge-guideline'
            }`}>
              {type === 'imperative' ? 'Imperative' : 'Guideline'}
            </span>
            
            {categories.map(cat => (
              <Tooltip key={cat} content={CATEGORY_LABELS[cat] || cat} position="top">
                <span className="badge-category px-2 py-0.5 rounded text-[10px] font-bold inline-block">
                  {cat}
                </span>
              </Tooltip>
            ))}
            
            {has_national_note && (
              <Tooltip content="This criterion may be adapted by national operators to reflect local regulations and conditions." position="top">
                <span className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                  <Info size={10} />
                  National adaptation
                </span>
              </Tooltip>
            )}
          </div>
        </div>
        
        <div className="shrink-0 mt-1">
          {expanded
            ? <ChevronDown size={18} className="text-gk-text-muted dark:text-gk-dark-text-muted" />
            : <ChevronRight size={18} className="text-gk-text-muted dark:text-gk-dark-text-muted" />
          }
        </div>
      </button>
      
      {expanded && explanatory_notes && (
        <div className="border-t border-gk-border dark:border-gk-dark-border bg-slate-50/50 dark:bg-slate-800/30 px-4 sm:px-5 py-4 sm:py-5">
          <div className="ml-0 sm:ml-15">
            {formatNotes(explanatory_notes, navigateToCriterion)}
          </div>
        </div>
      )}
    </div>
  )
}
