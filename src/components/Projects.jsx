// src/components/Projects.jsx
import { useRef, useEffect, Suspense } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, MeshTransmissionMaterial } from '@react-three/drei'
import { GoogleGeminiEffect } from './ui/GoogleGeminiEffect'

/* ═══════════════════════════════════════════════════════════
   Projects — sticky scroll, visibilità binaria come ScrollHero

   Timing su 500vh (totalH = 400vh):
   ─ 0.00 → 0.12   Intro "SELECTED WORKS"
   ─ 0.12 → 0.32   Project 01
   ─ 0.32 → 0.52   Project 02
   ─ 0.52 → 0.72   Project 03
   ─ 0.72 → 0.92   Project 04
   ─ 0.92 → 1.00   Exit overlay
═══════════════════════════════════════════════════════════ */

const lerp = (a, b, t) => a + (b - a) * t

function mapKeys(p, inputs, outputs) {
  for (let i = 0; i < inputs.length - 1; i++) {
    if (p <= inputs[i + 1]) {
      const t = (p - inputs[i]) / (inputs[i + 1] - inputs[i])
      return lerp(outputs[i], outputs[i + 1], Math.max(0, Math.min(1, t)))
    }
  }
  return outputs[outputs.length - 1]
}

const PROJECTS = [
  {
    id: 'p1',
    number: '01',
    category: 'Computer Vision',
    title: 'Pokémon Detection',
    subtitle: 'Model Comparison Study',
    tags: ['YOLOv11s', 'RT-DETR', 'Faster R-CNN', 'PyTorch'],
    description:
      'Compared YOLOv11s, RT-DETR and Faster R-CNN on a balanced 9-class Pokémon dataset. Each model evaluated on mAP, precision, recall and inference latency — revealing concrete trade-offs between detection speed and localization accuracy for real-time scenarios.',
    metric: '3 Models',
    metricLabel: 'Benchmarked',
    url: 'https://github.com/ricca200xx/Pokemon-Detection-Model-Comparison',
  },
  {
    id: 'p2',
    number: '02',
    category: 'Deep Learning',
    title: 'Custom CNN',
    subtitle: 'Image Classification Pipeline',
    tags: ['PyTorch', 'CNN', 'Image Recognition'],
    description:
      'Designed and trained a CNN from scratch in PyTorch — no pretrained weights — to classify images across 20 categories. Full pipeline: data augmentation, architecture design, training loop and evaluation. Reached 87% top-1 accuracy through iterative tuning.',
    metric: '87%',
    metricLabel: 'Accuracy — 20 Classes',
    url: 'https://github.com/ricca200xx/Scratch-CNN-Image-Recognition',
  },
  {
    id: 'p3',
    number: '03',
    category: 'Time Series',
    title: 'Weather Forecasting',
    subtitle: 'Seq2Seq GRU Architecture',
    tags: ['PyTorch', 'Seq2Seq', 'GRU', 'Scikit-learn'],
    description:
      'Multivariate forecasting model built with a Seq2Seq + GRU architecture. Takes 90 historical timesteps across 76 meteorological variables and predicts 30 steps ahead simultaneously — capturing cross-variable temporal dependencies that single-output models miss.',
    metric: '76',
    metricLabel: 'Variables Predicted',
    url: 'https://github.com/ricca200xx/Weather-Time-Series-Forecasting-with-Seq2Seq-GRU',
  },
  {
    id: 'p4',
    number: '04',
    category: 'Combinatorial Optimization',
    title: 'Maximum Clique',
    subtitle: 'Continuous Optimization Approach',
    tags: ['Python', 'Gradient Descent', 'Frank-Wolfe'],
    description:
      'Tackled the NP-hard Maximum Clique Problem by recasting it as a continuous quadratic program via the Motzkin-Straus theorem. Implemented and benchmarked Projected Gradient Descent vs Frank-Wolfe on standard DIMACS graphs — achieving up to 30% faster convergence.',
    metric: '−30%',
    metricLabel: 'Execution Time on DIMACS',
    url: 'https://github.com/ricca200xx/Find-a-maximal-clique-with-optimization-algorithm',
  },
]

