import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CriterionCard from '../components/CriterionCard'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Button } from '../components/ui/button'
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

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] } },
}

export default function CriteriaView({
  sections, activeSection, activeSubsection, searchQuery, glossary,
  navigateTo, showAllCriteria, expandAllSignal, highlightCriterion,
  navigateToCriterion
}) {
  const [collapsedSections, setCollapsedSections] = useState({})
  const [collapsedSubsections, setCollapsedSubsections] = useState({})
  const highlightRef = useRef(null)

  // Respond to expand/collapse all signal from parent
  useEffect(() => {
    if (expandAllSignal > 0) {
      // Expand all
      setCollapsedSections({})
      setCollapsedSubsections({})
    } else if (expandAllSignal < 0) {
      // Collapse all sections
      const collapsed = {}
      sections.forEach(s => { collapsed[s.name] = true })
      setCollapsedSections(collapsed)
    }
  }, [expandAllSignal, sections])

  // Auto-scroll to highlighted criterion
  useEffect(() => {
    if (highlightCriterion && highlightRef.current) {
      const timer = setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [highlightCriterion])

  const toggleSection = (name) => {
    setCollapsedSections(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const toggleSubsection = (sectionName, subName) => {
    const key = `${sectionName}::${subName}`
    setCollapsedSubsections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sectionsToShow = activeSection
    ? sections.filter(s => s.name === activeSection)
    : sections

  if (sectionsToShow.length === 0) {
    return (
      <Card className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <FileText size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No criteria found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters to see results.
        </p>
      </Card>
    )
  }

  const isImp = (c) => c.type === 'imperative' || c.type === 'dual'
  const isGui = (c) => c.type === 'guideline'  || c.type === 'dual'

  const allTotal = sectionsToShow.reduce((acc, s) =>
    acc + s.subsections.reduce((a, ss) => a + ss.criteria.length, 0), 0)
  const allImperative = sectionsToShow.reduce((acc, s) =>
    acc + s.subsections.reduce((a, ss) => a + ss.criteria.filter(isImp).length, 0), 0)
  const allGuideline = sectionsToShow.reduce((acc, s) =>
    acc + s.subsections.reduce((a, ss) => a + ss.criteria.filter(isGui).length, 0), 0)

  return (
    <div className="space-y-6">
      {showAllCriteria && !activeSection && (
        <Card className="bg-gradient-to-br from-[hsl(var(--gk-blue))] to-[hsl(211,100%,30%)] border-0 p-6 sm:p-8 text-white overflow-hidden">
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
        </Card>
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
          acc + ss.criteria.filter(isImp).length, 0)
        const guidelineCount = subsectionsToShow.reduce((acc, ss) =>
          acc + ss.criteria.filter(isGui).length, 0)

        return (
          <div key={section.name}>
            <button
              onClick={() => toggleSection(section.name)}
              className={`w-full text-left bg-gradient-to-r ${gradient} rounded-xl p-5 sm:p-6 mb-4 text-white transition-all hover:shadow-lg group`}
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
                <motion.div
                  animate={{ rotate: isSectionCollapsed ? -90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center"
                >
                  <ChevronDown size={18} />
                </motion.div>
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

            <AnimatePresence initial={false}>
              {!isSectionCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] },
                    opacity: { duration: 0.25, delay: 0.05 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 mb-8">
                    {subsectionsToShow.map(subsection => {
                      const subKey = `${section.name}::${subsection.name}`
                      const isSubCollapsed = collapsedSubsections[subKey]

                      return (
                        <div key={subsection.name}>
                          <button
                            onClick={() => toggleSubsection(section.name, subsection.name)}
                            className="w-full text-left flex items-center gap-2 mb-3 pb-2 border-b-2 border-border hover:border-primary/40 transition-colors group"
                          >
                            <motion.div
                              animate={{ rotate: isSubCollapsed ? -90 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors"
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                            <h3 className="text-base font-black text-foreground flex-1">{subsection.name}</h3>
                            <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 rounded-full">
                              {subsection.criteria.length} {subsection.criteria.length === 1 ? 'criterion' : 'criteria'}
                            </Badge>
                          </button>

                          <AnimatePresence initial={false}>
                            {!isSubCollapsed && (
                              <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                                className="space-y-3 ml-0 sm:ml-2"
                              >
                                {subsection.criteria.map(criterion => (
                                  <motion.div
                                    key={criterion.number}
                                    variants={staggerItem}
                                    ref={highlightCriterion === criterion.number ? highlightRef : null}
                                  >
                                    <CriterionCard
                                      criterion={criterion}
                                      searchQuery={searchQuery}
                                      autoExpand={highlightCriterion === criterion.number}
                                      navigateToCriterion={navigateToCriterion}
                                    />
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {activeSection && !showAllCriteria && (
        <div className="text-center pt-4">
          <Button
            variant="link"
            onClick={() => navigateTo('criteria', null, null)}
          >
            ← View all criteria sections
          </Button>
        </div>
      )}
    </div>
  )
}
