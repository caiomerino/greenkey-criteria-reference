# Green Key Redesign Spec — shadcn/ui + Motion

## CRITICAL RULES
- You are NOT allowed to change any wording. Only visual/UX/UI.
- The only text change allowed: correct anything to UK English spellings.
- ALL content must be featured in full — no omissions or selective deletion.
- Footer must say "Created by Caio Merino"

## Brand
- Logo colours: Blue #0066CC, Green #009933
- Web colours: #51AE32 (green), #15AF97 (teal)
- Font: Lato (Google Font)
- Dark mode: bg #0F172A, surface #1E293B, border #334155, text #E2E8F0, muted #94A3B8

## Installed Dependencies
- @radix-ui/react-accordion, react-collapsible, react-dialog, react-tooltip, react-switch, react-scroll-area, react-separator, react-slot, react-visually-hidden
- class-variance-authority, clsx, tailwind-merge
- framer-motion
- tailwindcss-animate (dev)
- lucide-react (already installed)

## Architecture
- React 18 + Vite 6 + Tailwind CSS 3
- Hash routing: #criteria/SECTION_NAME, #criterion/4.1, #glossary/termName, #all-criteria
- Dark mode: class-based, persisted in localStorage, key 'gk-dark-mode'
- Data: src/data.json (139 criteria, 39 glossary terms, 6 categories, 7 sections, 3 scope sections)

## File Structure After Redesign
```
src/
  lib/
    utils.js          — cn() helper (clsx + tailwind-merge)
  components/
    ui/
      accordion.jsx   — Radix Accordion with spring animation
      badge.jsx       — CVA badge variants
      button.jsx      — CVA button variants
      card.jsx        — Card, CardHeader, CardContent, CardFooter
      tooltip.jsx     — Radix Tooltip
      dialog.jsx      — Radix Dialog
      switch.jsx      — Radix Switch for dark mode
      separator.jsx   — Radix Separator
      scroll-area.jsx — Radix ScrollArea
    Sidebar.jsx       — Redesigned sidebar
    Header.jsx        — Redesigned header with scroll progress
    CriterionCard.jsx — Redesigned with Radix Accordion + Motion
    ShareButton.jsx   — Keep as-is (already works)
    ScrollProgress.jsx — New: thin scroll progress bar
    FadeIn.jsx        — New: Motion wrapper for fade-in-on-scroll
  views/
    IntroductionView.jsx — Redesigned
    CriteriaView.jsx     — Redesigned with staggered animations
    CategoriesView.jsx   — Redesigned
    ScopeView.jsx        — Redesigned
    GlossaryView.jsx     — Redesigned
    PrintView.jsx        — Keep as-is (print-specific, no visual change needed)
  App.jsx               — Updated to use new components
  index.css             — Updated with shadcn-style CSS variables
  data.json             — UNCHANGED
  main.jsx              — UNCHANGED
```

## Design Direction

### shadcn/ui Style
- Rounded-lg borders, soft shadows, precise spacing
- Card components: `rounded-xl border bg-white dark:bg-slate-900 shadow-sm`
- Button variants: default (filled teal), outline, ghost
- Badge variants: imperative (blue), guideline (green), category (ghost)
- Consistent 8px-based spacing rhythm
- Focus rings: `ring-2 ring-ring ring-offset-2`

### Motion Animations
1. **Scroll Progress Bar** — thin teal gradient bar at viewport top tracking scroll
2. **Spring Accordions** — criteria expand/collapse with spring easing
3. **Staggered List Entry** — when section opens, items cascade in (50ms delay)
4. **Fade-in on Scroll** — sections fade up as they enter viewport
5. **Smooth Layout** — sidebar and content transitions
6. **Hover micro-interactions** — cards lift slightly, nav items shift

### CSS Variable System (shadcn-compatible)
```css
:root {
  --background: 210 20% 98%;
  --foreground: 215 25% 15%;
  --card: 0 0% 100%;
  --card-foreground: 215 25% 15%;
  --primary: 170 80% 38%;     /* teal #15AF97 */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 20% 96%;
  --secondary-foreground: 215 25% 15%;
  --muted: 210 20% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 100 59% 44%;       /* green #51AE32 */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 170 80% 38%;
  --radius: 0.75rem;
  /* Brand-specific */
  --gk-blue: 211 100% 40%;    /* #0066CC */
  --gk-green: 100 59% 44%;    /* #51AE32 */
  --gk-teal: 170 80% 38%;     /* #15AF97 */
}

.dark {
  --background: 222 47% 11%;
  --foreground: 214 32% 91%;
  --card: 217 33% 17%;
  --card-foreground: 214 32% 91%;
  --primary: 170 80% 38%;
  --primary-foreground: 0 0% 100%;
  --secondary: 217 33% 17%;
  --secondary-foreground: 214 32% 91%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --accent: 100 59% 44%;
  --accent-foreground: 0 0% 100%;
  --border: 217 24% 27%;
  --input: 217 24% 27%;
  --ring: 170 80% 38%;
}
```

## Key Interactions to Preserve
1. Hash routing (all deep links must work)
2. Search filtering (criteria + glossary)
3. Category filter badges
4. Type filter (imperative/guideline)
5. Expand/Collapse All
6. Dark mode toggle with localStorage persistence
7. Print view
8. Google Translate widget
9. Share button
10. Cross-reference links (criterion 1.2 → clickable)
11. Tooltip on category badges
12. Deep linking to specific criterion (#criterion/4.1)
13. Highlight criterion when deep-linked
14. Glossary term deep linking

## What Makes This 10x Better
1. Radix Accordion instead of manual expand/collapse — accessible, keyboard-nav, animated
2. Spring physics animations on all interactive elements
3. Scroll progress indicator
4. Staggered content reveals create visual rhythm
5. Command palette (⌘K) for instant criterion search
6. Consistent component system — every card, badge, button follows the same tokens
7. Better information density — more whitespace, better typography hierarchy
8. Smoother transitions everywhere — 180ms cubic-bezier for interactions
9. Focus states for keyboard navigation
10. Better mobile experience with slide-in sheet instead of basic drawer
