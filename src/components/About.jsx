// src/components/About.jsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import Crystal from '../three/Crystal'

const MaskText = ({ children, delay = 0 }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  </div>
)

export default function About() {
  return (
    <section id="about" className="relative py-60 px-8 bg-transparent overflow-hidden">
      {/* Structural Grid */}
      <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/5 pointer-events-none" />
      <div className="absolute right-1/4 top-0 bottom-0 w-px bg-white/5 pointer-events-none" />

      {/* Gradient fade-in dal nero dell'hero — transizione imperceptibile */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '220px', background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
      {/* Gradient fade-out in fondo per entrare nella Skills section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '320px', background: 'linear-gradient(to top, #080808 0%, #080808 15%, transparent 100%)' }} />

      <div className="max-w-[90vw] lg:max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Section Header */}
          <div className="lg:col-span-4">
            <div className="flex flex-col items-start gap-8">
              <span className="font-mono text-apple-blue text-[10px] tracking-[0.5em] uppercase">
                / PROFILE.BIO
              </span>
              <h2 className="font-display font-black text-6xl lg:text-8xl text-white tracking-tight leading-[0.85]">
                <MaskText>ABOUT</MaskText>
                <MaskText delay={0.1}>THE</MaskText>
                <MaskText delay={0.2}><span className="text-zinc-700">AGENT</span></MaskText>
              </h2>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-5 lg:pl-12 border-l border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.3, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <p className="text-zinc-400 text-2xl font-light leading-relaxed">
                Data Scientist student turning <span className="text-white">complexity into opportunity</span> through <span className="text-white italic">Generative AI</span> and advanced machine learning algorithms. 
              </p>
              
              <div className="space-y-6 text-zinc-500 text-sm leading-relaxed max-w-md">
                <p>
                  Currently working as a Data Science Intern in Gen AI at Leithà S.r.l. (Gruppo Unipol), building complex workflows, document ingestion pipelines, and agentic systems.
                </p>
                <p>
                  Completing a Master of Science in Data Science at the University of Padova (expected Q3 2026), bringing a strong learning mindset and curiosity to drive innovation.
                </p>
              </div>

              <div className="flex gap-12 pt-8">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Base</span>
                  <span className="text-white font-mono text-xs uppercase tracking-tighter">Milan / Padua, IT</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Status</span>
                  <span className="text-white font-mono text-xs uppercase tracking-tighter">Gen AI Intern</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Metadata / Details */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
              <div className="h-40 pointer-events-none grayscale opacity-50">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <Suspense fallback={null}>
                    <Crystal scale={1.2} secondary={true} />
                  </Suspense>
                </Canvas>
              </div>

              <div className="space-y-8">
                {[
                  { label: '01', category: 'INTERNSHIP', text: 'Gen AI @ Leithà S.r.l.' },
                  { label: '02', category: 'EDUCATION', text: 'MSc Data Science @ UniPD' },
                  { label: '03', category: 'EXPERTISE', text: 'LLMs & Agentic Workflows' },
                  { label: '04', category: 'LANGUAGE', text: 'English C1 / Italian Native' },
                ].map((badge, i) => (
                  <motion.div
                    key={badge.text}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.6 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-apple-blue text-[9px]">{badge.label}</span>
                      <span className="font-mono text-zinc-600 text-[9px] uppercase tracking-widest">{badge.category}</span>
                    </div>
                    <span className="text-xs font-medium text-zinc-300 tracking-tight">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
