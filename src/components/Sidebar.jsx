import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Shield, Layers, FileText, ChevronDown, ChevronRight,
  Droplets, Zap, Trash2, ShoppingBag, TreePine, Users, X,
  Home, List, Target, Lock
} from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const SECTION_ICONS = {
  'SUSTAINABLE MANAGEMENT': Shield,
  'GUEST AWARENESS AND INVOLVEMENT': Users,
  'WATER': Droplets,
  'ENERGY AND CARBON': Zap,
  'WASTE': Trash2,
  'PROCUREMENT': ShoppingBag,
  'LIVING ENVIRONMENT': TreePine,
}

const SECTION_SHORT_NAMES = {
  'SUSTAINABLE MANAGEMENT': 'Sustainable Management',
  'GUEST AWARENESS AND INVOLVEMENT': 'Guest Awareness',
  'WATER': 'Water',
  'ENERGY AND CARBON': 'Energy & Carbon',
  'WASTE': 'Waste',
  'PROCUREMENT': 'Procurement',
  'LIVING ENVIRONMENT': 'Living Environment',
}

export default function Sidebar({ data, activeView, activeSection, activeSubsection, navigateTo, isOpen, onClose, filteredSections, showAllCriteria, isUnlocked }) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (name) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const getCriteriaCount = (sectionName) => {
    const section = filteredSections?.find(s => s.name === sectionName)
    if (!section) return 0
    return section.subsections.reduce((acc, ss) => acc + ss.criteria.length, 0)
  }

  const totalCriteria = filteredSections?.reduce((acc, s) =>
    acc + s.subsections.reduce((a, ss) => a + ss.criteria.length, 0), 0) || 0

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-card border-r border-border
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}
    >
      {/* Mobile close */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
        <span className="font-bold text-foreground text-sm">Navigation</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X size={18} />
        </Button>
      </div>

      {/* Nav items */}
      <ScrollArea className="flex-1">
        <nav className="py-3 px-2">
          {/* Top-level nav */}
          <div className="mb-2">
            <button
              onClick={() => navigateTo('introduction')}
              className={`nav-item w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                activeView === 'introduction' ? 'active' : ''
              }`}
            >
              <Home size={16} className="shrink-0" />
              <span>Introduction</span>
            </button>

            <button
              onClick={() => navigateTo('categories')}
              className={`nav-item w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                activeView === 'categories' ? 'active' : ''
              }`}
            >
              <Layers size={16} className="shrink-0" />
              <span>Category Definitions</span>
            </button>

            <button
              onClick={() => navigateTo('scope')}
              className={`nav-item w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                activeView === 'scope' ? 'active' : ''
              }`}
            >
              <Target size={16} className="shrink-0" />
              <span>Scope</span>
            </button>
          </div>

          <div className="mx-3 my-3">
            <Separator />
          </div>

          {/* Criteria sections label */}
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Criteria Sections
            </span>
          </div>

          {/* All Criteria link */}
          <button
            onClick={() => navigateTo('criteria', null, null)}
            className={`nav-item w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 ${
              activeView === 'criteria' && showAllCriteria ? 'active' : ''
            } ${!isUnlocked ? 'opacity-50' : ''}`}
          >
            <List size={15} className="shrink-0 text-gk-blue" />
            <span className="flex-1">All Criteria</span>
            {!isUnlocked && <Lock size={12} className="shrink-0 text-muted-foreground" />}
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">
              {totalCriteria}
            </Badge>
          </button>

          {/* Criteria sections */}
          {data.criteria.sections.map(section => {
            const Icon = SECTION_ICONS[section.name] || FileText
            const shortName = SECTION_SHORT_NAMES[section.name] || section.name
            const isExpanded = expandedSections[section.name]
            const count = getCriteriaCount(section.name)
            const isActive = activeView === 'criteria' && activeSection === section.name && !showAllCriteria

            return (
              <div key={section.name} className="mb-0.5">
                <button
                  onClick={() => {
                    toggleSection(section.name)
                    navigateTo('criteria', section.name, null)
                  }}
                  className={`nav-item w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                    isActive && !activeSubsection ? 'active' : ''
                  } ${!isUnlocked ? 'opacity-50' : ''}`}
                >
                  <Icon size={15} className="shrink-0 text-gk-green-web" />
                  <span className="flex-1 truncate">{shortName}</span>
                  {!isUnlocked && <Lock size={11} className="shrink-0 text-muted-foreground" />}
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">
                    {count}
                  </Badge>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </motion.div>
                </button>

                {/* Subsections with animation */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 pl-3 border-l-2 border-border">
                        {section.subsections.map(sub => {
                          const subCount = filteredSections
                            ?.find(s => s.name === section.name)
                            ?.subsections.find(ss => ss.name === sub.name)
                            ?.criteria.length || 0
                          const isSubActive = activeView === 'criteria' &&
                            activeSection === section.name &&
                            activeSubsection === sub.name

                          return (
                            <button
                              key={sub.name}
                              onClick={() => navigateTo('criteria', section.name, sub.name)}
                              className={`nav-item w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                isSubActive ? 'active' : ''
                              }`}
                            >
                              <span className="flex-1 truncate">{sub.name}</span>
                              <span className="text-[10px] text-muted-foreground">{subCount}</span>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          <div className="mx-3 my-3">
            <Separator />
          </div>

          {/* Glossary */}
          <button
            onClick={() => navigateTo('glossary')}
            className={`nav-item w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
              activeView === 'glossary' ? 'active' : ''
            }`}
          >
            <BookOpen size={16} className="shrink-0" />
            <span>Glossary</span>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full ml-auto">
              {data.glossary.length}
            </Badge>
          </button>
        </nav>
      </ScrollArea>

      {/* Bottom info */}
      <div className="p-3 border-t border-border bg-secondary/50">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          <strong>139</strong> Criteria · <strong>7</strong> Sections · <strong>6</strong> Categories
          <br />
          Valid: 1 Oct 2026 – 31 Dec 2031
        </p>
      </div>
    </aside>
  )
}
