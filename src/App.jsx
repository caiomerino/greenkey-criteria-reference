import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import data from './data.json'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import IntroductionView from './views/IntroductionView'
import CategoriesView from './views/CategoriesView'
import ScopeView from './views/ScopeView'
import CriteriaView from './views/CriteriaView'
import GlossaryView from './views/GlossaryView'
import { Menu } from 'lucide-react'

const CATEGORY_CODES = ['HH', 'CHP', 'SA', 'CC', 'R', 'A']

export default function App() {
  const [activeView, setActiveView] = useState('introduction')
  const [activeSection, setActiveSection] = useState(null)
  const [activeSubsection, setActiveSubsection] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState([])
  const [typeFilter, setTypeFilter] = useState(null) // 'imperative' | 'guideline' | null
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainRef = useRef(null)

  // Navigate to a section
  const navigateTo = useCallback((view, section = null, subsection = null) => {
    setActiveView(view)
    setActiveSection(section)
    setActiveSubsection(subsection)
    setSidebarOpen(false)
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Toggle category filter
  const toggleCategory = useCallback((cat) => {
    setCategoryFilter(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setCategoryFilter([])
    setTypeFilter(null)
  }, [])

  // Filter criteria based on search and filters
  const filteredSections = useMemo(() => {
    if (!searchQuery && categoryFilter.length === 0 && !typeFilter) {
      return data.criteria.sections
    }

    const query = searchQuery.toLowerCase()

    return data.criteria.sections.map(section => ({
      ...section,
      subsections: section.subsections.map(sub => ({
        ...sub,
        criteria: sub.criteria.filter(c => {
          // Type filter
          if (typeFilter && c.type !== typeFilter) return false

          // Category filter
          if (categoryFilter.length > 0 && !categoryFilter.some(cat => c.categories.includes(cat))) return false

          // Search filter
          if (query) {
            const searchIn = `${c.number} ${c.statement} ${c.explanatory_notes}`.toLowerCase()
            return searchIn.includes(query)
          }

          return true
        })
      })).filter(sub => sub.criteria.length > 0)
    })).filter(section => section.subsections.length > 0)
  }, [searchQuery, categoryFilter, typeFilter])

  // Count active criteria
  const totalFilteredCriteria = useMemo(() => {
    return filteredSections.reduce((acc, s) =>
      acc + s.subsections.reduce((acc2, ss) => acc2 + ss.criteria.length, 0), 0)
  }, [filteredSections])

  // Search glossary
  const filteredGlossary = useMemo(() => {
    if (!searchQuery) return data.glossary
    const query = searchQuery.toLowerCase()
    return data.glossary.filter(t =>
      t.term.toLowerCase().includes(query) || t.definition.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <div className="h-screen flex flex-col font-lato">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        <div
          className={`sidebar-overlay lg:hidden ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <Sidebar
          data={data}
          activeView={activeView}
          activeSection={activeSection}
          activeSubsection={activeSubsection}
          navigateTo={navigateTo}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          filteredSections={filteredSections}
        />

        {/* Main content */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto bg-gk-surface"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
            {/* Filter bar when on criteria view */}
            {activeView === 'criteria' && (
              <div className="mb-6 bg-white rounded-xl border border-gk-border p-4 no-print">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-gk-text-muted uppercase tracking-wide">Filter by category:</span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_CODES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          categoryFilter.includes(cat)
                            ? 'bg-gk-blue text-white'
                            : 'badge-category hover:bg-gk-blue-light'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="h-5 w-px bg-gk-border mx-1 hidden sm:block" />
                  <span className="text-sm font-bold text-gk-text-muted uppercase tracking-wide">Type:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTypeFilter(typeFilter === 'imperative' ? null : 'imperative')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        typeFilter === 'imperative'
                          ? 'badge-imperative'
                          : 'badge-category hover:bg-gk-blue-light'
                      }`}
                    >
                      Imperative (I)
                    </button>
                    <button
                      onClick={() => setTypeFilter(typeFilter === 'guideline' ? null : 'guideline')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        typeFilter === 'guideline'
                          ? 'badge-guideline'
                          : 'badge-category hover:bg-gk-green-light'
                      }`}
                    >
                      Guideline (G)
                    </button>
                  </div>
                  {(categoryFilter.length > 0 || typeFilter || searchQuery) && (
                    <>
                      <div className="h-5 w-px bg-gk-border mx-1 hidden sm:block" />
                      <button
                        onClick={clearFilters}
                        className="text-xs text-gk-blue hover:text-gk-blue-dark font-bold"
                      >
                        Clear all filters
                      </button>
                      <span className="text-xs text-gk-text-muted ml-auto">
                        {totalFilteredCriteria} of 139 criteria
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Views */}
            {activeView === 'introduction' && (
              <IntroductionView data={data} navigateTo={navigateTo} />
            )}
            {activeView === 'categories' && (
              <CategoriesView data={data} />
            )}
            {activeView === 'scope' && (
              <ScopeView data={data} />
            )}
            {activeView === 'criteria' && (
              <CriteriaView
                sections={filteredSections}
                activeSection={activeSection}
                activeSubsection={activeSubsection}
                searchQuery={searchQuery}
                glossary={data.glossary}
                navigateTo={navigateTo}
              />
            )}
            {activeView === 'glossary' && (
              <GlossaryView terms={filteredGlossary} searchQuery={searchQuery} />
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-gk-border bg-white py-6 px-8 text-center no-print">
            <p className="text-xs text-gk-text-muted">
              Green Key Criteria and Explanatory Notes — 1 October 2026 – 31 December 2031
            </p>
            <p className="text-xs text-gk-text-muted mt-1">
              © Foundation for Environmental Education (FEE). All rights reserved.
            </p>
            <p className="text-xs text-gk-text-muted mt-1 italic">
              Translations are provided for convenience only. The official English text is the authoritative version.
            </p>
            <a
              href="https://www.perplexity.ai/computer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-slate-500 mt-2 inline-block"
            >
              Created with Perplexity Computer
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
