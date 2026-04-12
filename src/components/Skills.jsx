// src/components/Skills.jsx
import { motion } from 'framer-motion'

const SKILL_GROUPS = [
  {
    label: '01_LANGUAGES',
    category: 'Core Languages',
    skills: ['Python', 'SQL', 'R', 'Stata', 'Git'],
  },
  {
    label: '02_FRAMEWORKS',
    category: 'DL Frameworks',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Keras', 'HuggingFace', 'YOLO'],
  },
  {
    label: '03_ARCHITECTURES',
    category: 'Neural Nets',
    skills: ['CNN', 'RNN', 'Transformers', 'ViT', 'MLP', 'Decision Trees'],
  },
  {
    label: '04_ANALYTICS',
    category: 'Data Insights',
    skills: ['Stats', 'Visualization', 'Pandas', 'Seaborn', 'Matplotlib'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative py-40 px-8 bg-transparent">
      {/* Gradient masks per transizioni smooth */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '160px', background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '160px', background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-8 border-t border-white/10 pt-12">
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/3"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 bg-apple-blue" />
              <span className="font-mono text-apple-blue text-[10px] tracking-[0.5em] uppercase">
                Technical.Inventory
              </span>
            </div>
            <h2 className="font-display font-black text-5xl lg:text-7xl text-white tracking-tight leading-none">
              TECH <br/><span className="text-zinc-600">STACK</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-16"
          >
            {SKILL_GROUPS.map((group, groupIdx) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: groupIdx * 0.12, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-[10px] text-zinc-600 tracking-[0.2em] group-hover:text-apple-blue transition-colors">
                    {group.label}
                  </span>
                  <div className="h-px flex-grow bg-white/5 group-hover:bg-apple-blue/30 transition-colors" />
                </div>
                
                <h3 className="text-white font-display font-bold text-2xl mb-4 tracking-tight uppercase">
                  {group.category}
                </h3>
                
                <p className="font-mono text-[12px] text-zinc-400 uppercase tracking-widest leading-loose">
                  {group.skills.join(' / ')}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
