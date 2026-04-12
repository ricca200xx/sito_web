# Portfolio CV Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire una SPA portfolio Dark Apple con cristallo 3D, effetti scroll cinematici e animazioni Framer Motion per il CV di Riccardo Niccolò Agosti.

**Architecture:** Single Page Application React (Vite) con scroll verticale continuo. Il canvas Three.js con cristallo icosaedro occupa la Hero e persiste durante lo scroll tramite `useScroll`. Ogni sezione si anima all'entrata con Framer Motion `useInView`. La Navbar fissa con dot indicator traccia la sezione attiva.

**Tech Stack:** React 18 + Vite, @react-three/fiber, @react-three/drei, framer-motion, Tailwind CSS 3, three.js

---

## File Map

| File | Responsabilità |
|------|---------------|
| `src/index.css` | CSS variables tema Dark Apple + reset globale + font |
| `src/main.jsx` | Entry point React |
| `src/App.jsx` | Composizione sezioni + scroll container |
| `src/hooks/useMouseParallax.js` | Hook mouse parallax per cristallo (desktop only) |
| `src/three/Crystal.jsx` | Icosaedro vetro 3D con animazione scroll e mouse |
| `src/components/Navbar.jsx` | Nav fissa con dot indicator scroll-aware |
| `src/components/Hero.jsx` | Sezione hero 100vh con cristallo + testo |
| `src/components/About.jsx` | Due colonne: testo + badge educazione |
| `src/components/Skills.jsx` | Griglia chip skill per categoria con stagger |
| `src/components/Projects.jsx` | Card 2×2 con espansione inline layoutId |
| `src/components/Contact.jsx` | Pill link contatti + footer + cristallo decorativo |
| `tailwind.config.js` | Estensione tema con colori Dark Apple |
| `vite.config.js` | Config Vite standard |

---

## Task 1: Setup progetto Vite + React + dipendenze

**Files:**
- Create: `package.json` (via npm create)
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `src/index.css`

- [ ] **Step 1: Scaffolding Vite**

```bash
cd "C:/Users/ricky/OneDrive/Desktop/git_project/sito_web"
npm create vite@latest . -- --template react
```
Rispondere `y` se chiede di procedere nella directory corrente.

- [ ] **Step 2: Installare dipendenze**

```bash
npm install
npm install three @react-three/fiber @react-three/drei framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: Configurare Tailwind**

Sostituire il contenuto di `tailwind.config.js` con:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'apple-black': '#080808',
        'apple-surface': '#111111',
        'apple-elevated': '#1a1a1a',
        'apple-white': '#f5f5f7',
        'apple-gray': '#86868b',
        'apple-blue': '#2997ff',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Configurare CSS globale**

Sostituire il contenuto di `src/index.css` con:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #080808;
  --bg-surface: #111111;
  --bg-elevated: #1a1a1a;
  --text-primary: #f5f5f7;
  --text-secondary: #86868b;
  --accent: #2997ff;
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-bg: rgba(255, 255, 255, 0.05);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  overflow-x: hidden;
}

::selection {
  background: var(--accent);
  color: #fff;
}

/* Scrollbar dark */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--bg-elevated); border-radius: 3px; }
```

- [ ] **Step 5: Configurare vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 6: Pulizia file boilerplate Vite**

Cancellare i file di default non necessari:
```bash
rm src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 7: Verificare che il progetto compili**

```bash
npm run dev
```
Aprire `http://localhost:5173` — deve caricare senza errori (pagina vuota o boilerplate React è OK).

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: setup Vite + React + Three.js + Framer Motion + Tailwind"
```

---

## Task 2: Hook useMouseParallax

**Files:**
- Create: `src/hooks/useMouseParallax.js`

- [ ] **Step 1: Creare il hook**

```js
// src/hooks/useMouseParallax.js
import { useState, useEffect } from 'react'

export function useMouseParallax(strength = 0.15) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2 * strength
      const y = (e.clientY / window.innerHeight - 0.5) * 2 * strength
      setOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength])

  return offset
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useMouseParallax.js
git commit -m "feat: add useMouseParallax hook"
```

---

## Task 3: Cristallo 3D (Crystal.jsx)

**Files:**
- Create: `src/three/Crystal.jsx`

- [ ] **Step 1: Creare il componente Crystal**

```jsx
// src/three/Crystal.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment } from '@react-three/drei'
import { useMouseParallax } from '../hooks/useMouseParallax'

