import React from 'react'

const SECTION_NUMBERS = {
  'SUSTAINABLE MANAGEMENT': '1',
  'GUEST AWARENESS AND INVOLVEMENT': '2',
  'WATER': '3',
  'ENERGY AND CARBON': '4',
  'WASTE': '5',
  'PROCUREMENT': '6',
  'LIVING ENVIRONMENT': '7',
}

const SECTION_SHORT_NAMES = {
  'SUSTAINABLE MANAGEMENT': 'Sustainable Management',
  'GUEST AWARENESS AND INVOLVEMENT': 'Guest Awareness and Involvement',
  'WATER': 'Water',
  'ENERGY AND CARBON': 'Energy and Carbon',
  'WASTE': 'Waste',
  'PROCUREMENT': 'Procurement',
  'LIVING ENVIRONMENT': 'Living Environment',
}

function formatNotesForPrint(text) {
  if (!text) return null
  const paragraphs = text.split('\n').filter(p => p.trim())

  return paragraphs.map((para, idx) => {
    const trimmed = para.trim()

    if (/^(Relevance|Expectations for implementation|Audit evidence)$/i.test(trimmed)) {
      return (
        <p key={idx} className="print-note-heading">
          {trimmed}
        </p>
      )
    }
    if (/^ⓘ Note on national adaptation/.test(trimmed)) {
      return (
        <p key={idx} className="print-note-heading print-national">
          {trimmed}
        </p>
      )
    }
    if (/^[-–—•]/.test(trimmed)) {
      return (
        <p key={idx} className="print-note-bullet">
          • {trimmed.replace(/^[-–—•]\s*/, '')}
        </p>
      )
    }
    return (
      <p key={idx} className="print-note-para">
        {trimmed}
      </p>
    )
  })
}

export default function PrintView({ data }) {
  return (
    <div className="print-view">
      {/* Cover / Title */}
      <div className="print-cover">
        <img src="/green-key-logo.jpg" alt="Green Key" className="print-logo" />
        <h1>Green Key Criteria &amp; Explanatory Notes</h1>
        <p className="print-subtitle">1 October 2026 – 31 December 2031</p>
        <p className="print-org">Foundation for Environmental Education (FEE)</p>
      </div>

      {/* Table of Contents */}
      <div className="print-section print-toc">
        <h2>Table of Contents</h2>
        <ul>
          <li>Category Definitions</li>
          <li>Scope</li>
          <li>Imperative and Guideline Criteria</li>
          {data.criteria.sections.map(section => {
            const num = SECTION_NUMBERS[section.name]
            const name = SECTION_SHORT_NAMES[section.name] || section.name
            const count = section.subsections.reduce((a, ss) => a + ss.criteria.length, 0)
            return (
              <li key={section.name}>
                <strong>Section {num}:</strong> {name} <span className="print-toc-count">({count} criteria)</span>
              </li>
            )
          })}
          <li>Glossary ({data.glossary.length} terms)</li>
        </ul>
      </div>

      {/* Category Definitions */}
      <div className="print-section">
        <h2>Category Definitions</h2>
        {data.categories.introduction.map((para, i) => (
          <p key={i} className="print-para">{para}</p>
        ))}
        {data.categories.categories.map((cat, i) => (
          <div key={i} className="print-category">
            <h3>{cat.code}</h3>
            {cat.definition.split('\n').map((p, j) => (
              <p key={j} className="print-para">{p}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Scope */}
      <div className="print-section">
        <h2>Scope</h2>
        {data.scope.map((section, i) => (
          <div key={i} className="print-scope-block">
            <h3>{section.heading}</h3>
            {section.content.map((para, j) => (
              <p key={j} className="print-para">{para}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Certification Table */}
      <div className="print-section">
        <h2>Imperative and Guideline Criteria</h2>
        <p className="print-para">
          Criteria marked with (I) are imperative criteria, while criteria marked with (G) are guideline
          criteria. The applicant must conform with all imperative criteria and an increasing number of
          applicable guideline criteria according to the number of years for which the certificate has
          been held, as per the following table:
        </p>
        <table className="print-table">
          <thead>
            <tr>
              {data.criteria.certification_table[0]?.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.criteria.certification_table.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Criteria Sections */}
      {data.criteria.sections.map(section => {
        const num = SECTION_NUMBERS[section.name]
        const name = SECTION_SHORT_NAMES[section.name] || section.name

        return (
          <div key={section.name} className="print-section">
            <h2>Section {num}: {name}</h2>
            {section.subsections.map(subsection => (
              <div key={subsection.name} className="print-subsection">
                <h3>{subsection.name}</h3>
                {subsection.criteria.map(criterion => (
                  <div key={criterion.number} className="print-criterion">
                    <div className="print-criterion-header">
                      <span className="print-criterion-number">{criterion.number}</span>
                      <span className="print-criterion-statement">{criterion.statement}</span>
                    </div>
                    <div className="print-criterion-meta">
                      <span className={`print-badge ${criterion.type === 'imperative' ? 'print-badge-i' : 'print-badge-g'}`}>
                        {criterion.type === 'imperative' ? 'Imperative' : 'Guideline'}
                      </span>
                      <span className="print-categories">
                        Categories: {criterion.categories.join(', ')}
                      </span>
                      {criterion.has_national_note && (
                        <span className="print-national-flag">ⓘ National adaptation</span>
                      )}
                    </div>
                    {criterion.explanatory_notes && (
                      <div className="print-notes">
                        {formatNotesForPrint(criterion.explanatory_notes)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}

      {/* Glossary */}
      <div className="print-section">
        <h2>Glossary</h2>
        {data.glossary.map((term, i) => (
          <div key={i} className="print-glossary-term">
            <h4>{term.term}</h4>
            {term.definition.split('\n').map((para, j) => (
              <p key={j} className="print-para">{para}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="print-footer">
        <p>Green Key Criteria and Explanatory Notes — 1 October 2026 – 31 December 2031</p>
        <p>© Foundation for Environmental Education (FEE). All rights reserved.</p>
      </div>
    </div>
  )
}
