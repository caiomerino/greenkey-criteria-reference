import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Mail, Check, Shield, Users, Droplets, Zap, Trash2, ShoppingBag, TreePine } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

const SUPABASE_URL = 'https://dlhegdwfioyhsmlkeolb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsaGVnZHdmaW95aHNtbGtlb2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjI3MDEsImV4cCI6MjA4ODk5ODcwMX0.V11lgE78svJsMpCStEEV0ogiwL2dkzAtf9HYSqZ0hxI'

const PREVIEW_SECTIONS = [
  { name: 'Sustainable Management', count: 24, Icon: Shield, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'Guest Awareness', count: 11, Icon: Users, color: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Water', count: 17, Icon: Droplets, color: 'text-cyan-600 dark:text-cyan-400' },
  { name: 'Energy & Carbon', count: 29, Icon: Zap, color: 'text-amber-600 dark:text-amber-400' },
  { name: 'Waste', count: 13, Icon: Trash2, color: 'text-orange-600 dark:text-orange-400' },
  { name: 'Procurement', count: 31, Icon: ShoppingBag, color: 'text-violet-600 dark:text-violet-400' },
  { name: 'Living Environment', count: 14, Icon: TreePine, color: 'text-green-600 dark:text-green-400' },
]

function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params)
  }
}

export default function EmailGate({ onUnlock, darkMode }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    trackEvent('gate_shown')
  }, [])

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/email_captures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: 'criteria-reference',
          page_url: window.location.href,
        }),
      })
      // 409 = duplicate — still unlock
    } catch (err) {
      console.warn('Email capture failed:', err)
    }

    // Store locally and track
    localStorage.setItem('gk-criteria-email', email.trim().toLowerCase())
    trackEvent('email_capture', { event_category: 'engagement', event_label: 'criteria_gate' })

    setSubmitting(false)
    setSuccess(true)

    // After brief success animation, unlock
    setTimeout(() => {
      onUnlock()
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Hero card — same gradient style as IntroductionView */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Card className="bg-gradient-to-br from-[hsl(var(--gk-blue))] to-[hsl(211,100%,30%)] border-0 p-8 sm:p-10 text-white overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                Access the Full Criteria
              </h1>
              <p className="text-blue-200 mt-1 text-sm font-medium">
                139 criteria across 7 sections — every detail, explanation, and audit expectation.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Email form card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                You're looking at the most user-friendly version of the Green Key criteria available anywhere. We built this so national operators and establishments can quickly reference what matters, without wading through PDF documents.
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                Pop in your email and the full criteria are yours. That's it — no spam, no subscriptions, no catch.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 py-4 px-5 rounded-xl bg-[hsl(var(--gk-green))]/10 border border-[hsl(var(--gk-green))]/30"
                >
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--gk-green))] flex items-center justify-center shrink-0">
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-[hsl(var(--gk-green-web))]">
                    You're in ✓ — opening the full criteria now…
                  </span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-3"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        placeholder="your@email.com"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gk-blue))] transition-colors ${
                          error ? 'border-red-400 dark:border-red-500' : 'border-border'
                        }`}
                        autoComplete="email"
                        disabled={submitting}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting || !email}
                      className="bg-[hsl(var(--gk-green))] hover:bg-[hsl(var(--gk-green))]/90 text-white font-bold px-6 shrink-0 whitespace-nowrap"
                    >
                      {submitting ? 'Unlocking…' : 'Unlock All Criteria'}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Your email is stored securely and only used to understand who finds this resource useful.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blurred preview of what's behind the gate */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative"
      >
        {/* Fade overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none rounded-xl bg-gradient-to-b from-transparent via-background/60 to-background" />

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              What's inside
            </p>
            <div
              className="space-y-2"
              style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}
            >
              {PREVIEW_SECTIONS.map((section) => {
                const { Icon } = section
                return (
                  <div
                    key={section.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/60 border border-border"
                  >
                    <Icon size={16} className={`shrink-0 ${section.color}`} />
                    <span className="text-sm font-semibold text-foreground flex-1">
                      {section.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {section.count} criteria
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
