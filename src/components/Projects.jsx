// src/components/Projects.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PROJECTS = [
  {
    id: 'p1',
    number: '01',
    title: "Gotta Detect 'Em All",
    subtitle: "Real-Time Pokemon Detection",
    url: "https://github.com/ricca200xx/Pokemon-Detection-Model-Comparison",
    tags: ['YOLOv11s', 'RT-DETR', 'Faster R-CNN', 'PyTorch'],
    description: "A comparative study of object detection architectures for real-time Pokémon detection on a balanced 9-class dataset. Analyzes trade-offs between inference speed, localization quality, and classification precision.",
  },
  {
    id: 'p2',
    number: '02',
    title: 'Solving Maximum Clique Problem',
    subtitle: "via Continuous Optimization",
    url: "https://github.com/ricca200xx/Find-a-maximal-clique-with-optimization-algorithm",
    tags: ['Python', 'Projected Gradient Descent', 'Frank-Wolfe'],
    description: "Addresses the Maximum Clique Problem (MCP) by reformulating it as a continuous optimization problem using the Motzkin-Straus formulation. Implements and compares first-order optimization algorithms.",
  },
  {
    id: 'p3',
    number: '03',
    title: 'Custom CNN Image Recognition',
    subtitle: "From Scratch Classification",
    url: "https://github.com/ricca200xx/Scratch-CNN-Image-Recognition",
    tags: ['PyTorch', 'CNN', 'Deep Learning'],
    description: "An end-to-end image classification project implementing a Convolutional Neural Network (CNN) from scratch to classify 20 categories. Demonstrates complete deep learning workflows including preprocessing and architecture design.",
  },
  {
    id: 'p4',
    number: '04',
    title: 'Weather Time-Series Forecasting',
    subtitle: "with Seq2Seq GRU",
    url: "https://github.com/ricca200xx/Weather-Time-Series-Forecasting-with-Seq2Seq-GRU",
    tags: ['PyTorch', 'Seq2Seq', 'GRU', 'Scikit-learn'],
    description: "A multivariate time-series forecasting project predicting 76 weather variables for 30 future steps using 90 historical steps. Employs a Sequence-to-Sequence (Seq2Seq) architecture based on Gated Recurrent Units.",
  },
]

export default function Projects() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section id="projects" className="relative py-40 px-8 bg-transparent">
      {/* Gradient masks per transizioni smooth */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '160px', background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
        style={{ height: '160px', background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32 flex flex-col items-start"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-2 bg-apple-blue" />
            <span className="font-mono text-apple-blue text-[10px] tracking-[0.5em] uppercase">
              Selected.Works
            </span>
          </div>
          <h2 className="font-display font-black text-5xl lg:text-7xl text-white tracking-tight leading-none">
            ENGINEERING <br/><span className="text-zinc-600">PORTFOLIO</span>
          </h2>
        </motion.div>

        <div className="flex flex-col border-t border-white/10">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 52 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex flex-col lg:flex-row items-start lg:items-center py-16 border-b border-white/10 transition-colors hover:bg-white/[0.02]"
            >
              
              {/* Left: Number & Title */}
              <div className="lg:w-1/2 flex gap-8 items-start mb-8 lg:mb-0 px-8">
                <span className="font-mono text-zinc-700 text-xl font-bold mt-2 transition-colors group-hover:text-apple-blue">
                  {project.number}
                </span>
                <div>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                    <h3 className="font-display font-black text-3xl lg:text-5xl text-white tracking-tight mb-2 group-hover:text-apple-blue transition-colors duration-300">
                      {project.title}
                    </h3>
                  </a>
                  <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-6">
                    {project.subtitle}
                  </span>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                        // {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Description & Link */}
              <div className="lg:w-1/2 px-8 flex flex-col items-start lg:pl-16 lg:border-l border-white/10">
                <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl">
                  {project.description}
                </p>
                <a 
                  href={project.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 group/btn"
                >
                  <span className="font-mono text-xs text-white uppercase tracking-widest">View Source</span>
                  <div className="w-8 h-px bg-white group-hover/btn:w-16 group-hover/btn:bg-apple-blue transition-all duration-300" />
                </a>
              </div>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
