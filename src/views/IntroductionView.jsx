import React from 'react'
import {
  Shield, Users, Droplets, Zap, Trash2, ShoppingBag, TreePine,
  ArrowRight, CheckCircle2, BookOpen, Target, Layers, List
} from 'lucide-react'
import Tooltip from '../components/Tooltip'

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
      <div className="bg-gradient-to-br from-gk-blue to-gk-blue-dark rounded-2xl p-8 sm:p-10 text-white">
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
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigateTo('categories')}
          className="flex items-center gap-3 bg-white border border-gk-border rounded-xl p-4 hover:border-gk-blue hover:shadow-sm transition-all text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-gk-blue-light flex items-center justify-center">
            <Layers size={18} className="text-gk-blue" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-gk-text">Category Definitions</span>
            <p className="text-xs text-gk-text-muted">6 establishment categories</p>
          </div>
          <ArrowRight size={16} className="text-gk-text-muted" />
        </button>

        <button
          onClick={() => navigateTo('scope')}
          className="flex items-center gap-3 bg-white border border-gk-border rounded-xl p-4 hover:border-gk-blue hover:shadow-sm transition-all text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-gk-green-light flex items-center justify-center">
            <Target size={18} className="text-gk-green" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-gk-text">Scope</span>
            <p className="text-xs text-gk-text-muted">Included & excluded services</p>
          </div>
          <ArrowRight size={16} className="text-gk-text-muted" />
        </button>

        <button
          onClick={() => navigateTo('glossary')}
          className="flex items-center gap-3 bg-white border border-gk-border rounded-xl p-4 hover:border-gk-blue hover:shadow-sm transition-all text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-gk-blue-light flex items-center justify-center">
            <BookOpen size={18} className="text-gk-blue" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-gk-text">Glossary</span>
            <p className="text-xs text-gk-text-muted">{data.glossary.length} defined terms</p>
          </div>
          <ArrowRight size={16} className="text-gk-text-muted" />
        </button>

        <button
          onClick={() => navigateTo('criteria', null, null)}
          className="flex items-center gap-3 bg-white border border-gk-border rounded-xl p-4 hover:border-gk-blue hover:shadow-sm transition-all text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <List size={18} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-gk-text">All 139 Criteria</span>
            <p className="text-xs text-gk-text-muted">79 Imperative · 60 Guideline</p>
          </div>
          <ArrowRight size={16} className="text-gk-text-muted" />
        </button>
      </div>

      {/* Applicable categories */}
      <div className="bg-white rounded-xl border border-gk-border p-6">
        <h2 className="text-lg font-black text-gk-text mb-1">Applicable Establishment Categories</h2>
        <p className="text-sm text-gk-text-muted mb-4">
          Green Key is applicable to the following specific types of establishments. <em className="text-gk-text-muted">Hover over each code for a summary.</em>
        </p>
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
              <div className="bg-gk-surface rounded-lg p-3 border border-gk-border block w-full">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-gk-blue text-white mb-1">
                  {cat.code}
                </span>
                <p className="text-sm font-semibold text-gk-text">{cat.name}</p>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Imperative and Guideline criteria table */}
      <div className="bg-white rounded-xl border border-gk-border p-6">
        <h2 className="text-lg font-black text-gk-text mb-1">Imperative and Guideline Criteria</h2>
        <p className="text-sm text-gk-text-muted mb-4">
          Criteria marked with <strong className="text-gk-blue">(I)</strong> are <strong>imperative</strong> criteria, while criteria marked with <strong className="text-gk-green-web">(G)</strong> are <strong>guideline</strong> criteria. The applicant must conform with all imperative criteria and an increasing number of
          applicable guideline criteria according to the number of years for which the certificate has
          been held, as per the following table:
        </p>
        <div className="overflow-x-auto">
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
                <tr key={i} className={`border-b border-gk-border ${i % 2 === 0 ? 'bg-white' : 'bg-gk-surface'}`}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-3 text-sm ${j === 0 ? 'font-semibold text-gk-text' : 'text-gk-text'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Criteria sections overview */}
      <div>
        <h2 className="text-lg font-black text-gk-text mb-4">Criteria Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECTION_CARDS.map(card => {
            const Icon = card.icon
            return (
              <button
                key={card.section}
                onClick={() => navigateTo('criteria', card.section)}
                className={`flex items-center gap-3 border rounded-xl p-4 hover:shadow-sm transition-all text-left ${card.color}`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold">{card.name}</span>
                  <p className="text-xs opacity-80">{card.count} criteria</p>
                </div>
                <ArrowRight size={16} className="opacity-60" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
