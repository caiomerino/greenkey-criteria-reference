import React, { useState } from 'react'
import CriterionCard from '../components/CriterionCard'
import {
  Shield, Users, Droplets, Zap, Trash2, ShoppingBag, TreePine, FileText,
  ChevronDown, ChevronRight
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

export default function CriteriaView({ sections, activeSection, activeSubsection, searchQuery, glossary, navigateTo, showAllCriteria }) {
  // Track collapsed state for sections and subsections
  const [collapsedSections, setCollapsedSections] = useState({})
  const [collapsedSubsections, setCollapsedSubsections] = useState({})

  const toggleSection = (name) => {
    setCollapsedSections(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const toggleSubsection = (sectionName, subName) => {
    const key = `${sectionName}::${subName}`
    setCollapsedSubsections(prev => ({ ...prev, [key]: !prev[key] }))
  }

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

  // Calculate total for "All Criteria" header
  const allTotal = sectionsToShow.reduce((acc, s) =>
    acc + s.subsections.reduce((a, ss) => a + ss.criteria.length, 0), 0)
  const allImperative = sectionsToShow.reduce((acc, s) =>
    acc + s.subsections.reduce((a, ss) => a + ss.criteria.filter(c => c.type === 'imperative').length, 0), 0)
  const allGuideline = sectionsToShow.reduce((acc, s) =>
    acc + s.subsections.reduce((a, ss) => a + ss.criteria.filter(c => c.type === 'guideline').length, 0), 0)

  return (
    <div className="space-y-6">
      {/* All Criteria header when in that mode */}
      {showAllCriteria && !activeSection && (
        <div className="bg-gradient-to-br from-gk-blue to-gk-blue-dark rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="text-2xl font-black mb-2">All Criteria</h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl mb-3">
            Complete listing of all Green Key criteria across every section. Use the filters above to narrow by category or type.
          </p>
          <div className="flex gap-3 text-xs">
            <span className="bg-white/20 rounded-full px-3 py-1 font-bold">
              {allTotal} criteria
            </span>
            <span className="bg-white/20 rounded-full px-3 py-1">
              {allImperative} imperative
            </span>
            <span className="bg-white/20 rounded-full px-3 py-1">
              {allGuideline} guideline
            </span>
          </div>
        </div>
      )}

      {sectionsToShow.map(section => {
        const Icon = SECTION_ICONS[section.name] || FileText
        const gradient = SECTION_COLORS[section.name] || 'from-gray-600 to-gray-700'
        const shortName = SECTION_SHORT_NAMES[section.name] || section.name
        const isSectionCollapsed = collapsedSections[section.name]
        
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
            {/* Collapsible section header */}
            <button
              onClick={() => toggleSection(section.name)}
              className={`w-full text-left bg-gradient-to-r ${gradient} rounded-2xl p-5 sm:p-6 mb-4 text-white transition-all hover:shadow-lg group`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-black">{shortName}</h2>
                  {section.subsection_summary && (
                    <p className="text-xs opacity-80 mt-0.5 italic">{section.subsection_summary}</p>
                  )}
                </div>
                <div className="shrink-0 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center transition-transform">
                  {isSectionCollapsed
                    ? <ChevronRight size={18} />
                    : <ChevronDown size={18} />
                  }
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 text-xs">
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
            </button>

            {/* Section content — collapsible */}
            {!isSectionCollapsed && (
              <div className="space-y-6 mb-8">
                {subsectionsToShow.map(subsection => {
                  const subKey = `${section.name}::${subsection.name}`
                  const isSubCollapsed = collapsedSubsections[subKey]

                  return (
                    <div key={subsection.name}>
                      {/* Collapsible subsection header */}
                      <button
                        onClick={() => toggleSubsection(section.name, subsection.name)}
                        className="w-full text-left flex items-center gap-2 mb-3 pb-2 border-b-2 border-gk-border hover:border-gk-blue/40 transition-colors group"
                      >
                        <div className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-gk-text-muted group-hover:text-gk-blue transition-colors">
                          {isSubCollapsed
                            ? <ChevronRight size={16} />
                            : <ChevronDown size={16} />
                          }
                        </div>
                        <h3 className="text-base font-black text-gk-text flex-1">{subsection.name}</h3>
                        <span className="text-xs text-gk-text-muted bg-gk-surface rounded-full px-2.5 py-0.5 font-semibold shrink-0">
                          {subsection.criteria.length} {subsection.criteria.length === 1 ? 'criterion' : 'criteria'}
                        </span>
                      </button>

                      {/* Subsection criteria — collapsible */}
                      {!isSubCollapsed && (
                        <div className="space-y-3 ml-0 sm:ml-2">
                          {subsection.criteria.map(criterion => (
                            <CriterionCard
                              key={criterion.number}
                              criterion={criterion}
                              searchQuery={searchQuery}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Show all sections navigation when viewing a specific section */}
      {activeSection && !showAllCriteria && (
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
