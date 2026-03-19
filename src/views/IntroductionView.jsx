import React from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Users, Droplets, Zap, Trash2, ShoppingBag, TreePine,
  ArrowRight, BookOpen, Target, Layers, List
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tooltip } from '../components/ui/tooltip'
import FadeIn from '../components/FadeIn'

const SECTION_CARDS = [
  { name: 'Sustainable Management', icon: Shield, count: 24, color: 'bg-blue-50 text-blue-700 border-blue-200', section: 'SUSTAINABLE MANAGEMENT' },
  { name: 'Guest Awareness', icon: Users, count: 11, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', section: 'GUEST AWARENESS AND INVOLVEMENT' },
  { name: 'Water', icon: Droplets, count: 17, color: 'bg-cyan-50 text-cyan-700 border-cyan-200', section: 'WATER' },
  { name: 'Energy & Carbon', icon: Zap, count: 29, color: 'bg-amber-50 text-amber-700 border-amber-200', section: 'ENERGY AND CARBON' },
  { name: 'Waste', icon: Trash2, count: 13, color: 'bg-orange-50 text-orange-700 border-orange-200', section: 'WASTE' },
  { name: 'Procurement', icon: ShoppingBag, count: 31, color: 'bg-violet-50 text-violet-700 border-violet-200', section: 'PROCUREMENT' },
  { name: 'Living Environment', icon: TreePine, count: 14, color: 'bg-green-50 text-green-700 border-green-200', section: 'LIVING ENVIRONMENT' },
]

const CATEGORY_TOOLTIPS = {
  'HH': 'Hotels & Hostels — fully operational hotels and hostels offering regular hospitality services',
  'CHP': 'Campsites & Holiday Parks — campsites, eco-camps, parks with rental accommodations',
  'SA': 'Small Accommodations — serviced accommodations with fewer than 25 lettable units',
  'CC': 'Conference Centres — fully operational conference centres in a permanent location',
  'R': 'Restaurants / Cafés — fully operational restaurants and cafés in stand-alone locations',
  'A': 'Attractions — museums, visitor/interpretation centres, theme parks, and similar venues',
}

export default function IntroductionView({ data, navigateTo }) {
  const certTable = data.criteria.certification_table

  return (
    <div className="space-y-8">
      {/* Hero */}
      <FadeIn>
        <Card className="bg-gradient-to-br from-[hsl(var(--gk-blue))] to-[hsl(211,100%,30%)] border-0 p-8 sm:p-10 text-white overflow-hidden">
          <div className="flex items-start gap-4 mb-4">
            <img
              src="/green-key-logo.jpg"
              alt="Green Key"
              className="h-16 w-auto rounded-lg bg-white p-1"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                Green Key Criteria &<br />Explanatory Notes
              </h1>
              <p className="text-blue-200 mt-1 text-sm font-medium">
                1 October 2026 – 31 December 2031
              </p>
            </div>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
            Green Key provides an independent, third-party certification scheme for tourism and hospitality
            establishments, enabling verification of conformity with defined sustainability criteria. The
            programme ensures that these establishments meet robust sustainability standards within the
            following <strong className="text-white">7 sections</strong>.
          </p>
        </Card>
      </FadeIn>

      {/* Quick nav cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { view: 'categories', icon: Layers, title: 'Category Definitions', desc: '6 establishment categories', iconColor: 'text-gk-blue dark:text-blue-400', bgColor: 'bg-gk-blue-light dark:bg-gk-blue/20' },
            { view: 'scope', icon: Target, title: 'Scope', desc: 'Included & excluded services', iconColor: 'text-gk-green dark:text-green-400', bgColor: 'bg-gk-green-light dark:bg-gk-green/20' },
            { view: 'glossary', icon: BookOpen, title: 'Glossary', desc: `${data.glossary.length} defined terms`, iconColor: 'text-gk-blue dark:text-blue-400', bgColor: 'bg-gk-blue-light dark:bg-gk-blue/20' },
            { view: null, icon: List, title: 'All 139 Criteria', desc: '79 Imperative · 60 Guideline', iconColor: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
          ].map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              onClick={() => item.view ? navigateTo(item.view) : navigateTo('criteria', null, null)}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <item.icon size={18} className={item.iconColor} />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-foreground">{item.title}</span>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* Applicable categories */}
      <FadeIn delay={0.15}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applicable Establishment Categories</CardTitle>
            <p className="text-sm text-muted-foreground">
              Green Key is applicable to the following specific types of establishments. <em className="text-muted-foreground">Hover over each code for a summary.</em>
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { code: 'HH', name: 'Hotels & Hostels' },
                { code: 'CHP', name: 'Campsites & Holiday Parks' },
                { code: 'SA', name: 'Small Accommodations' },
                { code: 'CC', name: 'Conference Centres' },
                { code: 'R', name: 'Restaurants / Cafés' },
                { code: 'A', name: 'Attractions' },
              ].map(cat => (
                <Tooltip key={cat.code} content={CATEGORY_TOOLTIPS[cat.code]} position="top">
                  <div className="bg-secondary rounded-lg p-3 border border-border block w-full">
                    <Badge variant="imperative" className="mb-1">
                      {cat.code}
                    </Badge>
                    <p className="text-sm font-semibold text-foreground">{cat.name}</p>
                  </div>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Imperative and Guideline criteria table */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Imperative and Guideline Criteria</CardTitle>
            <p className="text-sm text-muted-foreground">
              Criteria marked with <strong className="text-gk-blue">(I)</strong> are <strong>imperative</strong> criteria, while criteria marked with <strong className="text-gk-green-web">(G)</strong> are <strong>guideline</strong> criteria. The applicant must conform with all imperative criteria and an increasing number of
              applicable guideline criteria according to the number of years for which the certificate has
              been held, as per the following table:
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gk-blue text-white">
                    {certTable[0]?.map((header, i) => (
                      <th key={i} className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wide">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {certTable.slice(1).map((row, i) => (
                    <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/50'}`}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-3 text-sm ${j === 0 ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Criteria sections overview */}
      <FadeIn delay={0.25}>
        <div>
          <h2 className="text-lg font-black text-foreground mb-4">Criteria Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTION_CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.button
                  key={card.section}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => navigateTo('criteria', card.section)}
                  className={`flex items-center gap-3 border rounded-xl p-4 hover:shadow-sm transition-all text-left ${card.color} dark:bg-card dark:border-border`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/80 dark:bg-secondary flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold">{card.name}</span>
                    <p className="text-xs opacity-80">{card.count} criteria</p>
                  </div>
                  <ArrowRight size={16} className="opacity-60" />
                </motion.button>
              )
            })}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
