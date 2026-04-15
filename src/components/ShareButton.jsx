import React, { useState } from 'react'
import { Share2, Link2, Check, Mail, MessageCircle } from 'lucide-react'

export default function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const trackEvent = (name, params = {}) => {
    if (typeof gtag === 'function') gtag('event', name, params)
  }

  const handleCopyLink = async () => {
    trackEvent('share', { method: 'copy_link' })
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = currentUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Green Key Criteria & Explanatory Notes 2026–2031',
          text: 'Green Key digital criteria reference — all 139 criteria, glossary, and scope definitions.',
          url: currentUrl,
        })
      } catch {
        // User cancelled
      }
      setOpen(false)
    }
  }

  const handleEmailShare = () => {
    trackEvent('share', { method: 'email' })
    const subject = encodeURIComponent('Green Key Criteria & Explanatory Notes 2026–2031')
    const body = encodeURIComponent(`Here is the digital reference for Green Key Criteria:\n\n${currentUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gk-blue dark:text-blue-400 bg-gk-blue-light dark:bg-gk-blue/20 hover:bg-blue-100 dark:hover:bg-gk-blue/30 rounded-lg transition-colors"
        aria-label="Share"
      >
        <Share2 size={15} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gk-dark-surface rounded-xl shadow-lg border border-gk-border dark:border-gk-dark-border py-2 w-56 z-50">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gk-text dark:text-gk-dark-text hover:bg-gk-surface dark:hover:bg-gk-dark-bg transition-colors"
            >
              {copied ? <Check size={16} className="text-gk-green" /> : <Link2 size={16} className="text-gk-text-muted dark:text-gk-dark-text-muted" />}
              <span>{copied ? 'Link copied' : 'Copy link'}</span>
            </button>

            <button
              onClick={handleEmailShare}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gk-text dark:text-gk-dark-text hover:bg-gk-surface dark:hover:bg-gk-dark-bg transition-colors"
            >
              <Mail size={16} className="text-gk-text-muted dark:text-gk-dark-text-muted" />
              <span>Share via email</span>
            </button>

            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gk-text dark:text-gk-dark-text hover:bg-gk-surface dark:hover:bg-gk-dark-bg transition-colors"
              >
                <MessageCircle size={16} className="text-gk-text-muted dark:text-gk-dark-text-muted" />
                <span>More sharing options</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
