import React, { useEffect } from 'react'
import { Search, Menu, Globe, X, Printer, Download } from 'lucide-react'
import ShareButton from './ShareButton'

export default function Header({ searchQuery, setSearchQuery, onMenuToggle, onPrint }) {
  // Load Google Translate
  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }

      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <header className="bg-white border-b border-gk-border sticky top-0 z-30 no-print">
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gk-surface transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={20} className="text-gk-text" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/green-key-logo.jpg"
            alt="Green Key"
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-gk-text leading-tight">
              Criteria & Explanatory Notes
            </h1>
            <p className="text-xs text-gk-text-muted">
              2026–2031
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gk-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search criteria, glossary, scope..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-gk-surface border border-gk-border rounded-lg focus:outline-none focus:border-gk-blue focus:ring-1 focus:ring-gk-blue/30 transition-all placeholder:text-gk-text-muted"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gk-border transition-colors"
              >
                <X size={14} className="text-gk-text-muted" />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Google Translate */}
          <div className="flex items-center gap-1 shrink-0">
            <Globe size={16} className="text-gk-text-muted hidden sm:block" />
            <div id="google_translate_element" className="translate-widget"></div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gk-border hidden sm:block" />

          {/* Print / Download */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm font-semibold text-gk-text-muted hover:text-gk-text hover:bg-gk-surface rounded-lg transition-colors"
            aria-label="Print or download as PDF"
            title="Print / Download PDF"
          >
            <Printer size={15} />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* Share */}
          <ShareButton />
        </div>
      </div>
    </header>
  )
}