export default function Crystal({ scale = 1, scrollProgress = 0, secondary = false }) {
  const meshRef = useRef()
  const mouseOffset = useMouseParallax(secondary ? 0 : 0.15)

  useFrame((state) => {
    if (!meshRef.current) return
    const speed = secondary ? 0.002 : 0.003
    meshRef.current.rotation.y += speed
    meshRef.current.rotation.x += speed * 0.3

    if (!secondary) {
      meshRef.current.rotation.y += mouseOffset.x * 0.05
      meshRef.current.rotation.x += mouseOffset.y * 0.05
    }
  })

  // Scala e opacità guidate dallo scroll (solo cristallo principale)
  const computedScale = secondary
    ? scale
    : scale * (1 - scrollProgress * 0.7)

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#2997ff" />

      <mesh ref={meshRef} scale={computedScale}>
        <icosahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.05}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.05}
          color={secondary ? '#1a1a2e' : '#ffffff'}
          backside={true}
          backsideThickness={0.3}
          envMapIntensity={1.5}
        />
      </mesh>
    </>
  )
}
```

- [ ] **Step 2: Verificare che Three.js non dia errori**

Creare temporaneamente `src/App.jsx` minimale per testare il cristallo:

```jsx
import { Canvas } from '@react-three/fiber'
import Crystal from './three/Crystal'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#080808' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Crystal />
      </Canvas>
    </div>
  )
}
```

Avviare `npm run dev` — il cristallo deve essere visibile e ruotare.

- [ ] **Step 3: Commit**

```bash
git add src/three/Crystal.jsx src/App.jsx
git commit -m "feat: add Crystal 3D icosahedron with transmission material"
```

---

## Task 4: Navbar

**Files:**
- Create: `src/components/Navbar.jsx`

- [ ] **Step 1: Creare Navbar con dot indicator**

```jsx
// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.querySelector(item.href)
    ).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection('#' + entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => sections.forEach((section) => observer.unobserve(section))
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(8, 8, 8, 0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo monogramma */}
      <span
        className="font-display font-bold text-lg tracking-widest"
        style={{ color: 'var(--text-primary)', letterSpacing: '0.2em' }}
      >
        RA
      </span>

      {/* Nav links */}
      <ul className="flex items-center gap-8">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.href
          return (
            <li key={item.href} className="relative flex flex-col items-center">
              <a
                href={item.href}
                className="text-sm transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {item.label}
              </a>
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: add Navbar with scroll-aware dot indicator"
```

---

## Task 5: Sezione Hero

**Files:**
- Create: `src/components/Hero.jsx`

- [ ] **Step 1: Creare Hero con cristallo e testo animato**

```jsx
// src/components/Hero.jsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScroll, useTransform } from 'framer-motion'
import { motion } from 'framer-motion'
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
```

- [ ] **Step 2: Aggiornare App.jsx per includere Hero e Navbar**

```jsx
// src/App.jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  return (
    <main>
      <Navbar />
      <Hero />
    </main>
  )
}
```

- [ ] **Step 3: Avviare dev server e verificare**

```bash
npm run dev
```

Verificare:
- Cristallo 3D visibile e ruotante nella hero
- Testo anima con fade-in al caricamento
- Scrollando verso il basso, il cristallo si rimpicciolisce e sfuma
- Navbar visibile in cima con backdrop blur

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.jsx src/App.jsx
git commit -m "feat: add Hero section with 3D crystal and scroll animation"
```

---

## Task 6: Sezione About

**Files:**
- Create: `src/components/About.jsx`

- [ ] **Step 1: Creare About a due colonne**

```jsx
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
          className="flex gap-16 items-center"
          style={{ flexDirection: 'row', flexWrap: 'wrap' }}
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
              Sono uno studente magistrale in Data Science all'Università di Padova,
              appassionato di AI e Machine Learning. Ho un solido background statistico
              e un'esperienza pratica in Deep Learning — Computer Vision, NLP, Time Series
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
```

- [ ] **Step 2: Aggiungere About ad App.jsx**

```jsx
// src/App.jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'

export default function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
    </main>
  )
}
```

- [ ] **Step 3: Verificare**

Avviare `npm run dev` e scrollare fino alla sezione About. Verificare:
- Testo entra da sinistra
- Badge e cristallo entrano da destra con delay scaglionato
- Layout a due colonne su desktop

- [ ] **Step 4: Commit**

