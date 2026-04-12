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
