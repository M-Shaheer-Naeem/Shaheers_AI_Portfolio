'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export function CustomCursor() {
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const ringScaleValue = useMotionValue(1)
  const ringOpacityValue = useMotionValue(0)
  const springX = useSpring(pointerX, { damping: 28, stiffness: 240, mass: 0.45 })
  const springY = useSpring(pointerY, { damping: 28, stiffness: 240, mass: 0.45 })
  const springScale = useSpring(ringScaleValue, { damping: 22, stiffness: 260 })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!finePointer.matches) return

    document.documentElement.dataset.customCursor = 'true'

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
      ringOpacityValue.set(1)
    }

    const handlePointerOver = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return
      const interactive = event.target.closest(
        'a, button, input, textarea, select, label, [role="button"], .project-card',
      )
      ringScaleValue.set(interactive ? 1.65 : 1)
    }

    const handlePointerLeave = () => ringOpacityValue.set(0)
    const handlePointerEnter = () => ringOpacityValue.set(1)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    document.documentElement.addEventListener('pointerenter', handlePointerEnter)

    return () => {
      delete document.documentElement.dataset.customCursor
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      document.documentElement.removeEventListener('pointerenter', handlePointerEnter)
    }
  }, [pointerX, pointerY, ringOpacityValue, ringScaleValue])

  return (
    <div className="custom-cursor" aria-hidden="true">
      <motion.span
        className="custom-cursor__ring"
        style={{
          x: prefersReducedMotion ? pointerX : springX,
          y: prefersReducedMotion ? pointerY : springY,
          scale: prefersReducedMotion ? ringScaleValue : springScale,
          opacity: ringOpacityValue,
        }}
      />
      <motion.span
        className="custom-cursor__dot"
        style={{ x: pointerX, y: pointerY, opacity: ringOpacityValue }}
      />
    </div>
  )
}
