// src/components/Hero.jsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScroll, useTransform, motion } from 'framer-motion'
import Crystal from '../three/Crystal'

const MaskText = ({ children, delay = 0 }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  </div>
)

export default function Hero() {
  const { scrollYProgress } = useScroll()
  const crystalOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const crystalScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, 200])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-20"
    >
      {/* Background Decor */}
      <motion.div
        style={{ opacity: crystalOpacity, scale: crystalScale }}
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
      >
        <div className="w-full h-full max-w-4xl max-h-[600px] opacity-40">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <Crystal scale={1.8} />
            </Suspense>
          </Canvas>
        </div>
      </motion.div>

      {/* Grid Lines - Slixel Style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ y: textY }}
        className="relative z-10 w-full max-w-[90vw] lg:max-w-7xl px-4 flex flex-col items-center text-center"
      >
        <div className="mb-12">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-apple-blue text-[10px] tracking-[0.6em] uppercase"
          >
            Data Scientist & AI Architect
          </motion.span>
        </div>

        <div className="flex flex-col gap-0 mb-12">
          <h1 className="font-display font-black leading-[0.8] tracking-[-0.06em] text-white text-[clamp(4.5rem,18vw,14rem)]">
            <MaskText delay={0.1}>RICCARDO</MaskText>
            <MaskText delay={0.2}>
              <span className="text-zinc-600">NICCOLÒ</span>
            </MaskText>
            <MaskText delay={0.3}>AGOSTI</MaskText>
          </h1>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-12 gap-8 border-t border-white/10 pt-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-start text-left max-w-xs"
          >
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Status // 2026</span>
            <p className="text-zinc-400 font-medium leading-relaxed text-sm">
              Pushing the boundaries of neural architectures and predictive modeling. Based in Italy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col items-end text-right"
          >
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Navigation</span>
            <div className="flex gap-8">
              <a href="#projects" className="font-mono text-[10px] text-white hover:text-apple-blue transition-colors tracking-widest uppercase underline decoration-apple-blue/30 underline-offset-8">Projects</a>
              <a href="#about" className="font-mono text-[10px] text-white hover:text-apple-blue transition-colors tracking-widest uppercase">Profile</a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-[-15vh] left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <div className="h-24 w-px bg-gradient-to-b from-white to-transparent opacity-20" />
        </motion.div>
      </motion.div>
    </section>
  )
}
