// src/components/Contact.jsx
import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="relative py-40 px-8 bg-transparent">
      {/* Gradient mask entrata dalla Projects section */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '160px', background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
      {/* Fine pagina — fade verso il fondo */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '120px', background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 52 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-2 h-2 bg-apple-blue" />
            <span className="font-mono text-apple-blue text-[10px] tracking-[0.5em] uppercase">
              System.Ping
            </span>
            <div className="w-2 h-2 bg-apple-blue" />
          </div>
          <h2 className="font-display font-black text-6xl lg:text-8xl text-white tracking-tight leading-none mb-8">
            LET&apos;S <span className="text-zinc-600">CONNECT</span>
          </h2>
          <p className="text-zinc-400 text-xl font-mono tracking-widest uppercase">
            Available for exciting challenges in AI & Data Science
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0.25, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center gap-12 border-t border-white/10 pt-16 w-full max-w-3xl justify-center"
        >
          <a
            href="mailto:ricky.agosti@gmail.com"
            className="group flex flex-col items-center gap-4"
          >
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest group-hover:text-apple-blue transition-colors">
              // Email
            </span>
            <span className="font-display font-bold text-2xl text-white group-hover:text-apple-blue transition-colors">
              HELLO@EXAMPLE.COM
            </span>
          </a>

          <div className="hidden md:block w-px h-16 bg-white/10" />

          <a
            href="https://www.linkedin.com/in/riccardo-agosti-0b123a2a9/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4"
          >
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest group-hover:text-apple-blue transition-colors">
              // Network
            </span>
            <span className="font-display font-bold text-2xl text-white group-hover:text-apple-blue transition-colors">
              LINKEDIN
            </span>
          </a>

          <div className="hidden md:block w-px h-16 bg-white/10" />

          <a
            href="https://github.com/ricca200xx"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4"
          >
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest group-hover:text-apple-blue transition-colors">
              // Source
            </span>
            <span className="font-display font-bold text-2xl text-white group-hover:text-apple-blue transition-colors">
              GITHUB
            </span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32"
        >
          <a href="#hero" className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-colors flex flex-col items-center gap-4">
            <span className="inline-block w-px h-12 bg-white/20" />
            Return to Top
          </a>
        </motion.div>
      </div>
    </section>
  )
}
