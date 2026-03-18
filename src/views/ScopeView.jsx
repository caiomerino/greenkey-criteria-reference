import React, { useState } from 'react'
import { CheckCircle2, XCircle, Target, ChevronDown, ChevronRight } from 'lucide-react'

/**
 * Render scope content paragraphs with "Label: description" highlighting.
 * In excluded scope, items like "Beach/Marina facilities: ..." get the label bolded
 * and the description italicised.
 */
function renderScopeParagraph(text, idx) {
  if (!text) return null
  const trimmed = text.trim()
  
  // Check for "Label: description" pattern at the start
  const colonIdx = trimmed.indexOf(': ')
  if (colonIdx > 0 && colonIdx < 60 && /^[A-Z]/.test(trimmed)) {
    const label = trimmed.substring(0, colonIdx)
    const rest = trimmed.substring(colonIdx + 2)
    
    // Only apply to items that look like labelled exclusions (not regular sentences)
    // Heuristic: label is short (< 50 chars) and doesn't contain common verbs
    if (label.length < 50 && !/\b(is|are|the|this|for|all|has|have|should)\b/i.test(label)) {
      return (
        <div key={idx} className="text-sm leading-relaxed mb-3 flex gap-2">
          <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-gk-text-muted/40" />
          <p>
            <strong className="text-gk-text">{label}:</strong>{' '}
            <span className="italic text-gk-text/85">{rest}</span>
          </p>
        </div>
      )
    }
  }
  
  // Colon-ending line (list introducer) → italic
  if (trimmed.endsWith(':')) {
    return (
      <p key={idx} className="text-sm text-gk-text leading-relaxed mb-2 italic font-medium">
        {trimmed}
      </p>
    )
  }
  
  return (
    <p key={idx} className="text-sm text-gk-text leading-relaxed mb-2">
      {trimmed}
    </p>
  )
}

export default function ScopeView({ data }) {
  const sections = data.scope
  const [collapsedSections, setCollapsedSections] = useState({})

  const toggleSection = (heading) => {
    setCollapsedSections(prev => ({ ...prev, [heading]: !prev[heading] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-gk-green to-gk-green-dark rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Target size={28} />
          <h1 className="text-2xl font-black">Scope</h1>
        </div>
        <p className="text-green-100 text-sm leading-relaxed max-w-2xl">
          This appendix explains the rules on the certification boundary, including which services and
          facilities are included or excluded. The scope applies to all establishment categories eligible
          for Green Key certification.
        </p>
      </div>

      {/* Scope sections — collapsible */}
      {sections.map((section, i) => {
        const isIncluded = section.heading.includes('included')
        const isExcluded = section.heading.includes('excluded')
        const isCollapsed = collapsedSections[section.heading]
        
        return (
          <div key={i} className="bg-white rounded-xl border border-gk-border overflow-hidden">
            {/* Collapsible header */}
            <button
              onClick={() => toggleSection(section.heading)}
              className={`w-full text-left px-6 py-4 border-b border-gk-border flex items-center gap-2 transition-colors hover:opacity-90 ${
                isIncluded ? 'bg-green-50' : isExcluded ? 'bg-red-50' : 'bg-gk-surface'
              }`}
            >
              {isIncluded && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
              {isExcluded && <XCircle size={18} className="text-red-500 shrink-0" />}
              <h2 className="text-base font-black text-gk-text flex-1">{section.heading}</h2>
              <div className="shrink-0 text-gk-text-muted">
                {isCollapsed
                  ? <ChevronRight size={18} />
                  : <ChevronDown size={18} />
                }
              </div>
            </button>
            
            {/* Collapsible content */}
            {!isCollapsed && (
              <div className="p-6">
                {section.content.map((para, j) => renderScopeParagraph(para, j))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
