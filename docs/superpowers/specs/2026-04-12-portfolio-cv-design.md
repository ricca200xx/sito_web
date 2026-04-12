# Portfolio CV — Design Spec
**Data:** 2026-04-12  
**Autore:** Riccardo Niccolò Agosti  
**Stato:** Approvato

---

## Contesto

Riccardo è uno studente magistrale in Data Science (Università di Padova) con background in AI, Computer Vision e NLP. Ha bisogno di un sito portfolio CV moderno e visivamente impattante per presentarsi a recruiter e aziende nel settore tech, Cybersecurity e Defense. Il sito deve comunicare competenza tecnica e personalità attraverso un'estetica premium ispirata ad Apple.

---

## Obiettivo

Creare una Single Page Application portfolio che:
- Presenti il CV di Riccardo in modo visivamente memorabile
- Utilizzi effetti scroll cinematici e oggetti 3D stile Apple
- Sia deployabile su GitHub Pages o Vercel
- Risulti professionale su desktop e mobile

---

## Stack Tecnologico

| Tool | Versione | Scopo |
|------|----------|-------|
| React (Vite) | ^18 | Framework UI + build tool |
| @react-three/fiber | ^8 | Canvas 3D dichiarativo |
| @react-three/drei | ^9 | Helper Three.js (EnvMap, useScroll, etc.) |
| framer-motion | ^11 | Animazioni scroll e entrata |
| Tailwind CSS | ^3 | Styling utility-first |
| three | ^0.165 | Engine 3D (peer dependency) |

---

## Tema Visivo — Dark Apple

| Token | Valore | Uso |
|-------|--------|-----|
| `--bg-primary` | `#080808` | Background principale |
| `--bg-surface` | `#111111` | Card e sezioni alternate |
| `--bg-elevated` | `#1a1a1a` | Hover state e modal |
| `--text-primary` | `#f5f5f7` | Testi principali |
| `--text-secondary` | `#86868b` | Sottotitoli e label |
| `--accent` | `#2997ff` | CTA e highlight |
| `--glass-border` | `rgba(255,255,255,0.12)` | Bordi glassmorphism |
| `--glass-bg` | `rgba(255,255,255,0.05)` | Sfondo glassmorphism |

**Font:**
- Display: `SF Pro Display` (fallback: `Inter`, `-apple-system`)
- Body: `SF Pro Text` (fallback: `Inter`, `system-ui`)

---

## Struttura File

```
sito_web/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Hero.jsx          # Sezione hero con cristallo 3D
│   │   ├── About.jsx         # Storia + summary + badge educazione
│   │   ├── Skills.jsx        # Griglia chip skill per categoria
│   │   ├── Projects.jsx      # Card progetti espandibili
│   │   ├── Contact.jsx       # Link contatti + footer
│   │   └── Navbar.jsx        # Nav minimale con dot indicator
│   ├── three/
│   │   └── Crystal.jsx       # Oggetto 3D icosaedro vetro
│   ├── hooks/
│   │   └── useMouseParallax.js  # Parallax mouse per cristallo
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Variabili CSS tema + reset
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Sezioni — Design Dettagliato

### 1. Hero (100vh)

**Layout:** centrato, full screen  
**Elementi:**
- Canvas Three.js in background (posizione assoluta, z-index 0)
  - Cristallo icosaedro con `MeshPhysicalMaterial`:
    - `transmission: 1.0` (vetro)
    - `roughness: 0.05`
    - `ior: 1.5`
    - `envMap` HDR per riflessi ambientali
  - Rotazione idle: `0.003 rad/frame` su asse Y
  - Mouse parallax: spostamento leggero ±0.15 rad basato su posizione cursore
  - Scroll: riduzione scala da `1.0` → `0.3` + `opacity` → `0` tramite `useScroll`
- Testo sovrapposto (z-index 1, centrato):
  - `Riccardo Niccolò Agosti` — 72px, font-weight 700, `#f5f5f7`
  - `Data Scientist & AI Engineer` — 24px, `#86868b`
  - CTA button `Scopri il mio lavoro ↓` — pill con bordo `#2997ff`
- Noise texture overlay: SVG inline `feTurbulence` filter, `opacity: 0.03`, `pointer-events: none` (nessun asset esterno)

**Animazioni:** testo entra con `framer-motion` `y: 30 → 0`, `opacity: 0 → 1`, delay 0.3s

---

### 2. About

**Layout:** due colonne (60/40), padding `120px 0`  
**Colonna sinistra (testo):**
- Headline: `"Chi sono"` — label grigia piccola
- Titolo: `"Trasformo dati complessi in insight azionabili"` — 40px
- Testo: Professional summary riscritto in prima persona, tono personale (~100 parole)
- Entrata: slide-in da sinistra con Framer Motion `viewport: { once: true }`

**Colonna destra (visual):**
- Cristallo 3D secondario (scala ridotta, diversa rotazione)
- 3 badge glassmorphism impilati:
  - `🎓 MSc Data Science — Università di Padova`
  - `🎓 BSc Statistics — Università di Firenze · 94/110`
  - `🌍 English C1 · Italian Native`
