import React, { useState } from 'react'
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

/**
 * Detects whether a line is a list item based on:
 * - Ends with ; or ; and or ; or or ; and/or
 * - Starts with lowercase and follows a colon-ending line
 * - Starts with a bullet character
 * - Starts with a letter followed by ) like "a)"
 */
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
 * Renders a line that may contain a "Label: description" pattern.
 * If found, bolds the label and italicises the rest after the colon.
 * Only applies when the colon appears early in the line (first 80 chars)
 * and isn't a list introducer (doesn't end with colon).
 */
function renderHighlightedLine(text) {
  if (!text) return text
  
  // Check for "Label: description" pattern — colon within first portion, not at end
  const colonIdx = text.indexOf(': ')
  if (colonIdx > 0 && colonIdx < 80 && !text.trim().endsWith(':')) {
    const label = text.substring(0, colonIdx)
    const rest = text.substring(colonIdx + 2)
    
    // Only apply if the label looks like a heading/term (starts uppercase, short-ish)
    if (label.length < 80 && /^[A-Z]/.test(label.trim())) {
      return (
        <>
          <strong className="text-gk-text">{label}:</strong>{' '}
          <span className="italic text-gk-text/90">{rest}</span>
        </>
      )
    }
  }
  
  return text
}

/**
 * Parses explanatory notes into structured blocks with proper formatting.
 * 
 * Patterns handled:
 * 1. Section headings: "Relevance", "Expectations for implementation", "Audit evidence"
 * 2. National adaptation notes (ⓘ prefix)
 * 3. List-introducing lines (ending with ":")  → rendered in italic
 * 4. List items (ending with ";", "; and", "; or") → rendered as bullet points
 * 5. Continuation items (lowercase start after list) → rendered as bullet points
 * 6. "Label: description" patterns → bold label, italic description
 * 7. Regular paragraphs
 */
