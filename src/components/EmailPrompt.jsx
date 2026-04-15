import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Mail, CheckCircle2, Loader2 } from 'lucide-react'

const SUPABASE_URL = 'https://dlhegdwfioyhsmlkeolb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsaGVnZHdmaW95aHNtbGtlb2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjI3MDEsImV4cCI6MjA4ODk5ODcwMX0.V11lgE78svJsMpCStEEV0ogiwL2dkzAtf9HYSqZ0hxI'
const STORAGE_KEY = 'gk-criteria-email'

function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params)
  }
}

export default function EmailPrompt() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already captured
    if (localStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => {
      setVisible(true)
      trackEvent('email_prompt_shown')
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    setTimeout(() => setVisible(false), 300)
    trackEvent('email_prompt_dismissed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setSubmitting(true)

    try {
      await fetch(SUPABASE_URL + '/rest/v1/email_captures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email: trimmed,
          source: 'criteria-reference',
          page_url: window.location.href
        })
      })
    } catch (err) {
      console.warn('Email capture: Supabase unavailable', err)
    }

    localStorage.setItem(STORAGE_KEY, trimmed)

    trackEvent('email_capture', {
      event_category: 'engagement',
      event_label: 'criteria_prompt'
    })

    setSubmitting(false)
    setSuccess(true)

    setTimeout(() => {
      setDismissed(true)
      setTimeout(() => setVisible(false), 300)
    }, 2500)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[420px] z-[60]"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors z-10"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {success ? (
              /* ── Success state ── */
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                >
                  <CheckCircle2 size={40} className="mx-auto text-[hsl(var(--gk-green))]" />
                </motion.div>
                <p className="mt-3 text-sm font-bold text-foreground">Thank you — that means a lot.</p>
                <p className="mt-1 text-xs text-muted-foreground">Enjoy the full reference.</p>
              </div>
            ) : (
              /* ── Prompt state ── */
              <div className="p-5 sm:p-6">
                {/* Accent bar */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-[hsl(var(--gk-green))]/10 flex items-center justify-center">
                    <Heart size={18} className="text-[hsl(var(--gk-green))]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-snug">
                      A quick word from the author
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-[13px] text-muted-foreground leading-relaxed">
                  <p>
                    This resource is an independent project — I built it on my own time
                    because the official criteria documents are, frankly, not the easiest
                    to work with. No one paid me to make this.
                  </p>
                  <p>
                    If you're finding it useful, I'd love to know who's out there using it.
                    Drop your email below and you'll be the first to hear about updates.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gk-green))]/40 focus:border-[hsl(var(--gk-green))] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="shrink-0 px-4 py-2.5 bg-[hsl(var(--gk-green))] hover:bg-[hsl(var(--gk-green))]/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      'Send'
                    )}
                  </button>
                </form>

                <p className="mt-2.5 text-[11px] text-muted-foreground/60 leading-relaxed">
                  No spam, no marketing. Just updates to this resource.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