```bash
git add src/components/About.jsx src/App.jsx
git commit -m "feat: add About section with two-column layout and badges"
```

---

## Task 7: Sezione Skills

**Files:**
- Create: `src/components/Skills.jsx`

- [ ] **Step 1: Creare Skills con chip animati in stagger**

```jsx
// src/components/Skills.jsx
import { motion } from 'framer-motion'

const SKILL_GROUPS = [
  {
    category: 'Languages',
    skills: ['Python', 'SQL', 'R', 'Stata', 'Git'],
  },
  {
    category: 'Frameworks',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Keras', 'HuggingFace', 'YOLO Ultralytics'],
  },
  {
    category: 'Deep Learning',
    skills: ['CNN', 'RNN', 'Transformers', 'Visual Transformers', 'MLP', 'Decision Trees'],
  },
  {
    category: 'Analysis',
    skills: ['Statistical Analysis', 'Data Visualization', 'Pandas', 'Seaborn', 'Matplotlib'],
  },
]

function SkillChip({ skill, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: 'inline-block',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        borderRadius: '9999px',
        padding: '6px 16px',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
      }}
    >
      {skill}
    </motion.span>
  )
}

export default function Skills() {
  let chipIndex = 0

  return (
    <section
      id="skills"
      style={{
        background: 'var(--bg-surface)',
        padding: '120px 0',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1100px', padding: '0 2rem' }}>
        {/* Titolo sezione */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            — Skills
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Tecnologie &amp; Strumenti
          </h2>
        </motion.div>

        {/* Gruppi di chip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {SKILL_GROUPS.map((group) => (
            <div key={group.category}>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'var(--accent)' }}
              >
                {group.category}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {group.skills.map((skill) => {
                  const delay = chipIndex * 0.05
                  chipIndex++
                  return <SkillChip key={skill} skill={skill} delay={delay} />
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Aggiungere Skills ad App.jsx**

```jsx
// src/App.jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'

export default function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
    </main>
  )
}
```

- [ ] **Step 3: Verificare**

Scrollare fino alla sezione Skills. Verificare:
- I chip appaiono in cascata con stagger
- Ogni categoria ha il label in blu accent
- I chip hanno il bordo glassmorphism

- [ ] **Step 4: Commit**

```bash
git add src/components/Skills.jsx src/App.jsx
git commit -m "feat: add Skills section with staggered chip animations"
```

---

## Task 8: Sezione Projects

**Files:**
- Create: `src/components/Projects.jsx`

- [ ] **Step 1: Creare Projects con card espandibili**

```jsx
// src/components/Projects.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PROJECTS = [
  {
    id: 'p1',
    number: '01',
    title: 'Real-Time Object Detection',
    tags: ['Computer Vision', 'YOLOv11', 'RT-DETR', 'Faster R-CNN'],
    summary: 'Architetture Deep Learning per tracking in tempo reale.',
    description:
      'Sviluppato e valutato architetture Deep Learning per il tracking in tempo reale usando Python e PyTorch. Prototipati modelli comparando YOLOv11s (Ultralytics), RT-DETR (Visual Transformer) e Faster R-CNN (CNN). Condotta un\'analisi rigorosa dei requisiti riguardo inference speed vs. geometric accuracy, definendo software requirements per ottimizzare le performance nel mondo reale.',
    result: null,
  },
  {
    id: 'p2',
    number: '02',
    title: 'Time-Series Weather Forecast',
    tags: ['GRU/RNN', 'Seq2Seq', 'PyTorch', '76 variabili'],
    summary: 'Modello Seq2Seq GRU/RNN per previsione meteo a 76 variabili.',
    description:
      'Progettato un modello Deep Learning Seq2Seq GRU/RNN in PyTorch per predire 76 variabili meteorologiche. Condotta analisi statistica e create visualizzazioni per interpretare trend multivariati, dimostrando strong problem-solving in contesti di dati complessi.',
    result: null,
  },
  {
    id: 'p3',
    number: '03',
    title: 'Image Classification System',
    tags: ['CNN', 'MLP', 'Computer Vision'],
    summary: 'CNN e MLP custom con 87% di accuracy.',
    description:
      'Costruita una Convolutional Neural Network (CNN) e Multilayer Perceptron (MLP) da zero, raggiungendo l\'87% di accuracy. Gestita la pipeline completa dei dati dal preprocessing alla model validation, risolvendo un problema di classificazione reale.',
    result: '87% accuracy',
  },
  {
    id: 'p4',
    number: '04',
    title: 'Maximum Clique Optimization',
    tags: ['Algorithms', 'Python', 'Optimization'],
    summary: 'Algoritmo Python per Maximum Clique Problem.',
    description:
      'Sviluppato un algoritmo Python per risolvere complessi problemi di ottimizzazione (Maximum Clique Problem). Migliorato il processo di automazione raggiungendo un 30% di riduzione del tempo di esecuzione su dataset DIMACS, dimostrando un miglioramento proattivo degli standard analitici.',
    result: '30% speedup',
  },
]

