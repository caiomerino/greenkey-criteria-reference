import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Target, ChevronDown, ChevronRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import FadeIn from '../components/FadeIn'

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
          <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          <p>
            <strong className="text-foreground">{label}:</strong>{' '}
            <span className="italic text-foreground/85">{rest}</span>
          </p>
        </div>
      )
    }
  }
  
  // Colon-ending line (list introducer) → italic
  if (trimmed.endsWith(':')) {
    return (
      <p key={idx} className="text-sm text-foreground leading-relaxed mb-2 italic font-medium">
        {trimmed}
      </p>
    )
  }
  
  return (
    <p key={idx} className="text-sm text-foreground leading-relaxed mb-2">
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
      <FadeIn>
        <Card className="bg-gradient-to-br from-[hsl(var(--gk-green))] to-[hsl(100,59%,33%)] border-0 p-8 text-white overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <Target size={28} />
            <h1 className="text-2xl font-black">Scope</h1>
          </div>
          <p className="text-green-100 text-sm leading-relaxed max-w-2xl">
            This appendix explains the rules on the certification boundary, including which services and
            facilities are included or excluded. The scope applies to all establishment categories eligible
            for Green Key certification.
          </p>
        </Card>
      </FadeIn>

      {/* Scope sections — collapsible */}
      {sections.map((section, i) => {
        const isIncluded = section.heading.includes('included')
        const isExcluded = section.heading.includes('excluded')
        const isCollapsed = collapsedSections[section.heading]
        
        return (
          <FadeIn key={i} delay={0.05 * (i + 1)}>
            <Card className="overflow-hidden">
              {/* Collapsible header */}
              <button
                onClick={() => toggleSection(section.heading)}
                className={`w-full text-left px-6 py-4 border-b border-border flex items-center gap-2 transition-colors hover:opacity-90 ${
                  isIncluded ? 'bg-green-50 dark:bg-green-900/20' : isExcluded ? 'bg-red-50 dark:bg-red-900/20' : 'bg-secondary'
                }`}
              >
                {isIncluded && <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 shrink-0" />}
                {isExcluded && <XCircle size={18} className="text-red-500 dark:text-red-400 shrink-0" />}
                <h2 className="text-base font-black text-foreground flex-1">{section.heading}</h2>
                <motion.div
                  animate={{ rotate: isCollapsed ? -90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-muted-foreground"
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>
              
              {/* Collapsible content */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
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
                    <div className="p-6">
                      {section.content.map((para, j) => renderScopeParagraph(para, j))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </FadeIn>
        )
      })}
    </div>
  )
}
