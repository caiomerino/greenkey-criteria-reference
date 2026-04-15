import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import data from './data.json'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ScrollProgress from './components/ScrollProgress'
import IntroductionView from './views/IntroductionView'
import CategoriesView from './views/CategoriesView'
import ScopeView from './views/ScopeView'
import CriteriaView from './views/CriteriaView'
import GlossaryView from './views/GlossaryView'
import PrintView from './views/PrintView'
import EmailPrompt from './components/EmailPrompt'
import { Tooltip } from './components/ui/tooltip'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Menu, List, LayoutGrid, ChevronsDown, ChevronsUp, X } from 'lucide-react'

/* ── Analytics ── */
function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params)
  }
}

const CATEGORY_CODES = ['HH', 'CHP', 'SA', 'CC', 'R', 'A']
const CATEGORY_LABELS = {
  'HH': 'Hotels & Hostels',
  'CHP': 'Campsites & Holiday Parks',
  'SA': 'Small Accommodations',
  'CC': 'Conference Centres',
  'R': 'Restaurants / Cafés',
  'A': 'Attractions',
}

/* ── Hash Routing ── */
function parseHash() {
  const hash = window.location.hash.replace('#', '') || ''
  const parts = hash.split('/')
  const view = parts[0] || 'introduction'
  // #criteria/SECTION_NAME or #criteria/SECTION_NAME/SUBSECTION_NAME
  // #criterion/4.1  (deep-link to a specific criterion)
  // #glossary/termName
  if (view === 'criteria' && parts[1]) {
    return {
      view: 'criteria',
      section: decodeURIComponent(parts[1]),
      subsection: parts[2] ? decodeURIComponent(parts[2]) : null,
      showAll: false,
    }
  }
  if (view === 'criterion' && parts[1]) {
    return { view: 'criterion', criterionNumber: parts[1] }
  }
  if (view === 'glossary' && parts[1]) {
    return { view: 'glossary', term: decodeURIComponent(parts[1]) }
  }
  if (view === 'all-criteria') {
    return { view: 'criteria', section: null, subsection: null, showAll: true }
  }
  return { view }
}

function buildHash(view, section, subsection, showAll) {
  if (view === 'criteria' && showAll) return '#all-criteria'
  if (view === 'criteria' && section && subsection) {
    return `#criteria/${encodeURIComponent(section)}/${encodeURIComponent(subsection)}`
  }
  if (view === 'criteria' && section) {
    return `#criteria/${encodeURIComponent(section)}`
  }
  if (view === 'introduction') return '#introduction'
  return `#${view}`
}

/* ── Dark Mode ── */
function getInitialDarkMode() {
  const stored = localStorage.getItem('gk-dark-mode')
  if (stored !== null) return stored === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/* ── Register Service Worker ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

/* ── Page transition variants ── */
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}
const pageTransition = {
  duration: 0.25,
  ease: [0.21, 0.47, 0.32, 0.98],
}

