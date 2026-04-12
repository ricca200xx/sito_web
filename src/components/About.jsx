// src/components/About.jsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import Crystal from '../three/Crystal'

const BADGES = [
  { icon: '🎓', text: 'MSc Data Science — Università di Padova' },
  { icon: '🎓', text: 'BSc Statistics — Università di Firenze · 94/110' },
  { icon: '🌍', text: 'English C1 · Italian Native' },
]

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
}

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
}

export default function About() {
  return (
    <section
      id="about"
      className="relative"
      style={{
        background: 'var(--bg-primary)',
        padding: '120px 0',
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: '1100px', padding: '0 2rem' }}
      >
        <div
          style={{
            display: 'flex',
            gap: '4rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Colonna sinistra: testo */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ flex: '1 1 55%', minWidth: '280px' }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              — Chi sono
            </p>
            <h2
              className="font-display font-bold mb-6"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Trasformo dati complessi<br />in insight azionabili
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                maxWidth: '520px',
              }}
            >
              Sono uno studente magistrale in Data Science all&apos;Università di Padova,
              appassionato di AI e Machine Learning. Ho un solido background statistico
              e un&apos;esperienza pratica in Deep Learning — Computer Vision, NLP, Time Series
              e Multimodal Learning. Mi entusiasmano le sfide in ambienti ad alta
              tecnologia come Cybersecurity e Defense, dove i dati possono fare la
              differenza nelle decisioni critiche.
            </p>
          </motion.div>

          {/* Colonna destra: cristallo + badge */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              flex: '1 1 35%',
              minWidth: '260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Mini cristallo */}
            <div style={{ width: '180px', height: '180px' }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <Crystal scale={0.7} secondary={true} />
                </Suspense>
              </Canvas>
            </div>

            {/* Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              {BADGES.map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.4, duration: 0.5 }}
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{badge.icon}</span>
                  {badge.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
