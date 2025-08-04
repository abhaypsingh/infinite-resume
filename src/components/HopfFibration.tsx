import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HopfFibrationProps {
  position?: [number, number, number]
  scale?: number
}

export const HopfFibration: React.FC<HopfFibrationProps> = ({ 
  position = [0, 0, 0], 
  scale = 1 
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const fibersRef = useRef<THREE.Group>(null)

  // Generate Hopf fibration fibers
  const fibers = useMemo(() => {
    const fibers: THREE.BufferGeometry[] = []
    const numFibers = 24
    const pointsPerFiber = 128

    for (let i = 0; i < numFibers; i++) {
      const phi = (i / numFibers) * Math.PI * 2
      const fiberPoints: THREE.Vector3[] = []

      for (let j = 0; j < pointsPerFiber; j++) {
        const t = (j / (pointsPerFiber - 1)) * Math.PI * 2
        
        // Hopf fibration parametrization (stereographic projection from S3 to R3)
        const eta = Math.PI / 4 // Base point parameter
        
        // Calculate quaternion coordinates
        const q0 = Math.cos(eta) * Math.cos(t / 2)
        const q1 = Math.cos(eta) * Math.sin(t / 2)
        const q2 = Math.sin(eta) * Math.cos(phi + t / 2)
        const q3 = Math.sin(eta) * Math.sin(phi + t / 2)
        
        // Stereographic projection to R3
        const denom = 1 - q3
        const x = q0 / denom
        const y = q1 / denom
        const z = q2 / denom
        
        // Scale and constrain to reasonable bounds
        const scale = 2
        const maxRadius = 5
        const radius = Math.sqrt(x * x + y * y + z * z)
        
        if (radius < maxRadius) {
          fiberPoints.push(new THREE.Vector3(x * scale, y * scale, z * scale))
        }
      }

      // Create geometry from points
      const geometry = new THREE.BufferGeometry().setFromPoints(fiberPoints)
      fibers.push(geometry)
    }

    return fibers
  }, [])

  // Create torus base (representing S3 base space)
  const torusGeometry = useMemo(() => {
    return new THREE.TorusGeometry(2, 0.8, 32, 64)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    // Rotate the entire structure
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1

    if (fibersRef.current) {
      // Animate individual fibers
      fibersRef.current.children.forEach((fiber, idx) => {
        const phase = (idx / fibersRef.current.children.length) * Math.PI * 2
        fiber.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.2
      })
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Base torus representing the base space */}
      <mesh geometry={torusGeometry}>
        <meshPhysicalMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.1}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hopf fibers */}
      <group ref={fibersRef}>
        {fibers.map((geometry, idx) => {
          const hue = idx / fibers.length
          const color = new THREE.Color().setHSL(hue * 0.8 + 0.5, 0.8, 0.6)
          
          return (
            <line key={idx} geometry={geometry}>
              <lineBasicMaterial
                color={color}
                transparent
                opacity={0.6}
                linewidth={2}
              />
            </line>
          )
        })}
      </group>

      {/* Central sphere (representing a point in S2) */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {/* Orbiting points showing fiber structure */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 3,
              Math.sin(angle * 2),
              Math.sin(angle) * 3
            ]}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#FAFAFA" />
          </mesh>
        )
      })}
    </group>
  )
}