export default function App() {
  const [activeView, setActiveView] = useState('introduction')
  const [activeSection, setActiveSection] = useState(null)
  const [activeSubsection, setActiveSubsection] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState([])
  const [typeFilter, setTypeFilter] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAllCriteria, setShowAllCriteria] = useState(false)
  const [isPrintView, setIsPrintView] = useState(false)
  const [darkMode, setDarkMode] = useState(getInitialDarkMode)
  const [expandAllSignal, setExpandAllSignal] = useState(0)   // positive = expand, negative = collapse
  const [highlightCriterion, setHighlightCriterion] = useState(null) // criterion number to auto-expand
  const [highlightGlossaryTerm, setHighlightGlossaryTerm] = useState(null)
  const mainRef = useRef(null)

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('gk-dark-mode', darkMode)
  }, [darkMode])

  // Debounced search tracking
  useEffect(() => {
    if (!searchQuery) return
    const timer = setTimeout(() => {
      trackEvent('search', { search_term: searchQuery })
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // ── Hash routing: initial load + listen for changes ──
  useEffect(() => {
    function applyHash() {
      const parsed = parseHash()
      if (parsed.view === 'criterion') {
        // Find which section/subsection contains this criterion
        for (const section of data.criteria.sections) {
          for (const sub of section.subsections) {
            const found = sub.criteria.find(c => c.number === parsed.criterionNumber)
            if (found) {
              setActiveView('criteria')
              setActiveSection(section.name)
              setActiveSubsection(sub.name)
              setShowAllCriteria(false)
              setHighlightCriterion(parsed.criterionNumber)
              return
            }
          }
        }
        // fallback
        setActiveView('introduction')
      } else if (parsed.view === 'glossary' && parsed.term) {
        setActiveView('glossary')
        setHighlightGlossaryTerm(parsed.term)
      } else if (parsed.view === 'criteria') {
        setActiveView('criteria')
        setActiveSection(parsed.section || null)
        setActiveSubsection(parsed.subsection || null)
        setShowAllCriteria(parsed.showAll || (!parsed.section))
      } else {
        setActiveView(parsed.view || 'introduction')
        setActiveSection(null)
        setActiveSubsection(null)
        setShowAllCriteria(false)
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  // Navigate to a section (updates hash → triggers effect)
  const navigateTo = useCallback((view, section = null, subsection = null) => {
    setActiveView(view)
    setActiveSection(section)
    setActiveSubsection(subsection)
    setSidebarOpen(false)
    setHighlightCriterion(null)
    setHighlightGlossaryTerm(null)
    const showAll = view === 'criteria' && !section
    if (showAll) {
      setShowAllCriteria(true)
    } else if (view === 'criteria' && section) {
      setShowAllCriteria(false)
    }
    // Track page view
    trackEvent('page_view', { page_title: view, ...(section ? { section } : {}) })
    // Update hash without triggering the listener again
    const newHash = buildHash(view, section, subsection, showAll)
    if (window.location.hash !== newHash) {
      history.pushState(null, '', newHash)
    }
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Navigate to a specific criterion (deep-link)
  const navigateToCriterion = useCallback((criterionNumber) => {
    for (const section of data.criteria.sections) {
      for (const sub of section.subsections) {
        const found = sub.criteria.find(c => c.number === criterionNumber)
        if (found) {
          setActiveView('criteria')
          setActiveSection(section.name)
          setActiveSubsection(sub.name)
          setShowAllCriteria(false)
          setHighlightCriterion(criterionNumber)
          setSidebarOpen(false)
          history.pushState(null, '', `#criterion/${criterionNumber}`)
          if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
          }
          return
        }
      }
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

  // Print handler
  const handlePrint = useCallback(() => {
    trackEvent('print_view')
    setIsPrintView(true)
  }, [])

  const handleClosePrintView = useCallback(() => {
    setIsPrintView(false)
  }, [])

  useEffect(() => {
    if (isPrintView) {
      const timer = setTimeout(() => {
        window.print()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isPrintView])

  // Expand/Collapse All
  const handleExpandAll = useCallback(() => {
    setExpandAllSignal(prev => Math.abs(prev) + 1)
  }, [])
  const handleCollapseAll = useCallback(() => {
    setExpandAllSignal(prev => -(Math.abs(prev) + 1))
  }, [])

  // Print view
  if (isPrintView) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="no-print sticky top-0 z-50 bg-card border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/green-key-logo.jpg" alt="Green Key" className="h-8 w-auto" />
            <span className="text-sm font-bold text-foreground">Print Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.print()}
            >
              Print / Save as PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleClosePrintView}
            >
              Back to site
            </Button>
          </div>
        </div>
        <PrintView data={data} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col font-lato bg-background text-foreground">
      {/* Scroll progress bar */}
      <ScrollProgress containerRef={mainRef} />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onPrint={handlePrint}
        darkMode={darkMode}
        setDarkMode={(val) => {
          trackEvent('toggle_dark_mode', { enabled: val })
          setDarkMode(val)
        }}
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
          className="flex-1 overflow-y-auto bg-background"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
            {/* Filter bar when on criteria view and unlocked */}
            {activeView === 'criteria' && (
              <div className="mb-6 bg-card rounded-xl border border-border p-4 no-print shadow-sm">
                {/* View toggle: All vs. Section */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide mr-1">View:</span>
                  <Button
                    variant={showAllCriteria ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setShowAllCriteria(true)
                      setActiveSection(null)
                      setActiveSubsection(null)
                      history.pushState(null, '', '#all-criteria')
                    }}
                    className="gap-1.5"
                  >
                    <List size={13} />
                    All Criteria
                  </Button>
                  <Button
                    variant={!showAllCriteria ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setShowAllCriteria(false)
                      if (!activeSection && data.criteria.sections.length > 0) {
                        setActiveSection(data.criteria.sections[0].name)
                      }
                    }}
                    className="gap-1.5"
                  >
                    <LayoutGrid size={13} />
                    By Section
                  </Button>

                  {/* Expand/Collapse All */}
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleExpandAll}
                      title="Expand all sections"
                      className="gap-1"
                    >
                      <ChevronsDown size={13} />
                      <span className="hidden sm:inline">Expand All</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCollapseAll}
                      title="Collapse all sections"
                      className="gap-1"
                    >
                      <ChevronsUp size={13} />
                      <span className="hidden sm:inline">Collapse All</span>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Category:</span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_CODES.map(cat => (
                      <Tooltip key={cat} content={CATEGORY_LABELS[cat]} position="bottom">
                        <button
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            categoryFilter.includes(cat)
                              ? 'bg-[hsl(var(--gk-blue))] text-white'
                              : 'bg-secondary text-secondary-foreground border border-border hover:bg-accent/20'
                          }`}
                        >
                          {cat}
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                  <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Type:</span>
                  <div className="flex gap-2">
                    <Tooltip content="Mandatory criteria — must be met for certification" position="bottom">
                      <button
                        onClick={() => setTypeFilter(typeFilter === 'imperative' ? null : 'imperative')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          typeFilter === 'imperative'
                            ? 'bg-[hsl(var(--gk-blue))] text-white'
                            : 'bg-secondary text-secondary-foreground border border-border hover:bg-accent/20'
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
                            ? 'bg-[hsl(var(--gk-green))] text-white'
                            : 'bg-secondary text-secondary-foreground border border-border hover:bg-accent/20'
                        }`}
                      >
                        Guideline (G)
                      </button>
                    </Tooltip>
                  </div>
                  {(categoryFilter.length > 0 || typeFilter || searchQuery) && (
                    <>
                      <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
                      <Button
                        variant="link"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Clear all filters
                      </Button>
                      <span className="text-xs text-muted-foreground ml-auto font-semibold">
                        {totalFilteredCriteria} of 139 criteria
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Views with AnimatePresence for page transitions */}
            <AnimatePresence mode="wait">
              {activeView === 'introduction' && (
                <motion.div
                  key="introduction"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                >
                  <IntroductionView data={data} navigateTo={navigateTo} />
                </motion.div>
              )}
              {activeView === 'categories' && (
                <motion.div
                  key="categories"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                >
                  <CategoriesView data={data} />
                </motion.div>
              )}
              {activeView === 'scope' && (
                <motion.div
                  key="scope"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                >
                  <ScopeView data={data} />
                </motion.div>
              )}
              {activeView === 'criteria' && (
                <motion.div
                  key="criteria"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                >
                  <CriteriaView
                    sections={filteredSections}
                    activeSection={showAllCriteria ? null : activeSection}
                    activeSubsection={activeSubsection}
                    searchQuery={searchQuery}
                    glossary={data.glossary}
                    navigateTo={navigateTo}
                    showAllCriteria={showAllCriteria}
                    expandAllSignal={expandAllSignal}
                    highlightCriterion={highlightCriterion}
                    navigateToCriterion={navigateToCriterion}
                  />
                </motion.div>
              )}
              {activeView === 'glossary' && (
                <motion.div
                  key="glossary"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                >
                  <GlossaryView
                    terms={filteredGlossary}
                    searchQuery={searchQuery}
                    highlightTerm={highlightGlossaryTerm}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="border-t border-border bg-card py-6 px-8 text-center no-print">
            <p className="text-xs text-muted-foreground">
              Green Key Criteria and Explanatory Notes — 1 October 2026 – 31 December 2031
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © Foundation for Environmental Education (FEE). All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1 italic">
              Translations are provided for convenience only. The official English text is the authoritative version.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Created by Caio Merino
            </p>
          </footer>
        </main>
      </div>

      {/* Timed email prompt */}
      <EmailPrompt />
    </div>
  )
}
