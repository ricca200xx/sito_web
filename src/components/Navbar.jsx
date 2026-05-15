// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'PROFILE', href: '#about' },
  { label: 'STACK', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

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
    return () => {
      window.removeEventListener('scroll', handleScroll)
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center pointer-events-none border-b border-white/5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pointer-events-auto"
      >
        <a href="#hero" className="flex items-center gap-4 group">
          <div className="font-display font-black text-2xl text-white tracking-tighter">
            RA<span className="text-apple-blue">.</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <span className="font-mono text-[9px] tracking-[0.4em] text-zinc-500 uppercase">
            AI / 2026
          </span>
        </a>
      </motion.div>

      <div className="flex items-center gap-12 pointer-events-auto">
        <ul className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href
            return (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  className={`text-[9px] font-mono tracking-[0.3em] transition-all duration-300 ${
                    isActive ? 'text-apple-blue' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-apple-blue rounded-full"
                  />
                )}
              </li>
            )
          })}
        </ul>

        <a 
          href="#contact" 
          className="px-5 py-2 border border-white/10 hover:border-apple-blue/50 rounded-full font-mono text-[9px] tracking-[0.2em] text-white transition-all group relative overflow-hidden"
        >
          <span className="relative z-10">CONTACT.INIT()</span>
          <motion.div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform" />
        </a>
      </div>
    </nav>
  )
}
