// src/components/Hero.jsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScroll, useTransform, motion } from 'framer-motion'
import Crystal from '../three/Crystal'

function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />
  )
}

export default function Hero() {
  const { scrollYProgress } = useScroll()
  const crystalOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const crystalScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.3])

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '100vh', background: 'var(--bg-primary)' }}
    >
      <NoiseOverlay />

      {/* Canvas 3D */}
      <motion.div
        style={{ opacity: crystalOpacity, scale: crystalScale }}
        className="absolute inset-0 z-0"
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Crystal />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Testo hero */}
      <div className="relative z-10 text-center px-6 pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          Riccardo Niccolò Agosti
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            color: 'var(--text-secondary)',
            marginTop: '1rem',
          }}
        >
          Data Scientist &amp; AI Engineer
        </motion.p>

        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block mt-8 pointer-events-auto"
          style={{
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            padding: '12px 28px',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            transition: 'background 0.2s, color 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--accent)'
          }}
        >
          Scopri il mio lavoro ↓
        </motion.a>
      </div>
    </section>
  )
}
