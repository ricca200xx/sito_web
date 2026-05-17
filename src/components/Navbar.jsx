import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'PROFILE',  href: '#about'    },
  { label: 'STACK',    href: '#skills'   },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT',  href: '#contact'  },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled]           = useState(false)
  const [menuOpen, setMenuOpen]           = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)

    const sections = NAV_ITEMS
      .map(item => document.querySelector(item.href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection('#' + entry.target.id)
      }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach(s => observer.observe(s))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      sections.forEach(s => observer.unobserve(s))
    }
  }, [])

  return (
    <>
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

        <div className="flex items-center gap-4 lg:gap-12 pointer-events-auto">
          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-10">
            {NAV_ITEMS.map(item => {
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

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden lg:block px-5 py-2 border border-white/10 hover:border-apple-blue/50 rounded-full font-mono text-[9px] tracking-[0.2em] text-white transition-all group relative overflow-hidden"
          >
            <span className="relative z-10">CONTACT.INIT()</span>
            <motion.div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform" />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[73px] bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-10 lg:hidden"
          >
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-mono text-xl tracking-[0.4em] uppercase text-white hover:text-apple-blue transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 px-8 py-3 border border-white/20 rounded-full font-mono text-[10px] tracking-[0.3em] text-white hover:border-apple-blue/50 transition-colors"
            >
              CONTACT.INIT()
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
