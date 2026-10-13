'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type RevealDirection = 'up' | 'left' | 'right' | 'mask'

interface SectionRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: RevealDirection
}

export function SectionReveal({ children, className = '', delay = 0, direction = 'up' }: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const offset = prefersReducedMotion ? 0 : 24
  const initial = {
    opacity: prefersReducedMotion ? 1 : 0,
    x: prefersReducedMotion || direction === 'mask' ? 0 : direction === 'left' ? -offset : direction === 'right' ? offset : 0,
    y: prefersReducedMotion || direction !== 'up' ? 0 : offset,
    clipPath: prefersReducedMotion || direction !== 'mask' ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
  }
  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
  }

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const element = elementRef.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const isInViewport = () => {
      const rect = element.getBoundingClientRect()
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      return visibleHeight > 0 && visibleHeight / rect.height >= 0.12
    }

    if (isInViewport()) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <motion.div
      ref={elementRef}
      className={`section-reveal section-reveal--${direction} ${className}`}
      initial={initial}
      animate={isVisible ? visible : initial}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.78,
        delay: prefersReducedMotion ? 0 : delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
