import React, { useEffect, useRef } from 'react'
import CriterionCard from '../components/CriterionCard'
import {
  Shield, Users, Droplets, Zap, Trash2, ShoppingBag, TreePine, FileText
} from 'lucide-react'

const SECTION_ICONS = {
  'SUSTAINABLE MANAGEMENT': Shield,
  'GUEST AWARENESS AND INVOLVEMENT': Users,
  'WATER': Droplets,
  'ENERGY AND CARBON': Zap,
  'WASTE': Trash2,
  'PROCUREMENT': ShoppingBag,
  'LIVING ENVIRONMENT': TreePine,
}

const SECTION_COLORS = {
  'SUSTAINABLE MANAGEMENT': 'from-blue-600 to-blue-700',
  'GUEST AWARENESS AND INVOLVEMENT': 'from-emerald-600 to-emerald-700',
  'WATER': 'from-cyan-600 to-cyan-700',
  'ENERGY AND CARBON': 'from-amber-600 to-amber-700',
  'WASTE': 'from-orange-600 to-orange-700',
  'PROCUREMENT': 'from-violet-600 to-violet-700',
  'LIVING ENVIRONMENT': 'from-green-600 to-green-700',
}

const SECTION_SHORT_NAMES = {
  'SUSTAINABLE MANAGEMENT': 'Sustainable Management',
  'GUEST AWARENESS AND INVOLVEMENT': 'Guest Awareness and Involvement',
  'WATER': 'Water',
  'ENERGY AND CARBON': 'Energy and Carbon',
  'WASTE': 'Waste',
  'PROCUREMENT': 'Procurement',
  'LIVING ENVIRONMENT': 'Living Environment',
}

export default function CriteriaView({ sections, activeSection, activeSubsection, searchQuery, glossary, navigateTo }) {
  const sectionRefs = useRef({})

  // Filter to show specific section/subsection
  const sectionsToShow = activeSection
    ? sections.filter(s => s.name === activeSection)
    : sections

  // No results
  if (sectionsToShow.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gk-surface flex items-center justify-center">
          <FileText size={24} className="text-gk-text-muted" />
        </div>
        <h3 className="text-lg font-bold text-gk-text mb-2">No criteria found</h3>
        <p className="text-sm text-gk-text-muted">
          Try adjusting your search or filters to see results.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sectionsToShow.map(section => {
        const Icon = SECTION_ICONS[section.name] || FileText
        const gradient = SECTION_COLORS[section.name] || 'from-gray-600 to-gray-700'
        const shortName = SECTION_SHORT_NAMES[section.name] || section.name
        
        const subsectionsToShow = activeSubsection
          ? section.subsections.filter(ss => ss.name === activeSubsection)
          : section.subsections

        const totalCriteria = subsectionsToShow.reduce((acc, ss) => acc + ss.criteria.length, 0)
        const imperativeCount = subsectionsToShow.reduce((acc, ss) =>
          acc + ss.criteria.filter(c => c.type === 'imperative').length, 0)
        const guidelineCount = subsectionsToShow.reduce((acc, ss) =>
          acc + ss.criteria.filter(c => c.type === 'guideline').length, 0)

        return (
          <div key={section.name}>
            {/* Section header */}
            <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-6 mb-6 text-white`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black">{shortName}</h2>
                  {section.subsection_summary && (
                    <p className="text-xs opacity-80 mt-0.5">{section.subsection_summary}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="bg-white/20 rounded-full px-3 py-1 font-bold">
                  {totalCriteria} criteria
                </span>
                <span className="bg-white/20 rounded-full px-3 py-1">
                  {imperativeCount} imperative
                </span>
                <span className="bg-white/20 rounded-full px-3 py-1">
                  {guidelineCount} guideline
                </span>
              </div>
            </div>

            {/* Subsections */}
            {subsectionsToShow.map(subsection => (
              <div key={subsection.name} className="mb-8">
                {/* Subsection header */}
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gk-border">
                  <h3 className="text-base font-black text-gk-text">{subsection.name}</h3>
                  <span className="text-xs text-gk-text-muted bg-gk-surface rounded-full px-2 py-0.5">
                    {subsection.criteria.length} criteria
                  </span>
                </div>

                {/* Criteria cards */}
                <div className="space-y-3">
                  {subsection.criteria.map(criterion => (
                    <CriterionCard
                      key={criterion.number}
                      criterion={criterion}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })}

      {/* Show all sections navigation when viewing a specific section */}
      {activeSection && (
        <div className="text-center pt-4">
          <button
            onClick={() => navigateTo('criteria', null, null)}
            className="text-sm text-gk-blue hover:text-gk-blue-dark font-bold"
          >
            ← View all criteria sections
          </button>
        </div>
      )}
    </div>
  )
}
