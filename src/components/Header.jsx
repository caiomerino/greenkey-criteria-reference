import React, { useEffect } from 'react'
import { Search, Menu, Globe, X, Printer, Moon, Sun } from 'lucide-react'
import ShareButton from './ShareButton'
import { Button } from './ui/button'
import { Switch } from './ui/switch'

export default function Header({ searchQuery, setSearchQuery, onMenuToggle, onPrint, darkMode, setDarkMode }) {
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
    <header className="bg-card border-b border-border sticky top-0 z-30 no-print">
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/green-key-logo.jpg"
            alt="Green Key"
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-foreground leading-tight">
              Criteria & Explanatory Notes
            </h1>
            <p className="text-xs text-muted-foreground">
              2026–2031
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search criteria, glossary, scope..."
              className="w-full pl-9 pr-16 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-border transition-colors"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5 font-medium pointer-events-none">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Google Translate */}
          <div className="flex items-center gap-1 shrink-0">
            <Globe size={16} className="text-muted-foreground hidden sm:block" />
            <div id="google_translate_element" className="translate-widget"></div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Dark mode toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer" title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? <Sun size={14} className="text-muted-foreground" /> : <Moon size={14} className="text-muted-foreground" />}
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              />
            </label>
          </div>

          {/* Print / Download */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrint}
            aria-label="Print or download as PDF"
            title="Print / Download PDF"
          >
            <Printer size={15} />
            <span className="hidden md:inline">Print</span>
          </Button>

          {/* Share */}
          <ShareButton />
        </div>
      </div>
    </header>
  )
}
