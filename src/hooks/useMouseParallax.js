// src/hooks/useMouseParallax.js
import { useState, useEffect, useRef } from 'react'

export function useMouseParallax(strength = 0.15, lerpFactor = 0.05) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafId = useRef()

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const handleMouseMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2 * strength
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2 * strength
    }

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * lerpFactor
      current.current.y += (target.current.y - current.current.y) * lerpFactor
      setOffset({ x: current.current.x, y: current.current.y })
      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [strength, lerpFactor])

  return offset
}
