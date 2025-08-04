import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Circle, Text } from '@react-three/drei'
import * as THREE from 'three'

interface BuddhistMandalaProps {
  enlightenmentLevel: number
}

export const BuddhistMandala: React.FC<BuddhistMandalaProps> = ({ enlightenmentLevel }) => {
  const groupRef = useRef<THREE.Group>(null)
  const petalRefs = useRef<THREE.Group[]>([])
  
  // Create mandala geometry
  const mandalaLayers = useMemo(() => {
    const layers = []
    const layerCount = 5
    
    for (let layer = 0; layer < layerCount; layer++) {
      const radius = (layer + 1) * 1.5
      const petalCount = 8 + layer * 4
      const petals = []
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        petals.push({ x, z, angle })
      }
      
      layers.push({ radius, petals })
    }
    
    return layers
  }, [])
  
  // Buddhist concepts
  const eightfoldPath = [
    "Right Understanding", "Right Thought", "Right Speech", "Right Action",
    "Right Livelihood", "Right Effort", "Right Mindfulness", "Right Concentration"
  ]
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation based on enlightenment
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 * enlightenmentLevel
    }
    
    // Pulsing petals
    petalRefs.current.forEach((ref, i) => {
      if (ref) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i * 0.2) * 0.1
        ref.scale.setScalar(scale * enlightenmentLevel)
      }
    })
  })
  
  return (
    <group ref={groupRef}>
      {/* Central Om symbol */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={1}
        color="#F59E0B"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={enlightenmentLevel}
      >
        ॐ
      </Text>
      
      {/* Mandala layers */}
      {mandalaLayers.map((layer, layerIndex) => (
        <group key={layerIndex}>
          {/* Circle for this layer */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry 
              args={[layer.radius - 0.1, layer.radius + 0.1, 64]} 
            />
            <meshBasicMaterial
              color={layerIndex % 2 === 0 ? '#8B5CF6' : '#3B82F6'}
              transparent
              opacity={0.3 * enlightenmentLevel}
            />
          </mesh>
          
          {/* Petals */}
          {layer.petals.map((petal, i) => (
            <group
              key={i}
              ref={(el) => {
                if (el && layerIndex === 0) petalRefs.current[i] = el
              }}
              position={[petal.x, 0, petal.z]}
              rotation={[0, petal.angle, 0]}
            >
              <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshPhysicalMaterial
                  color={
                    layerIndex === 0 ? '#F59E0B' :
                    layerIndex === 1 ? '#10B981' :
                    layerIndex === 2 ? '#8B5CF6' :
                    layerIndex === 3 ? '#3B82F6' :
                    '#EC4899'
                  }
                  emissive={
                    layerIndex === 0 ? '#F59E0B' :
                    layerIndex === 1 ? '#10B981' :
                    layerIndex === 2 ? '#8B5CF6' :
                    layerIndex === 3 ? '#3B82F6' :
                    '#EC4899'
                  }
                  emissiveIntensity={0.5 * enlightenmentLevel}
                  metalness={0.8}
                  roughness={0.2}
                  transparent
                  opacity={0.8 * enlightenmentLevel}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      
      {/* Eightfold Path */}
      {eightfoldPath.map((path, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 6
        
        return (
          <Text
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.5,
              Math.sin(angle) * radius
            ]}
            fontSize={0.3}
            color="#10B981"
            anchorX="center"
            anchorY="middle"
            rotation={[0, -angle + Math.PI / 2, 0]}
            material-transparent
            material-opacity={enlightenmentLevel * 0.7}
          >
            {path}
          </Text>
        )
      })}
      
      {/* Impermanence particles */}
      <ImpermanenceParticles enlightenmentLevel={enlightenmentLevel} />
      
      {/* Sanskrit text */}
      <Text
        position={[0, -4, 0]}
        fontSize={0.4}
        color="#F59E0B"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={enlightenmentLevel * 0.8}
      >
        सर्वं अनित्यं
      </Text>
      
      <Text
        position={[0, -4.5, 0]}
        fontSize={0.2}
        color="#666"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={enlightenmentLevel * 0.6}
      >
        "All is impermanent"
      </Text>
    </group>
  )
}

const ImpermanenceParticles: React.FC<{ enlightenmentLevel: number }> = ({ enlightenmentLevel }) => {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 8
      const height = (Math.random() - 0.5) * 4
      
      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = height
      positions[i3 + 2] = Math.sin(angle) * radius
      
      const color = new THREE.Color()
      color.setHSL(0.1 + Math.random() * 0.3, 0.8, 0.5)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return { positions, colors }
  }, [])
  
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const positions = particlesRef.current.geometry.attributes.position
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      
      // Particles dissolve and reform
      const dissolve = (Math.sin(time * 0.5 + i * 0.1) + 1) * 0.5
      positions.setY(i, y + Math.sin(time + i) * 0.01)
      
      // Rotate around center
      const angle = Math.atan2(z, x) + time * 0.02
      const radius = Math.sqrt(x * x + z * z)
      positions.setX(i, Math.cos(angle) * radius)
      positions.setZ(i, Math.sin(angle) * radius)
    }
    
    positions.needsUpdate = true
    particlesRef.current.material.opacity = enlightenmentLevel * 0.5
  })
  
  return (
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
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}