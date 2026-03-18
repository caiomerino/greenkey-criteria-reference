import React from 'react'
import { CheckCircle2, XCircle, Target } from 'lucide-react'

export default function ScopeView({ data }) {
  const sections = data.scope

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

      {/* Scope sections */}
      {sections.map((section, i) => {
        const isIncluded = section.heading.includes('included')
        const isExcluded = section.heading.includes('excluded')
        
        return (
          <div key={i} className="bg-white rounded-xl border border-gk-border overflow-hidden">
            <div className={`px-6 py-4 border-b border-gk-border flex items-center gap-2 ${
              isIncluded ? 'bg-green-50' : isExcluded ? 'bg-red-50' : 'bg-gk-surface'
            }`}>
              {isIncluded && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
              {isExcluded && <XCircle size={18} className="text-red-500 shrink-0" />}
              <h2 className="text-base font-black text-gk-text">{section.heading}</h2>
            </div>
            <div className="p-6 space-y-3">
              {section.content.map((para, j) => (
                <p key={j} className="text-sm text-gk-text leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
