import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, MeshTransmissionMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════
   ScrollHero  —  Apple AirPods-style sticky scroll section

   Sequenza temporale (progress 0 → 1 su 300vh):
   ─ 0.00 → 0.18   Crystal emerge, nome visibile
   ─ 0.18 → 0.22   Gap pulito: nome svanito, label non ancora
   ─ 0.22 → 0.44   Label "Neural Architectures"
   ─ 0.44 → 0.66   Label "Predictive Modeling"
   ─ 0.66 → 0.88   Label "AI Systems"
   ─ 0.88 → 1.00   Exit overlay fade → #080808 (transizione alla sezione dopo)
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

/* ── Crystal 3D pilotato da progressRef ─────────────────── */
function DrivenCrystal({ progressRef }) {
  const meshRef = useRef()

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const p = progressRef.current

    // Minimalist and elegant scaling - TorusKnot but much smaller
    mesh.scale.setScalar(mapKeys(p,
      [0,    0.20, 0.50, 0.80, 1.0],
      [0.05, 0.60, 0.85, 0.95, 0.75]
    ))
    
    // Slow, professional rotation
    mesh.rotation.y = p * Math.PI * 1.5
    mesh.rotation.x = p * Math.PI * 1.2
    
    // Contained positioning
    mesh.position.y = mapKeys(p, [0, 0.25, 0.60, 1.0], [-0.1, 0.2, 0.1, -0.05])
  })

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]}    intensity={1.2} color="#ffffff" />
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.1}
          thickness={0.5}
          ior={1.4}
          chromaticAberration={0.06}
          color="#ffffff"
          backside
          backsideThickness={0.3}
          envMapIntensity={1.5}
        />
      </mesh>
    </>
  )
}

/* ── ScrollHero principale ───────────────────────────────── */
export default function ScrollHero() {
  const sectionRef   = useRef(null)
  const progressRef  = useRef(0)

  /* Refs DOM per aggiornamenti diretti (zero re-render) */
  const nameInnerRef = useRef(null)   // inner div del nome (fade-out su scroll)
  const label1Ref    = useRef(null)
  const label2Ref    = useRef(null)
  const label3Ref    = useRef(null)
  const indicatorRef = useRef(null)   // "scroll" indicator
  const exitRef      = useRef(null)   // overlay nero exit

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return

      const rect   = el.getBoundingClientRect()
      const totalH = el.offsetHeight - window.innerHeight
      const p      = Math.min(Math.max(-rect.top / totalH, 0), 1)
      progressRef.current = p

      /* ── Nome: fades out 0 → 0.18, si alza ── */
      if (nameInnerRef.current) {
        const op = Math.max(0, 1 - p / 0.18)
        nameInnerRef.current.style.opacity   = String(op)
        nameInnerRef.current.style.transform = `translateY(${p * -30}px)`
      }

      /* ── Scroll indicator: svanisce al primo scroll ── */
      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = String(Math.max(0, 1 - p / 0.07))
      }

      /* ── Labels: visibilità binaria + CSS transition ── */
      const setLabel = (ref, from, to) => {
        if (!ref.current) return
        const vis = p >= from && p < to
        ref.current.style.opacity   = vis ? '1' : '0'
        ref.current.style.transform = vis
          ? 'translateY(0px)'
          : p < from ? 'translateY(22px)' : 'translateY(-22px)'
      }
      setLabel(label1Ref, 0.22, 0.44)
      setLabel(label2Ref, 0.44, 0.66)
      setLabel(label3Ref, 0.66, 0.88)

      /* ── Exit overlay: fade a #080808 da 0.88 a 1.0 ── */
      if (exitRef.current) {
        exitRef.current.style.opacity = String(
          Math.max(0, (p - 0.88) / 0.12)
        )
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  /* ─── Render ─── */
  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ height: '300vh', position: 'relative' }}
    >
      {/* ── Viewport sticky ── */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Griglia decorativa sfondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          style={{ opacity: 0.05 }}>
          <div className="absolute left-1/4  top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-2/4  top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-3/4  top-0 bottom-0 w-px bg-white" />
          <div className="absolute top-1/2  left-0 right-0 h-px bg-white" />
        </div>

        {/* Three.js canvas — transparent */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            style={{ background: 'transparent' }}
            dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : [1, 2]}
          >
            <Suspense fallback={null}>
              <DrivenCrystal progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* ══ NOME ══
            Outer motion.div: animazione di entrata (Framer Motion)
            Inner div ref: fade-out controllato dallo scroll           */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
          <div ref={nameInnerRef} className="flex flex-col items-center select-none">
            <span className="font-mono text-[10px] tracking-[0.6em] uppercase text-apple-blue mb-5">
              Data Scientist · Gen AI & LLMs · MSc Student
            </span>
            <h1
              className="font-display font-black text-center text-white"
              style={{
                fontSize: 'clamp(2.8rem, 11vw, 9rem)',
                lineHeight: 0.84,
                letterSpacing: '-0.05em',
              }}
            >
              <span className="block">RICCARDO</span>
              <span className="block" style={{ color: '#3f3f46' }}>NICCOLÒ</span>
              <span className="block">AGOSTI</span>
            </h1>
          </div>
        </motion.div>

        {/* ══ SCROLL LABELS ══
            Ogni label appare solo nella sua finestra temporale.
            CSS transition gestisce il fade/slide.
            Posizionate al centro esatto del viewport.             */}
        {[
          { ref: label1Ref, label: 'Generative AI',          sub: 'LLMs & Agents' },
          { ref: label2Ref, label: 'Machine Learning',       sub: 'Deep Learning & Vision' },
          { ref: label3Ref, label: 'Statistical Modeling',    sub: 'Deep Learning & Time Series' },
        ].map(({ ref, label, sub }) => (
          <div
            key={label}
            ref={ref}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none"
            style={{
              opacity: 0,
              transform: 'translateY(22px)',
              transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <span
              className="font-mono uppercase text-apple-blue mb-4"
              style={{ fontSize: '10px', letterSpacing: '0.55em' }}
            >
              {sub}
            </span>
            <h2
              className="font-display font-black text-center text-white"
              style={{
                fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
              }}
            >
              {label}
            </h2>
          </div>
        ))}

        {/* ── Scroll indicator (svanisce al primo scroll) ── */}
        <div
          ref={indicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
        >
          <div className="h-10 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)' }} />
          <span
            className="font-mono uppercase text-zinc-600"
            style={{ fontSize: '8px', letterSpacing: '0.5em' }}
          >
            scroll
          </span>
        </div>

        {/* ── Barra progresso (fondo) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{ height: 2, background: 'rgba(41,151,255,0.10)' }}
        >
          <div
            id="hero-progress-bar"
            style={{
              height: '100%',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              background: 'linear-gradient(90deg, rgba(41,151,255,0.85), rgba(100,180,255,0.45))',
            }}
            ref={el => {
              if (!el) return
              /* micro-effect: aggiorna la barra live */
              const update = () => {
                el.style.transform = `scaleX(${progressRef.current})`
              }
              window.addEventListener('scroll', update, { passive: true })
            }}
          />
        </div>

        {/* ══ EXIT OVERLAY ══
            Fade a #080808 negli ultimi 12% della section.
            La sezione successiva (About) inizia con un fade-in
            speculare → transizione imperceptibile.               */}
        <div
          ref={exitRef}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ background: '#080808', opacity: 0 }}
        />
      </div>
    </section>
  )
}
