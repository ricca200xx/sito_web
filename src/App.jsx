// src/App.jsx
import { useScroll, useTransform, motion, useMotionTemplate } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'

export default function App() {
  const { scrollYProgress } = useScroll()
  const gradientY = useTransform(scrollYProgress, [0, 1], [20, 80])
  const background = useMotionTemplate`radial-gradient(ellipse 60% 50% at 50% ${gradientY}%, rgba(41,151,255,0.04) 0%, transparent 70%)`

  return (
    <div style={{ position: 'relative' }}>
      {/* Gradiente radiale parallax fisso */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background,
        }}
      />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}
