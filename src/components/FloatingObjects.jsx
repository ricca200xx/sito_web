import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════
   FloatingObjects — 10 wireframe 3D geometrie flottanti
   ──────────────────────────────────────────────────────────
   • Rotazione accelera con lo scroll (scrollRef)
   • Float sinusoidale autonomo sull'asse Y
   • Z-drift: gli oggetti si avvicinano/allontanano con scroll
   • Ogni oggetto: EdgesGeometry (wireframe netto) + LineBasicMaterial
   • Canvas R3F con alpha:true sovrapposto al VideoBackground
═══════════════════════════════════════════════════════════ */

/* ── geometrie disponibili ── */
const makeGeo = (type, args) => {
  switch (type) {
    case 'icosahedron':  return new THREE.IcosahedronGeometry(...args)
    case 'torus':        return new THREE.TorusGeometry(...args)
    case 'octahedron':   return new THREE.OctahedronGeometry(...args)
    case 'torusKnot':    return new THREE.TorusKnotGeometry(...args)
    case 'dodecahedron': return new THREE.DodecahedronGeometry(...args)
    case 'tetrahedron':  return new THREE.TetrahedronGeometry(...args)
    default:             return new THREE.IcosahedronGeometry(1, 1)
  }
}

/* ── shape definition list ── */
const SHAPES = [
  // primo piano sinistra
  { type: 'icosahedron', args: [1.2, 1], pos: [-6.5,  3.0, -2.0], rot: [0.30, 0.50, 0.00], col: '#2997ff', opa: 0.22 },
  // primo piano destra
  { type: 'torus',       args: [1.0, 0.32, 8, 24],  pos: [ 6.2,  2.5, -1.0], rot: [0.40, 0.28, 0.10], col: '#2997ff', opa: 0.20 },
  // medio sinistra basso
  { type: 'octahedron',  args: [0.9, 0],             pos: [-5.0, -2.5,  0.0], rot: [0.50, 0.40, 0.20], col: '#5bbfff', opa: 0.26 },
  // medio destra basso
  { type: 'icosahedron', args: [1.0, 0],             pos: [ 5.5, -3.0,  1.0], rot: [0.28, 0.58, 0.00], col: '#2997ff', opa: 0.28 },
  // nodo toro — lontano sinistra
  { type: 'torusKnot',   args: [0.55, 0.18, 80, 16], pos: [-7.5,  0.5, -3.0], rot: [0.35, 0.25, 0.15], col: '#1a6fd4', opa: 0.17 },
  // ottaedro grande — lontano destra in alto
  { type: 'octahedron',  args: [1.5, 0],             pos: [ 4.5,  4.5, -4.0], rot: [0.20, 0.50, 0.30], col: '#1a7fff', opa: 0.13 },
  // dodecaedro bg sinistra
  { type: 'dodecahedron',args: [2.0, 0],             pos: [-3.0, -5.0, -5.0], rot: [0.15, 0.30, 0.10], col: '#0d3d7a', opa: 0.11 },
  // icosaedro bg destra
  { type: 'icosahedron', args: [2.2, 1],             pos: [ 3.5, -4.0, -6.0], rot: [0.10, 0.20, 0.15], col: '#0d3d7a', opa: 0.09 },
  // toro piccolo alto centro
  { type: 'torus',       args: [0.65, 0.22, 6, 18],  pos: [ 0.5,  5.5, -2.0], rot: [0.60, 0.20, 0.05], col: '#2997ff', opa: 0.18 },
  // tetraedro basso centro
  { type: 'tetrahedron', args: [1.0, 0],             pos: [-1.0, -6.0,  0.0], rot: [0.42, 0.35, 0.22], col: '#5bbfff', opa: 0.22 },
]

/* ── componente per ogni oggetto ── */
function WireShape({ type, args, position, rotSpeed, color, opacity, scrollRef }) {
  const groupRef = useRef()
  const basePos  = useRef([...position])

  /* build LineSegments una volta sola con useMemo */
  const lineObj = useMemo(() => {
    const base  = makeGeo(type, args)
    const edges = new THREE.EdgesGeometry(base)
    base.dispose()                            // il base non serve più
    const mat   = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      depthWrite: false,
    })
    return new THREE.LineSegments(edges, mat)
  }, []) // eslint-disable-line

  /* dispose su unmount */
  useEffect(() => {
    return () => {
      lineObj.geometry.dispose()
      lineObj.material.dispose()
    }
  }, [lineObj])

  useFrame((_, dt) => {
    const g = groupRef.current
    if (!g) return
    const s = scrollRef.current

    /* rotazione accelera proporzionalmente allo scroll */
    g.rotation.x += dt * rotSpeed[0] * (1.0 + s * 2.2)
    g.rotation.y += dt * rotSpeed[1] * (1.0 + s * 1.7)
    if (rotSpeed[2]) g.rotation.z += dt * rotSpeed[2] * (1.0 + s)

    /* float autonomo sull'asse Y */
    const now     = Date.now() * 0.00065
    const targetY = basePos.current[1] + Math.sin(now + basePos.current[0] * 1.3) * 0.55
    g.position.y += (targetY - g.position.y) * 0.018

    /* Z-drift verso la camera sullo scroll */
    const targetZ = basePos.current[2] - s * 1.8
    g.position.z += (targetZ - g.position.z) * 0.04
  })

  return (
    <group ref={groupRef} position={position}>
      <primitive object={lineObj} />
    </group>
  )
}

/* ── scena R3F ── */
function Scene({ scrollRef }) {
  return (
    <>
      {SHAPES.map((s, i) => (
        <WireShape
          key={i}
          type={s.type}
          args={s.args}
          position={s.pos}
          rotSpeed={s.rot}
          color={s.col}
          opacity={s.opa}
          scrollRef={scrollRef}
        />
      ))}
    </>
  )
}

/* ── export principale ── */
export default function FloatingObjects() {
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null
  const scrollRef = useRef(0)

  useEffect(() => {
    const handler = () => {
      scrollRef.current = clamp(
        window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
        0, 1
      )
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset:    0,
      width:    '100vw',
      height:   '100vh',
      zIndex:   1,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}               // max 1.5× pixel ratio — bilancia qualità/perf
        frameloop="always"
      >
        <Scene scrollRef={scrollRef} />
      </Canvas>
    </div>
  )
}

const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
