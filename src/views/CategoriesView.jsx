import React from 'react'
import { Building2, Tent, Home, Presentation, UtensilsCrossed, Camera } from 'lucide-react'

const CATEGORY_ICONS = {
  'Hotels and Hostels (HH)': Building2,
  'Campsite and Holiday Parks (CHP)': Tent,
  'Small Accommodations (SA)': Home,
  'Conference Centres (CC)': Presentation,
  'Restaurants/Cafés (R)': UtensilsCrossed,
  'Attractions (A)': Camera,
}

const CATEGORY_COLORS = {
  'Hotels and Hostels (HH)': 'border-blue-200 bg-blue-50',
  'Campsite and Holiday Parks (CHP)': 'border-green-200 bg-green-50',
  'Small Accommodations (SA)': 'border-violet-200 bg-violet-50',
  'Conference Centres (CC)': 'border-amber-200 bg-amber-50',
  'Restaurants/Cafés (R)': 'border-orange-200 bg-orange-50',
  'Attractions (A)': 'border-cyan-200 bg-cyan-50',
}

export default function CategoriesView({ data }) {
  const { introduction, categories } = data.categories

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gk-border p-6">
        <h1 className="text-2xl font-black text-gk-text mb-3">Category Definitions</h1>
        <div className="space-y-2">
          {introduction.map((para, i) => (
            <p key={i} className="text-sm text-gk-text leading-relaxed">{para}</p>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div className="space-y-4">
        {categories.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.code] || Building2
          const colorClass = CATEGORY_COLORS[cat.code] || 'border-gk-border bg-white'
          
          return (
            <div key={i} className={`rounded-xl border-2 overflow-hidden ${colorClass}`}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Icon size={20} className="text-gk-blue" />
                  </div>
                  <h2 className="text-lg font-black text-gk-text">{cat.code}</h2>
                </div>
                <div className="bg-white rounded-lg p-4 border border-white/50">
                  {cat.definition.split('\n').map((para, j) => (
                    <p key={j} className="text-sm text-gk-text leading-relaxed mb-2 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
