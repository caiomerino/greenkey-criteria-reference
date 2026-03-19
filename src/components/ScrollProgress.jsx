import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress({ containerRef }) {
  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, hsl(170 80% 38%), hsl(100 59% 44%))',
      }}
    />
  )
}
