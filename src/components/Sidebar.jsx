import React, { useState } from 'react'
import {
  BookOpen, Shield, Layers, FileText, ChevronDown, ChevronRight,
  Droplets, Zap, Trash2, ShoppingBag, TreePine, Users, Eye, X,
  Home, List, Target
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

const SECTION_SHORT_NAMES = {
  'SUSTAINABLE MANAGEMENT': 'Sustainable Management',
  'GUEST AWARENESS AND INVOLVEMENT': 'Guest Awareness',
  'WATER': 'Water',
  'ENERGY AND CARBON': 'Energy & Carbon',
  'WASTE': 'Waste',
  'PROCUREMENT': 'Procurement',
  'LIVING ENVIRONMENT': 'Living Environment',
}

export default function Sidebar({ data, activeView, activeSection, activeSubsection, navigateTo, isOpen, onClose, filteredSections }) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (name) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const getCriteriaCount = (sectionName) => {
    const section = filteredSections?.find(s => s.name === sectionName)
    if (!section) return 0
    return section.subsections.reduce((acc, ss) => acc + ss.criteria.length, 0)
  }

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-gk-border
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}
    >
      {/* Mobile close */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gk-border">
        <span className="font-bold text-gk-text text-sm">Navigation</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-gk-surface">
          <X size={18} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
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

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-gk-border" />

        {/* Criteria sections label */}
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold text-gk-text-muted uppercase tracking-wider">
            Criteria Sections
          </span>
        </div>

        {/* Criteria sections */}
        {data.criteria.sections.map(section => {
          const Icon = SECTION_ICONS[section.name] || FileText
          const shortName = SECTION_SHORT_NAMES[section.name] || section.name
          const isExpanded = expandedSections[section.name]
          const count = getCriteriaCount(section.name)
          const isActive = activeView === 'criteria' && activeSection === section.name

          return (
            <div key={section.name} className="mb-0.5">
              <button
                onClick={() => {
                  toggleSection(section.name)
                  navigateTo('criteria', section.name, null)
                }}
                className={`nav-item w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                  isActive && !activeSubsection ? 'active' : ''
                }`}
              >
                <Icon size={15} className="shrink-0 text-gk-green" />
                <span className="flex-1 truncate">{shortName}</span>
                <span className="text-[10px] text-gk-text-muted font-bold bg-gk-surface rounded-full px-2 py-0.5">
                  {count}
                </span>
                {isExpanded
                  ? <ChevronDown size={14} className="shrink-0 text-gk-text-muted" />
                  : <ChevronRight size={14} className="shrink-0 text-gk-text-muted" />
                }
              </button>

              {/* Subsections */}
              {isExpanded && (
                <div className="ml-6 pl-3 border-l-2 border-gk-border">
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
                        <span className="text-[10px] text-gk-text-muted">{subCount}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-gk-border" />

        {/* Glossary */}
        <button
          onClick={() => navigateTo('glossary')}
          className={`nav-item w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
            activeView === 'glossary' ? 'active' : ''
          }`}
        >
          <BookOpen size={16} className="shrink-0" />
          <span>Glossary</span>
          <span className="text-[10px] text-gk-text-muted font-bold bg-gk-surface rounded-full px-2 py-0.5 ml-auto">
            {data.glossary.length}
          </span>
        </button>
      </nav>

      {/* Bottom info */}
      <div className="p-3 border-t border-gk-border bg-gk-surface">
        <p className="text-[10px] text-gk-text-muted text-center leading-relaxed">
          139 Criteria · 7 Sections · 6 Categories
          <br />
          Valid: 1 Oct 2026 – 31 Dec 2031
        </p>
      </div>
    </aside>
  )
}