function formatNotes(text) {
  if (!text) return null
  
  const lines = text.split('\n').filter(p => p.trim())
  const elements = []
  let inList = false // tracks whether we're inside a list context
  let listItems = [] // accumulates list items
  let listIntro = null // the introducing line for the current list
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <div key={`list-${elements.length}`} className="my-2">
          {listIntro && (
            <p className="text-sm text-gk-text leading-relaxed mb-1.5 italic">
              {listIntro}
            </p>
          )}
          <ul className="list-none space-y-1 ml-1">
            {listItems.map((item, j) => (
              <li key={j} className="text-sm text-gk-text leading-relaxed flex gap-2">
                <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-gk-blue/40" />
                <span>{cleanListItem(item)}</span>
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
    
    // Section heading: Relevance
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
    
    // Section heading: Expectations for implementation
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

    // Section heading: Audit evidence
    if (/^Audit evidence$/i.test(trimmed)) {
      flushList()
      elements.push(
        <div key={idx} className="mt-5 first:mt-0 mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-300/50 pb-1">
            {trimmed}
          </h4>
        </div>
      )
      continue
    }
    
    // National adaptation note
    if (/^ⓘ Note on national adaptation/.test(trimmed)) {
      flushList()
      elements.push(
        <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-amber-700">
            <Info size={12} className="inline mr-1 -mt-0.5" />
            {trimmed}
          </h4>
        </div>
      )
      continue
    }

    // Check if this line introduces a list (ends with colon)
    if (isListIntroducer(trimmed)) {
      flushList() // flush any previous list
      
      // Check if next lines are list items
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (isListItem(nextLine) || startsWithLowercase(nextLine)) {
        // This is a list introducer — will be rendered as italic intro before bullets
        inList = true
        listIntro = trimmed
      } else {
        // It's a colon-ending sentence but not followed by a list
        // Render as italic paragraph
        elements.push(
          <p key={idx} className="text-sm text-gk-text leading-relaxed mb-2 italic">
            {trimmed}
          </p>
        )
      }
      continue
    }
    
    // List item detection
    if (inList && (isListItem(trimmed) || startsWithLowercase(trimmed))) {
      listItems.push(trimmed)
      
      // Check if this is the last item in the list
      // (next line is not a list item and doesn't start with lowercase)
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (!isListItem(nextLine) && !startsWithLowercase(nextLine)) {
        flushList()
      }
      continue
    }
    
    // Standalone list item without a preceding colon introducer
    // (semicolon-ending or lowercase-starting)
    if (!inList && isListItem(trimmed)) {
      inList = true
      listItems.push(trimmed)
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : ''
      if (!isListItem(nextLine) && !startsWithLowercase(nextLine)) {
        flushList()
      }
      continue
    }
    
    // Regular paragraph — check for "Label: description" highlighting
    flushList()
    elements.push(
      <p key={idx} className="text-sm text-gk-text leading-relaxed mb-2 last:mb-0">
        {renderHighlightedLine(trimmed)}
      </p>
    )
  }
  
  // Flush any remaining list
  flushList()
  
  return elements
}

/**
 * Cleans a list item by removing leading bullet chars, semicolons, and
 * trailing "; and", "; or", "; and/or" from the end.
 */
function cleanListItem(text) {
  let t = text.trim()
  // Remove leading bullet chars
  t = t.replace(/^[-–—•]\s*/, '')
  // Remove leading "a) " style markers
  t = t.replace(/^[a-z]\)\s*/, '')
  // Clean trailing semicolon patterns but preserve the text
  t = t.replace(/;\s*(and|or|and\/or)\s*$/, '')
  t = t.replace(/;\s*$/, '')
  // Capitalise first letter if it was lowercase
  if (t.length > 0 && t[0] === t[0].toLowerCase() && t[0] !== t[0].toUpperCase()) {
    // Don't capitalize if it looks like a continuation
  }
  return t
}

export default function CriterionCard({ criterion, searchQuery }) {
  const [expanded, setExpanded] = useState(false)
  
  const { number, statement, type, categories, has_national_note, explanatory_notes } = criterion
  
  return (
    <div className="criterion-card bg-white rounded-xl border border-gk-border overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-slate-50/50 transition-colors"
      >
        {/* Number badge */}
        <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
          type === 'imperative' ? 'bg-gk-blue' : 'bg-gk-green-web'
        }`}>
          {number}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Criterion text */}
          <p className="text-sm font-semibold text-gk-text leading-relaxed pr-4">
            {searchQuery ? highlightText(statement, searchQuery) : statement}
          </p>
          
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Type badge */}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
              type === 'imperative' ? 'badge-imperative' : 'badge-guideline'
            }`}>
              {type === 'imperative' ? 'Imperative' : 'Guideline'}
            </span>
            
            {/* Category badges with tooltips */}
            {categories.map(cat => (
              <Tooltip key={cat} content={CATEGORY_LABELS[cat] || cat} position="top">
                <span className="badge-category px-2 py-0.5 rounded text-[10px] font-bold inline-block">
                  {cat}
                </span>
              </Tooltip>
            ))}
            
            {/* National adaptation indicator */}
            {has_national_note && (
              <Tooltip content="This criterion may be adapted by national operators to reflect local regulations and conditions." position="top">
                <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold">
                  <Info size={10} />
                  National adaptation
                </span>
              </Tooltip>
            )}
          </div>
        </div>
        
        {/* Expand indicator */}
        <div className="shrink-0 mt-1">
          {expanded
            ? <ChevronDown size={18} className="text-gk-text-muted" />
            : <ChevronRight size={18} className="text-gk-text-muted" />
          }
        </div>
      </button>
      
      {/* Expanded content */}
      {expanded && explanatory_notes && (
        <div className="border-t border-gk-border bg-slate-50/50 px-4 sm:px-5 py-4 sm:py-5">
          <div className="ml-0 sm:ml-15">
            {formatNotes(explanatory_notes)}
          </div>
        </div>
      )}
    </div>
  )
}
