import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus, Float } from '@react-three/drei'
import * as THREE from 'three'

interface FlowStateVisualizerProps {
  flowLevel: number
}

// Animated ring component
const AnimatedRing: React.FC<{ ring: number; flowLevel: number }> = ({ ring, flowLevel }) => {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * (0.2 * ring)
    }
  })
  
  return (
    <Torus
      ref={ref}
      args={[2 + ring, 0.1, 16, 50]}
      rotation={[Math.PI / 2 + ring * 0.3, 0, 0]}
    >
      <meshBasicMaterial
        color={flowLevel < 0.5 ? '#8B5CF6' : '#10B981'}
        transparent
        opacity={flowLevel * 0.3}
        wireframe
      />
    </Torus>
  )
}

export const FlowStateVisualizer: React.FC<FlowStateVisualizerProps> = ({ flowLevel }) => {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  // Create flow particles
  const particles = useMemo(() => {
    const count = 1000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Create swirling particle field
      const angle = (i / count) * Math.PI * 2 * 10
      const radius = Math.random() * 5 + 1
      const height = (i / count - 0.5) * 10
      
      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = height
      positions[i3 + 2] = Math.sin(angle) * radius
      
      // Color based on flow state
      const hue = 0.7 - flowLevel * 0.4 // Purple to green
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5 + flowLevel * 0.3)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      sizes[i] = Math.random() * 0.5 + 0.5
    }
    
    return { positions, colors, sizes }
  }, [flowLevel])
  
  useFrame((state) => {
    if (!groupRef.current || !particlesRef.current) return
    
    // Rotate based on flow state
    groupRef.current.rotation.y = state.clock.elapsedTime * (0.1 + flowLevel * 0.3)
    
    // Update particle positions for flow effect
    const positions = particlesRef.current.geometry.attributes.position
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      
      // Create spiraling flow
      const angle = Math.atan2(z, x) + time * flowLevel
      const radius = Math.sqrt(x * x + z * z)
      
      positions.setX(i, Math.cos(angle) * radius)
      positions.setZ(i, Math.sin(angle) * radius)
      positions.setY(i, y + Math.sin(time + i * 0.01) * 0.02 * flowLevel)
    }
    
    positions.needsUpdate = true
  })
  
  return (
    <group ref={groupRef}>
      {/* Central flow core */}
      <Float
        speed={2 + flowLevel * 3}
        rotationIntensity={flowLevel}
        floatIntensity={flowLevel * 2}
      >
        <Sphere args={[1, 32, 32]}>
          <meshPhysicalMaterial
            color={flowLevel < 0.3 ? '#6B7280' : flowLevel < 0.7 ? '#8B5CF6' : '#10B981'}
            emissive={flowLevel < 0.3 ? '#6B7280' : flowLevel < 0.7 ? '#8B5CF6' : '#10B981'}
            emissiveIntensity={flowLevel}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0}
            transparent
            opacity={0.6 + flowLevel * 0.4}
          />
        </Sphere>
      </Float>
      
      {/* Flow rings */}
      {[1, 2, 3].map((ring) => (
        <AnimatedRing key={ring} ring={ring} flowLevel={flowLevel} />
      ))}
      
      {/* Flow particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.1}
          sizeAttenuation
          transparent
          opacity={flowLevel}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Energy field */}
      <mesh scale={[8, 8, 8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={flowLevel * 0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}