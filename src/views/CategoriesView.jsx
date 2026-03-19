import React from 'react'
import { motion } from 'framer-motion'
import { Building2, Tent, Home, Presentation, UtensilsCrossed, Camera, Layers } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import FadeIn from '../components/FadeIn'

const CATEGORY_ICONS = {
  'Hotels and Hostels (HH)': Building2,
  'Campsite and Holiday Parks (CHP)': Tent,
  'Small Accommodations (SA)': Home,
  'Conference Centres (CC)': Presentation,
  'Restaurants/Cafés (R)': UtensilsCrossed,
  'Attractions (A)': Camera,
}

const CATEGORY_COLORS = {
  'Hotels and Hostels (HH)': 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800/40',
  'Campsite and Holiday Parks (CHP)': 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800/40',
  'Small Accommodations (SA)': 'border-violet-200 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-800/40',
  'Conference Centres (CC)': 'border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/40',
  'Restaurants/Cafés (R)': 'border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800/40',
  'Attractions (A)': 'border-cyan-200 bg-cyan-50 dark:bg-cyan-950/30 dark:border-cyan-800/40',
}

export default function CategoriesView({ data }) {
  const { introduction, categories } = data.categories

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <Card className="bg-gradient-to-br from-[hsl(var(--gk-blue))] to-[hsl(211,100%,30%)] border-0 p-8 text-white overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <Layers size={28} />
            <h1 className="text-2xl font-black">Category Definitions</h1>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
            Green Key is applicable to <strong className="text-white">6 specific types</strong> of establishments. Each category has defined eligibility conditions.
          </p>
        </Card>
      </FadeIn>

      {/* Introduction text */}
      <FadeIn delay={0.05}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {introduction.map((para, i) => (
                <p key={i} className="text-sm text-foreground leading-relaxed">{para}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Category cards */}
      <div className="space-y-4">
        {categories.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.code] || Building2
          const colorClass = CATEGORY_COLORS[cat.code] || 'border-border bg-card'
          
          // Extract the abbreviation from the code (e.g. "Hotels and Hostels (HH)" -> "HH")
          const abbrev = cat.code.match(/\(([^)]+)\)/)?.[1] || ''
          
          return (
            <FadeIn key={i} delay={0.05 * (i + 1)}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Card className={`overflow-hidden border-2 ${colorClass}`}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-secondary flex items-center justify-center shadow-sm">
                        <Icon size={20} className="text-[hsl(var(--gk-blue))]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-foreground">{cat.code}</h2>
                      </div>
                      {abbrev && (
                        <Badge variant="imperative" className="ml-auto">
                          {abbrev}
                        </Badge>
                      )}
                    </div>
                    <div className="bg-white dark:bg-card/50 rounded-lg p-4 border border-white/50 dark:border-border">
                      {cat.definition.split('\n').map((para, j) => (
                        <p key={j} className="text-sm text-foreground leading-relaxed mb-2 last:mb-0">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}
