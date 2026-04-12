// src/components/Contact.jsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import Crystal from '../three/Crystal'

const CONTACT_LINKS = [
  { icon: '✉', label: 'ricky.agosti@gmail.com', href: 'mailto:ricky.agosti@gmail.com' },
  { icon: '📱', label: '+39 3349889929', href: 'tel:+393349889929' },
  { icon: 'in', label: 'LinkedIn', href: 'https://linkedin.com/in/riccardo-niccolo-agosti' },
  { icon: '⌥', label: 'github.com/ricca200xx', href: 'https://github.com/ricca200xx' },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{ background: '#0d0d0d', padding: '140px 0 80px' }}
    >
      {/* Cristallo decorativo sullo sfondo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Crystal scale={1.8} secondary={true} />
          </Suspense>
        </Canvas>
      </div>

      <div
        className="relative mx-auto text-center"
        style={{ maxWidth: '800px', padding: '0 2rem', zIndex: 1 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}
        >
          Let&apos;s connect
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            marginBottom: '3rem',
          }}
        >
          Aperto a opportunità in AI, Data Science, Cybersecurity
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '9999px',
                padding: '12px 22px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div
        className="relative text-center"
        style={{ marginTop: '80px', zIndex: 1 }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          © 2026 Riccardo Niccolò Agosti · Built with React &amp; Three.js
        </p>
      </div>
    </section>
  )
}