/* ── 3D shape pilotata dallo scroll ─────────────────────── */
function ProjectShape({ progressRef }) {
  const meshRef = useRef()

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const p = progressRef.current
    mesh.rotation.y  = p * Math.PI * 4
    mesh.rotation.x  = Math.sin(p * Math.PI * 2.5) * 0.6
    mesh.position.x  = Math.sin(p * Math.PI * 2)   * 1.8
    mesh.position.y  = Math.cos(p * Math.PI * 1.5) * 0.6
    mesh.scale.setScalar(mapKeys(p,
      [0, 0.08, 0.92, 1.0],
      [0.1, 0.8, 0.8, 0.1]
    ))
  })

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]}  intensity={1.0} color="#ffffff" />
      <directionalLight position={[-5, -3, 2]} intensity={0.4} color="#2997ff" />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.05}
          thickness={0.8}
          ior={1.5}
          chromaticAberration={0.07}
          color="#ffffff"
          backside
          backsideThickness={0.4}
          envMapIntensity={1.8}
        />
      </mesh>
    </>
  )
}

/* ── Componente principale ──────────────────────────────── */
export default function Projects() {
  const sectionRef     = useRef(null)

  /* framer-motion scroll per Gemini paths */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const p0 = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  const p1 = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  const p2 = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2])
  const p3 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2])
  const p4 = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])
  const progressRef    = useRef(0)
  const headerRef      = useRef(null)
  const exitRef        = useRef(null)
  const progressBarRef = useRef(null)
  const counterRef     = useRef(null)   // "01 / 04" persistente
  const sectionLabelRef = useRef(null)  // "PROJECTS" persistente
  const projectRefs    = useRef(PROJECTS.map(() => null))
  const dotRefs        = useRef(PROJECTS.map(() => null))

  useEffect(() => {
    const N          = PROJECTS.length
    const INTRO_END  = 0.12
    const EXIT_START = 0.92
    const PROJ_RANGE = EXIT_START - INTRO_END   // 0.80
    const PROJ_SIZE  = PROJ_RANGE / N           // 0.20 ciascuno

    const update = () => {
      const el = sectionRef.current
      if (!el) return
      const rect   = el.getBoundingClientRect()
      const totalH = el.offsetHeight - window.innerHeight
      const p      = Math.min(Math.max(-rect.top / totalH, 0), 1)
      progressRef.current = p

      // Barra progresso
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`
      }

      // Intro header — same pattern as ScrollHero labels (binary + CSS transition)
      if (headerRef.current) {
        const vis = p < INTRO_END
        headerRef.current.style.opacity   = vis ? '1' : '0'
        headerRef.current.style.transform = vis
          ? 'translateY(0px)'
          : p < 0.04 ? 'translateY(30px)' : 'translateY(-30px)'
      }

      // Label persistente "PROJECTS" — visibile solo durante i progetti
      if (sectionLabelRef.current) {
        const vis = p >= INTRO_END && p < EXIT_START
        sectionLabelRef.current.style.opacity = vis ? '1' : '0'
      }

      // Progetto attivo corrente
      let activeIndex = -1

      PROJECTS.forEach((_, i) => {
        const ref    = projectRefs.current[i]
        const dotRef = dotRefs.current[i]
        if (!ref) return

        const start = INTRO_END + i * PROJ_SIZE
        const end   = start + PROJ_SIZE

        // Visibilità BINARIA — come le labels in ScrollHero
        const active = p >= start && p < end
        if (active) activeIndex = i

        ref.style.opacity       = active ? '1' : '0'
        ref.style.transform     = active
          ? 'translateY(0px)'
          : p < start ? 'translateY(40px)' : 'translateY(-40px)'
        ref.style.pointerEvents = active ? 'auto' : 'none'

        if (dotRef) {
          dotRef.style.background = active ? '#2997ff' : 'rgba(255,255,255,0.15)'
          dotRef.style.transform  = active ? 'scale(2)' : 'scale(1)'
        }
      })

      // Aggiorna counter "01 / 04"
      if (counterRef.current && activeIndex >= 0) {
        counterRef.current.textContent =
          `${String(activeIndex + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
      }

      // Exit overlay
      if (exitRef.current) {
        exitRef.current.style.opacity = String(
          Math.max(0, (p - EXIT_START) / (1 - EXIT_START))
        )
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const TRANSITION = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)'

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ height: '500vh', position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Gradient mask top / bottom */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-0"
          style={{ height: '100px', background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
          style={{ height: '100px', background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }} />

        {/* Gemini path lines — background decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ opacity: 0.35 }}>
          <GoogleGeminiEffect
            pathLengths={[p0, p1, p2, p3, p4]}
            className="absolute inset-0"
          />
        </div>

        {/* Griglia decorativa */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ opacity: 0.04 }}>
          <div className="absolute left-1/4  top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-2/4  top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-3/4  top-0 bottom-0 w-px bg-white" />
          <div className="absolute top-1/3  left-0 right-0 h-px bg-white" />
          <div className="absolute top-2/3  left-0 right-0 h-px bg-white" />
        </div>

        {/* 3D Background */}
        <div className="absolute inset-0 z-0" style={{ opacity: 0.20 }}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <ProjectShape progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* ═══ LABEL PERSISTENTE "PROJECTS" — top-left ═══ */}
        <div
          ref={sectionLabelRef}
          className="absolute top-8 left-10 lg:left-16 z-20 select-none"
          style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 bg-apple-blue rounded-full" />
            <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-apple-blue">
              / AI.PROJECTS
            </span>
          </div>
          <span
            ref={counterRef}
            className="font-mono text-[11px] text-zinc-600 tracking-widest"
          >
            01 / 04
          </span>
        </div>

        {/* ══ INTRO HEADER ══ */}
        <div
          ref={headerRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none"
          style={{ opacity: 0, transform: 'translateY(30px)', transition: TRANSITION }}
        >
          <span className="font-mono text-[10px] tracking-[0.6em] uppercase text-apple-blue mb-6">
            / AI.PORTFOLIO
          </span>
          <h2
            className="font-display font-black text-center text-white"
            style={{
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.05em',
            }}
          >
            <span className="block">MY</span>
            <span className="block" style={{ color: '#3f3f46' }}>PROJECTS</span>
          </h2>
        </div>

        {/* ══ PROJECT PANELS ══ */}
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            ref={el => { projectRefs.current[i] = el }}
            className="absolute inset-0 flex flex-col justify-center z-10 px-10 lg:px-24"
            style={{
              opacity: 0,
              transform: 'translateY(40px)',
              transition: TRANSITION,
              pointerEvents: 'none',
            }}
          >
            <div className="max-w-6xl w-full mx-auto">

              {/* Riga 1: numero ghost + categoria + tag */}
              <div className="flex items-start gap-6 mb-8">
                <span
                  className="font-mono font-bold text-white select-none shrink-0"
                  style={{
                    fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                    opacity: 0.06,
                    lineHeight: 1,
                    marginTop: '4px',
                  }}
                >
                  {project.number}
                </span>
                <div>
                  <span className="font-mono text-[10px] tracking-[0.55em] uppercase text-apple-blue block mb-3">
                    {project.category}
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                        // {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Titolo */}
              <h3
                className="font-display font-black text-white"
                style={{
                  fontSize: 'clamp(3rem, 9vw, 8rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  marginBottom: '0.18em',
                }}
              >
                {project.title}
              </h3>

              {/* Sottotitolo */}
              <p
                className="font-display font-light text-zinc-600"
                style={{
                  fontSize: 'clamp(1.1rem, 3vw, 2.6rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '2.2rem',
                }}
              >
                {project.subtitle}
              </p>

              {/* Divisore + descrizione / metrica / link */}
              <div
                className="flex flex-col lg:flex-row gap-10 items-start pt-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p
                  className="text-zinc-500 leading-relaxed max-w-2xl"
                  style={{ fontSize: 'clamp(0.82rem, 1.3vw, 0.97rem)' }}
                >
                  {project.description}
                </p>

                <div className="flex flex-col gap-5 lg:ml-auto shrink-0 items-start lg:items-end">
                  {/* Metrica */}
                  <div className="lg:text-right">
                    <div
                      className="font-display font-black text-white"
                      style={{
                        fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {project.metric}
                    </div>
                    <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-2">
                      {project.metricLabel}
                    </div>
                  </div>

                  {/* Link GitHub */}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 group/btn mt-2"
                  >
                    <span className="font-mono text-[10px] text-white uppercase tracking-widest">
                      View Source
                    </span>
                    <div className="w-8 h-px bg-white group-hover/btn:w-16 group-hover/btn:bg-apple-blue transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ── Dot indicator — destra ── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 select-none">
          {PROJECTS.map((_, i) => (
            <div
              key={i}
              ref={el => { dotRefs.current[i] = el }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>

        {/* ── Progress bar — bottom ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{ height: 1, background: 'rgba(41,151,255,0.08)' }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: '100%',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              background: 'linear-gradient(90deg, rgba(41,151,255,0.85), rgba(100,180,255,0.4))',
            }}
          />
        </div>

        {/* ══ EXIT OVERLAY ══ */}
        <div
          ref={exitRef}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ background: '#080808', opacity: 0 }}
        />
      </div>
    </section>
  )
}
