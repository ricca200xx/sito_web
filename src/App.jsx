import { useEffect } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import 'lenis/dist/lenis.css'
import Lenis from 'lenis'
import Navbar        from './components/Navbar'
import ScrollHero    from './components/ScrollHero'
import About         from './components/About'
import Skills        from './components/Skills'
import Projects      from './components/Projects'
import Contact       from './components/Contact'
import VideoBackground  from './components/VideoBackground'
import FloatingObjects  from './components/FloatingObjects'

export default function App() {
  useEffect(() => {
    /* Lenis smooth scroll — durata leggermente ridotta per
       non "smorzare" troppo il video-scrubbing sticky */
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.05,
      smoothWheel: true,
      wheelMultiplier: 1.0,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="relative min-h-screen text-white selection:bg-apple-blue/30 selection:text-white">

      {/* layer -1: canvas 2D background (particelle, nebula, griglia) */}
      <VideoBackground />

      {/* layer 1: oggetti 3D wireframe flottanti */}
      <FloatingObjects />

      <main className="relative z-10">
        <Navbar />

        {/* ── hero: sticky scroll section (Apple-style) ── */}
        <ScrollHero />

        {/* ── resto del sito sotto la hero section ── */}
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <SpeedInsights />
    </div>
  )
}
