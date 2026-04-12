// src/hooks/useMouseParallax.js
import { useState, useEffect } from 'react'

export function useMouseParallax(strength = 0.15) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2 * strength
      const y = (e.clientY / window.innerHeight - 0.5) * 2 * strength
      setOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength])

  return offset
}
