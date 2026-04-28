/* Applies the three data fixes to data.json:
   1. Restructure 8 dual-type criteria
   2. Split out two glossary terms merged into Certification Process Manual
   3. Add (I/G) marker to criterion 2.9 statement
*/
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.resolve(__dirname, '../src/data.json')

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

// ── Fix 1: dual-type split for 8 criteria ──────────────────────────────────
const DUAL_SPLIT = {
  '1.10': { imperative: ['HH', 'CHP', 'CC', 'A'], guideline: ['SA', 'R'] },
  '1.11': { imperative: ['HH', 'CC', 'A'],        guideline: ['SA', 'CHP', 'R'] },
  '2.8':  { imperative: ['HH', 'CHP', 'SA', 'A'], guideline: ['CC', 'R'] },
  '2.9':  { imperative: ['HH', 'CHP', 'SA', 'A'], guideline: ['CC', 'R'] },
  '4.16': { imperative: ['HH', 'CHP', 'SA'],      guideline: ['CC', 'A', 'R'] },
  '4.27': { imperative: ['HH', 'CHP', 'CC', 'A'], guideline: ['SA', 'R'] },
  '5.6':  { imperative: ['HH', 'CHP', 'CC', 'R', 'A'], guideline: ['SA'] },
  '6.5':  { imperative: ['HH'],                   guideline: ['CHP', 'SA', 'CC', 'R'] },
}

let dualPatched = 0
let stmtPatched = 0
for (const section of data.criteria.sections) {
  for (const sub of section.subsections) {
    for (const c of sub.criteria) {
      if (DUAL_SPLIT[c.number]) {
        const split = DUAL_SPLIT[c.number]
        c.type = 'dual'
        c.imperative_categories = split.imperative
        c.guideline_categories = split.guideline
        // Verify categories union matches existing categories
        const union = [...new Set([...split.imperative, ...split.guideline])].sort()
        const existing = [...c.categories].sort()
        if (JSON.stringify(union) !== JSON.stringify(existing)) {
          console.warn(`⚠️ ${c.number}: categories union ${union} differs from existing ${existing}`)
        }
        dualPatched++
      }
      // Fix 3: add (I/G) to 2.9 statement if missing
      if (c.number === '2.9' && !c.statement.includes('(I/G)')) {
        c.statement = c.statement.replace(/\.\s*$/, '. (I/G)')
        stmtPatched++
      }
    }
  }
}

// ── Fix 2: split glossary entries ──────────────────────────────────────────
// Find Certification Process Manual and split its definition.
let glossPatched = 0
const cpmIdx = data.glossary.findIndex(g => g.term === 'Certification Process Manual')
if (cpmIdx >= 0) {
  const def = data.glossary[cpmIdx].definition
  // Split on the embedded "Coffee station:" and "Communication materials:" markers
  const coffeeMatch = def.match(/^([\s\S]*?)\s*Coffee station:\s*([\s\S]*?)\s*Communication materials:\s*([\s\S]*)$/)
  if (coffeeMatch) {
    const cleanCpmDef = coffeeMatch[1].trim()
    const coffeeDef = coffeeMatch[2].trim()
    const commsDef = coffeeMatch[3].trim()
    data.glossary[cpmIdx].definition = cleanCpmDef
    // Insert in alphabetical-ish order (matches official PDF ordering)
    // Order in PDF: Areas, CPM, Coffee station, Communication materials, Data storage, ...
    data.glossary.splice(cpmIdx + 1, 0,
      { term: 'Coffee station',         definition: coffeeDef },
      { term: 'Communication materials', definition: commsDef },
    )
    glossPatched = 2
  } else {
    console.warn('⚠️ Could not find embedded Coffee station / Communication materials in CPM def')
  }
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n')

console.log(`✅ Applied fixes:`)
console.log(`   - ${dualPatched}/8 dual-type criteria patched`)
console.log(`   - ${stmtPatched} statement(s) patched (criterion 2.9 marker)`)
console.log(`   - ${glossPatched} new glossary terms added`)
console.log(`   - Total glossary terms now: ${data.glossary.length}`)