function ProjectCard({ project, isExpanded, onToggle }) {
  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={onToggle}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${isExpanded ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '16px',
        padding: isExpanded ? '2rem' : '1.75rem',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        gridColumn: isExpanded ? '1 / -1' : 'auto',
      }}
      whileHover={!isExpanded ? { borderColor: 'rgba(255,255,255,0.2)', y: -2 } : {}}
    >
      {/* Header card */}
      <div className="flex items-start justify-between mb-4">
        <span
          className="font-display font-bold"
          style={{ fontSize: '2.5rem', color: 'var(--accent)', lineHeight: 1 }}
        >
          {project.number}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 45 : 0 }}
          style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '0.5rem' }}
        >
          →
        </motion.span>
      </div>

      <h3
        className="font-display font-semibold mb-3"
        style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}
      >
        {project.title}
      </h3>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              background: 'rgba(41, 151, 255, 0.1)',
              border: '1px solid rgba(41, 151, 255, 0.2)',
              color: 'var(--accent)',
              borderRadius: '9999px',
              padding: '3px 10px',
              fontSize: '0.72rem',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: project.result ? '1.5rem' : 0,
              }}
            >
              {project.description}
            </p>

            {project.result && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(41, 151, 255, 0.1)',
                  border: '1px solid rgba(41, 151, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                ✦ {project.result}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem' }}>
          {project.summary}
        </p>
      )}
    </motion.div>
  )
}

