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
      "Sviluppato e valutato architetture Deep Learning per il tracking in tempo reale usando Python e PyTorch. Prototipati modelli comparando YOLOv11s (Ultralytics), RT-DETR (Visual Transformer) e Faster R-CNN (CNN). Condotta un'analisi rigorosa dei requisiti riguardo inference speed vs. geometric accuracy, definendo software requirements per ottimizzare le performance nel mondo reale.",
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
      "Costruita una Convolutional Neural Network (CNN) e Multilayer Perceptron (MLP) da zero, raggiungendo l'87% di accuracy. Gestita la pipeline completa dei dati dal preprocessing alla model validation, risolvendo un problema di classificazione reale.",
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
        gridColumn: isExpanded ? '1 / -1' : 'auto',
      }}
      whileHover={!isExpanded ? { borderColor: 'rgba(255,255,255,0.2)', y: -2 } : {}}
    >
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
