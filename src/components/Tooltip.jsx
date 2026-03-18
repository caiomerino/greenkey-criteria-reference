import React, { useState, useRef, useEffect } from 'react'

export default function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const padding = 8

      let top, left

      if (position === 'top') {
        top = triggerRect.top - tooltipRect.height - padding
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
      } else if (position === 'bottom') {
        top = triggerRect.bottom + padding
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
      }

      // Clamp to viewport
      if (left < 8) left = 8
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8
      }
      if (top < 8) {
        top = triggerRect.bottom + padding
      }

      setCoords({ top, left })
    }
  }, [visible, position])

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0}
        className="cursor-help"
      >
        {children}
      </span>
      {visible && (
        <div
          ref={tooltipRef}
          className="tooltip-bubble"
          style={{ top: coords.top, left: coords.left }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  )
}