export default function Projects() {
  const [expandedId, setExpandedId] = useState(null)

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  return (
    <section
      id="projects"
      style={{ background: 'var(--bg-primary)', padding: '120px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: '1100px', padding: '0 2rem' }}>
        {/* Titolo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            — Projects
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Cosa ho costruito
          </h2>
        </motion.div>

        {/* Griglia 2×2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isExpanded={expandedId === project.id}
              onToggle={() => toggle(project.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Aggiungere Projects ad App.jsx**

```jsx
// src/App.jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'

export default function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
    </main>
  )
}
```

- [ ] **Step 3: Verificare**

Scrollare fino ai Projects. Verificare:
- Griglia 2×2 visibile
- Click su una card la espande mostrando descrizione completa
- Badge risultato (87% accuracy, 30% speedup) visibili nelle card espanse
- Click su card già espansa la chiude

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.jsx src/App.jsx
git commit -m "feat: add Projects section with expandable cards and result badges"
```

---

## Task 9: Sezione Contact + Footer

**Files:**
- Create: `src/components/Contact.jsx`

- [ ] **Step 1: Creare Contact con pill link e cristallo decorativo**

```jsx
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
        {/* Headline */}
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

        {/* Pill link */}
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
```

- [ ] **Step 2: Completare App.jsx con tutte le sezioni**

```jsx
// src/App.jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'

export default function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  )
}
```

- [ ] **Step 3: Verificare il sito completo**

Avviare `npm run dev` e scorrere l'intera pagina:
- Hero → About → Skills → Projects → Contact
- Navbar dot indicator si sposta sulla sezione attiva
- Tutti i link contact sono cliccabili
- Footer visibile in fondo

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.jsx src/App.jsx
git commit -m "feat: add Contact section with glass pill links and decorative crystal"
```

---

## Task 10: Effetto parallax background globale

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Aggiungere parallax radial gradient allo scroll**

```jsx
// src/App.jsx — versione finale con parallax background
import { useScroll, useTransform, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'

export default function App() {
  const { scrollYProgress } = useScroll()
  const gradientY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div style={{ position: 'relative' }}>
      {/* Gradiente radiale parallax */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% ${gradientY.get()}%, rgba(41,151,255,0.04) 0%, transparent 70%)`,
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
```

**Nota:** `gradientY` è un `MotionValue`. Per farlo aggiornare correttamente nel gradiente inline, usa `useMotionTemplate`:

```jsx
// src/App.jsx — versione corretta con useMotionTemplate
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
```

- [ ] **Step 2: Verificare l'effetto**

Scrollare lentamente l'intera pagina. Il gradiente radiale blu tenue deve seguire lo scroll verticalmente.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add scroll-driven parallax radial gradient background"
```

---

## Task 11: Responsive mobile

**Files:**
- Modify: `src/components/About.jsx`
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Forzare layout colonna singola su mobile per About**

In `src/components/About.jsx`, modificare il div contenitore delle colonne:

```jsx
// Sostituire questa riga nel div che contiene le due colonne:
className="flex gap-16 items-center"
style={{ flexDirection: 'row', flexWrap: 'wrap' }}

// Con:
className="flex gap-16 items-center"
style={{
  flexDirection: 'row',
  flexWrap: 'wrap',
}}
// (il flexWrap: 'wrap' già gestisce il mobile — i flex items si impilano quando
// minWidth è raggiunta. Verificare che minWidth '280px' sia impostata su entrambe le colonne)
```

Verificare che su viewport < 768px le due colonne si impilino verticalmente. Se la minWidth delle colonne è già impostata (`minWidth: '280px'`) il comportamento è già corretto grazie a `flexWrap`.

- [ ] **Step 2: Testare su mobile**

Aprire DevTools → Toggle device toolbar → iPhone 12 (390px).

Verificare:
- Hero: testo ridotto (già gestito da `clamp()`)
- About: layout a colonna singola
- Skills: chip che vanno a capo
- Projects: griglia 1 colonna (già gestita da `auto-fit, minmax(280px, 1fr)`)
- Contact: pill che vanno a capo

- [ ] **Step 3: Commit**

```bash
git add src/components/About.jsx
git commit -m "fix: verify responsive layout on mobile viewports"
```

---

## Task 12: Build finale e verifica

- [ ] **Step 1: Build di produzione**

```bash
npm run build
```

Output atteso:
```
✓ built in X.XXs
dist/index.html          X.XX kB
dist/assets/index-XXX.js  XXX kB
```

Nessun errore TypeScript o warning critici.

- [ ] **Step 2: Preview build locale**

```bash
npm run preview
```

Aprire `http://localhost:4173` e verificare la build di produzione.

- [ ] **Step 3: Verifica checklist finale**

- [ ] Cristallo 3D visibile e interattivo nella Hero
- [ ] Scroll anima il cristallo (scala + opacity)
- [ ] Tutte le sezioni entrano con animazione al viewport
- [ ] Card progetti si espandono e chiudono correttamente
- [ ] Badge risultato (87% accuracy, 30% speedup) visibili
- [ ] Chip skill animati in stagger
- [ ] Navbar con dot indicator funzionante
- [ ] Parallax background gradient attivo durante lo scroll
- [ ] Layout responsive su mobile (iPhone 390px)
- [ ] Tutti i link Contact sono cliccabili e corretti
- [ ] Build `npm run build` senza errori

- [ ] **Step 4: Commit finale**

```bash
git add -A
git commit -m "feat: portfolio CV complete - Dark Apple style with 3D crystal"
```

---

## Task 13: Deploy su Vercel

- [ ] **Step 1: Installare Vercel CLI (opzionale)**

```bash
npm install -g vercel
```

- [ ] **Step 2: Deploy**

**Opzione A — CLI:**
```bash
vercel --prod
```
Seguire le istruzioni: selezionare la directory corrente, framework preset `Vite`.

**Opzione B — Drag & Drop:**
1. Andare su [vercel.com](https://vercel.com)
2. Trascinare la cartella `dist/` nella dashboard Vercel
3. Il sito sarà live in ~30 secondi

- [ ] **Step 3: Verificare URL live**

Aprire l'URL fornito da Vercel. Verificare che il sito funzioni identicamente alla preview locale.

---

## Note implementative

- **LinkedIn URL:** inserire la URL completa del profilo LinkedIn in `src/components/Contact.jsx` alla riga `href: 'https://linkedin.com/in/...'`
- **Crystal performance:** su mobile con GPU debole, il canvas Three.js può essere lento. Se necessario, aggiungere `performance={{ min: 0.5 }}` al `<Canvas>` per consentire pixel ratio ridotto
- **EnvMap:** `Environment preset="city"` di @react-three/drei carica un HDR. Se la connessione è lenta, usare `preset="dawn"` (più leggero)