- Entrata: slide-in da destra, delay scaglionato

---

### 3. Skills

**Layout:** centrato, 4 gruppi di chip  
**Struttura:**

| Categoria | Skill |
|-----------|-------|
| Languages | Python · SQL · R · Stata · Git |
| Frameworks | PyTorch · TensorFlow · Scikit-Learn · Keras · HuggingFace · YOLO Ultralytics |
| Deep Learning | CNN · RNN · Transformers · Visual Transformers · MLP · Decision Trees |
| Analysis | Statistical Analysis · Data Visualization · Pandas · Seaborn · Matplotlib |

**Chip style:** `border: 1px solid rgba(255,255,255,0.12)` + `background: rgba(255,255,255,0.05)` + `border-radius: 9999px` + `padding: 6px 16px`  
**Animazione:** stagger 0.05s per chip, entrata `scale: 0.8 → 1` + `opacity: 0 → 1`

---

### 4. Progetti

**Layout:** griglia 2×2 su desktop, 1 colonna su mobile  
**Card default (chiusa):**
- Numero progetto: `01` — `#2997ff`, font-weight 700, grande
- Titolo progetto
- Tag tecnologie (pill piccole, colore `#2997ff` tenue)
- Freccia `→` in basso a destra
- `background: #111111`, `border: 1px solid rgba(255,255,255,0.08)`
- Hover: `border-color: rgba(255,255,255,0.2)`, leggero lift con `box-shadow`

**Card espansa (click):**
- Espansione inline nel suo slot (NON modal overlay): la card si allarga occupando la riga intera
- Descrizione completa del progetto
- Risultato chiave in evidenza (badge verde/blu): `87% accuracy`, `30% speedup`
- Pulsante chiudi `✕`
- Animazione espansione: Framer Motion `layoutId` per transizione fluida nativa

**I 4 progetti:**
1. `01` Real-Time Object Detection · `Computer Vision · YOLOv11 · RT-DETR · Faster R-CNN`
2. `02` Time-Series Weather Forecast · `GRU/RNN · Seq2Seq · PyTorch · 76 variabili`
3. `03` Image Classification System · `CNN · MLP · 87% accuracy`
4. `04` Maximum Clique Optimization · `Algorithms · Python · 30% speedup`

---

### 5. Contact + Footer

**Contact:**
- Headline centrata: `"Let's connect"` — 48px
- Sottotitolo: `"Aperto a opportunità in AI, Data Science, Cybersecurity"` — `#86868b`
- 4 pill link glassmorphism orizzontali:
  - `✉ ricky.agosti@gmail.com`
  - `📱 +39 3349889929`
  - `in LinkedIn`
  - `⌥ github.com/ricca200xx`
- Cristallo 3D decorativo sullo sfondo, `opacity: 0.15`

**Footer:**
- `© 2026 Riccardo Niccolò Agosti · Built with React & Three.js`
- Testo `#86868b`, font-size 13px, centrato

---

## Effetti Globali

| Effetto | Implementazione |
|---------|-----------------|
| Parallax background | Gradiente radiale che segue scroll `Y` con offset `0.3x` |
| Noise texture | SVG `feTurbulence` filter inline, `opacity: 0.03`, `pointer-events: none` |
| Section entry | `useInView` + Framer Motion `animate` su ogni sezione |
| Scroll progress | `useScroll` di Framer Motion per trasformazioni Crystal |
| Mouse parallax | `useMouseParallax` hook custom, solo desktop |

---

## Navbar

- Posizione: fissa in alto, `backdrop-filter: blur(20px)`, `background: rgba(8,8,8,0.8)`
- Logo: `RA` monogramma in `#f5f5f7`
- Link: `About · Skills · Projects · Contact` — smooth scroll via `href="#section-id"`
- Dot indicator: pallino `#2997ff` che si sposta sulla voce attiva in base allo scroll

---

## Responsive

| Breakpoint | Adattamento |
|------------|-------------|
| Mobile (`< 768px`) | Hero testo ridotto, cristallo più piccolo, About a colonna singola, griglia progetti 1×1 |
| Tablet (`768–1024px`) | About a colonne 50/50, griglia progetti 2×1 |
| Desktop (`> 1024px`) | Layout completo come descritto |

---

## Deployment

- **Build:** `npm run build` → cartella `dist/`
- **Target:** Vercel (drag & drop) o GitHub Pages (con `vite.config.js` base path)
- **Performance:** lazy load del canvas Three.js con `React.lazy` + `Suspense`

---

## Verifica Finale

- [ ] Cristallo 3D visibile e interattivo nella Hero
- [ ] Scroll anima il cristallo (scala + opacity)
- [ ] Tutte le sezioni entrano con animazione al viewport
- [ ] Card progetti si espandono e chiudono correttamente
- [ ] Chip skill animati in stagger
- [ ] Navbar con dot indicator funzionante
- [ ] Responsive su mobile testato
- [ ] Build `npm run build` senza errori
- [ ] Deploy su Vercel funzionante
