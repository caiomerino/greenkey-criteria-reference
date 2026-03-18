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

function formatNotes(text) {
  if (!text) return null
  
  const paragraphs = text.split('\n').filter(p => p.trim())
  
  return paragraphs.map((para, idx) => {
    const trimmed = para.trim()
    
    // Section headings: Relevance, Expectations for implementation, Audit evidence
    if (/^(Relevance)$/i.test(trimmed)) {
      return (
        <div key={idx} className="mt-5 first:mt-0 mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-gk-blue border-b border-gk-blue/20 pb-1">
            {trimmed}
          </h4>
        </div>
      )
    }
    
    if (/^Expectations for implementation$/i.test(trimmed)) {
      return (
        <div key={idx} className="mt-5 first:mt-0 mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-gk-green-web border-b border-gk-green-web/20 pb-1">
            {trimmed}
          </h4>
        </div>
      )
    }

    if (/^Audit evidence$/i.test(trimmed)) {
      return (
        <div key={idx} className="mt-5 first:mt-0 mb-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-300/50 pb-1">
            {trimmed}
          </h4>
        </div>
      )
    }
    
    // National adaptation note
    if (/^ⓘ Note on national adaptation/.test(trimmed)) {
      return (
        <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-amber-700">
            <Info size={12} className="inline mr-1 -mt-0.5" />
            {trimmed}
          </h4>
        </div>
      )
    }

    // Bullet-like lines starting with dash or special chars
    if (/^[-–—•]/.test(trimmed) || /^[a-z]\)/.test(trimmed)) {
      return (
        <p key={idx} className="text-sm text-gk-text leading-relaxed mb-1.5 last:mb-0 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:bg-gk-blue/30 before:rounded-full">
          {trimmed.replace(/^[-–—•]\s*/, '')}
        </p>
      )
    }
    
    // Regular paragraph
    return (
      <p key={idx} className="text-sm text-gk-text leading-relaxed mb-2 last:mb-0">
        {trimmed}
      </p>
    )
  })
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
