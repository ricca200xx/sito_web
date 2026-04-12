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
      <span
        className="font-display font-bold text-lg tracking-widest"
        style={{ color: 'var(--text-primary)', letterSpacing: '0.2em' }}
      >
        RA
      </span>

      <ul className="hidden md:flex items-center gap-8">
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
