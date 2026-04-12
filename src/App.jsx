import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Crystal from './three/Crystal'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#080808' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Crystal />
        </Suspense>
      </Canvas>
    </div>
  )
}
