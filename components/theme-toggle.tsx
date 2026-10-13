'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = (mounted ? resolvedTheme : 'dark') === 'dark'

  useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="theme-toggle grid size-12 place-items-center rounded-xl border border-border bg-card/90 text-accent shadow-lg backdrop-blur transition-all hover:border-accent/50 hover:shadow-[0_0_24px_color-mix(in_oklch,var(--accent)_22%,transparent)]"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'dark' : 'light'}
            initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 35, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            className="grid place-items-center"
          >
            {isDark ? (
              <Sun aria-hidden="true" className="size-5" />
            ) : (
              <Moon aria-hidden="true" className="size-5" />
            )}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  )
}
