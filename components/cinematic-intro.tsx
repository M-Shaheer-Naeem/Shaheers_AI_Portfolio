'use client'

import { useEffect, useState } from 'react'

export function CinematicIntro() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setVisible(false)
      return
    }
    const startedAt = performance.now()
    const duration = 1150
    let frame = 0
    let exitTimer: number | undefined
    const tick = (now: number) => {
      const elapsed = now - startedAt
      setProgress(Math.min(96, Math.round((elapsed / duration) * 96)))
      if (elapsed < duration) frame = requestAnimationFrame(tick)
      else {
        setProgress(100)
        setExiting(true)
        exitTimer = window.setTimeout(() => setVisible(false), 650)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      if (exitTimer) window.clearTimeout(exitTimer)
    }
  }, [])

  if (!visible) return null
  return <div className={`intro-screen ${exiting ? 'intro-screen--exit' : ''}`} aria-label="Loading Shaheer Naeem portfolio" role="status">
    <div className="intro-screen__grain" aria-hidden="true" />
    <div className="intro-screen__content">
      <p className="intro-screen__eyebrow">Independent developer / 2026</p>
      <h1 className="intro-screen__name">Shaheer Naeem</h1>
      <div className="intro-screen__meta"><span>Selected work</span><span>{progress}%</span></div>
      <div className="intro-screen__track" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
    </div>
  </div>
}
