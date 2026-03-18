import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import data from './data.json'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import IntroductionView from './views/IntroductionView'
import CategoriesView from './views/CategoriesView'
import ScopeView from './views/ScopeView'
import CriteriaView from './views/CriteriaView'
import GlossaryView from './views/GlossaryView'
import PrintView from './views/PrintView'
import Tooltip from './components/Tooltip'
import { Menu, List, LayoutGrid } from 'lucide-react'

const CATEGORY_CODES = ['HH', 'CHP', 'SA', 'CC', 'R', 'A']
const CATEGORY_LABELS = {
  'HH': 'Hotels & Hostels',
  'CHP': 'Campsites & Holiday Parks',
  'SA': 'Small Accommodations',
  'CC': 'Conference Centres',
  'R': 'Restaurants / Cafés',
  'A': 'Attractions',
}

export default function App() {
  const [activeView, setActiveView] = useState('introduction')
  const [activeSection, setActiveSection] = useState(null)
  const [activeSubsection, setActiveSubsection] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState([])
  const [typeFilter, setTypeFilter] = useState(null) // 'imperative' | 'guideline' | null
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAllCriteria, setShowAllCriteria] = useState(false)
  const [isPrintView, setIsPrintView] = useState(false)
  const mainRef = useRef(null)

  // Navigate to a section
  const navigateTo = useCallback((view, section = null, subsection = null) => {
    setActiveView(view)
    setActiveSection(section)
    setActiveSubsection(subsection)
    setSidebarOpen(false)
    if (view === 'criteria' && !section) {
      setShowAllCriteria(true)
    } else if (view === 'criteria' && section) {
      setShowAllCriteria(false)
    }
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
          if (typeFilter && c.type !== typeFilter) return false
          if (categoryFilter.length > 0 && !categoryFilter.some(cat => c.categories.includes(cat))) return false
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

  // Print handler — switches to print view, then triggers browser print
  const handlePrint = useCallback(() => {
    setIsPrintView(true)
  }, [])

  const handleClosePrintView = useCallback(() => {
    setIsPrintView(false)
  }, [])

  // When print view renders, trigger browser print dialog
  useEffect(() => {
    if (isPrintView) {
      const timer = setTimeout(() => {
        window.print()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isPrintView])

  // Print view — full document layout for clean PDF export
  if (isPrintView) {
    return (
      <div>
        <div className="no-print sticky top-0 z-50 bg-white border-b border-gk-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/green-key-logo.jpg" alt="Green Key" className="h-8 w-auto" />
            <span className="text-sm font-bold text-gk-text">Print Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gk-blue text-white text-sm font-bold rounded-lg hover:bg-gk-blue-dark transition-colors"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={handleClosePrintView}
              className="px-4 py-2 bg-gk-surface text-gk-text text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Back to site
            </button>
          </div>
        </div>
        <PrintView data={data} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col font-lato">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onPrint={handlePrint}
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
          showAllCriteria={showAllCriteria}
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
                {/* View toggle: All vs. Section */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gk-border">
                  <span className="text-xs font-bold text-gk-text-muted uppercase tracking-wide mr-1">View:</span>
                  <button
                    onClick={() => {
                      setShowAllCriteria(true)
                      setActiveSection(null)
                      setActiveSubsection(null)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      showAllCriteria
                        ? 'bg-gk-blue text-white'
                        : 'bg-gk-surface text-gk-text-muted hover:bg-slate-200'
                    }`}
                  >
                    <List size={13} />
                    All Criteria
                  </button>
                  <button
                    onClick={() => {
                      setShowAllCriteria(false)
                      if (!activeSection && data.criteria.sections.length > 0) {
                        setActiveSection(data.criteria.sections[0].name)
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !showAllCriteria
                        ? 'bg-gk-blue text-white'
                        : 'bg-gk-surface text-gk-text-muted hover:bg-slate-200'
                    }`}
                  >
                    <LayoutGrid size={13} />
                    By Section
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-gk-text-muted uppercase tracking-wide">Category:</span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_CODES.map(cat => (
                      <Tooltip key={cat} content={CATEGORY_LABELS[cat]} position="bottom">
                        <button
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            categoryFilter.includes(cat)
                              ? 'bg-gk-blue text-white'
                              : 'badge-category hover:bg-gk-blue-light'
                          }`}
                        >
                          {cat}
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                  <div className="h-5 w-px bg-gk-border mx-1 hidden sm:block" />
                  <span className="text-xs font-bold text-gk-text-muted uppercase tracking-wide">Type:</span>
                  <div className="flex gap-2">
                    <Tooltip content="Mandatory criteria — must be met for certification" position="bottom">
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
                    </Tooltip>
                    <Tooltip content="Recommended criteria — required incrementally over certification years" position="bottom">
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
                    </Tooltip>
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
                      <span className="text-xs text-gk-text-muted ml-auto font-semibold">
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
                activeSection={showAllCriteria ? null : activeSection}
                activeSubsection={activeSubsection}
                searchQuery={searchQuery}
                glossary={data.glossary}
                navigateTo={navigateTo}
                showAllCriteria={showAllCriteria}
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
