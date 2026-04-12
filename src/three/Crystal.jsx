// src/three/Crystal.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment } from '@react-three/drei'
import { useMouseParallax } from '../hooks/useMouseParallax'

export default function Crystal({ scale = 1, secondary = false }) {
  const meshRef = useRef()
  const mouseOffset = useMouseParallax(secondary ? 0 : 0.15)

  useFrame(() => {
    if (!meshRef.current) return
    const speed = secondary ? 0.002 : 0.003
    meshRef.current.rotation.y += speed
    meshRef.current.rotation.x += speed * 0.3

    if (!secondary) {
      meshRef.current.rotation.y += mouseOffset.x * 0.05
      meshRef.current.rotation.x += mouseOffset.y * 0.05
    }
  })

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#2997ff" />

      <mesh ref={meshRef} scale={scale}>
        <torusKnotGeometry args={[0.8, 0.25, 100, 16]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.1}
          thickness={0.5}
          ior={1.4}
          chromaticAberration={0.06}
          color={secondary ? '#1a1a2e' : '#ffffff'}
          backside={true}
          backsideThickness={0.3}
          envMapIntensity={1.5}
        />
      </mesh>
    </>
  )
}
