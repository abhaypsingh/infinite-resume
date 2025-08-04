import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

export const QuantumSuperposition: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [selectedState, setSelectedState] = useState<number | null>(null)
  
  // Career quantum states
  const quantumStates = [
    { label: "Data Scientist", color: "#8B5CF6", position: [3, 2, 0] },
    { label: "AI Strategist", color: "#3B82F6", position: [-3, 2, 0] },
    { label: "Tech Leader", color: "#10B981", position: [0, -2, 3] },
    { label: "Innovation Pioneer", color: "#F59E0B", position: [0, -2, -3] },
    { label: "Quantum Researcher", color: "#EC4899", position: [2, 0, 2] },
    { label: "Philosophy Technologist", color: "#6366F1", position: [-2, 0, -2] }
  ]
  
  // Wave function visualization
  const waveFunction = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 200
    
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4
      const x = t - Math.PI * 2
      const y = Math.sin(t) * Math.exp(-Math.abs(x) * 0.2) * 3
      const z = Math.cos(t * 0.5) * 2
      
      points.push(new THREE.Vector3(x, y, z))
    }
    
    return points
  }, [])
  
  useFrame((state) => {
    if (groupRef.current && !collapsed) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const handleObservation = (stateIndex: number) => {
    setCollapsed(true)
    setSelectedState(stateIndex)
    
    setTimeout(() => {
      setCollapsed(false)
      setSelectedState(null)
    }, 3000)
  }
  
  return (
    <group ref={groupRef}>
      {/* Wave function */}
      <Line
        points={waveFunction}
        color="#8B5CF6"
        lineWidth={2}
        transparent
        opacity={collapsed ? 0.1 : 0.6}
      />
      
      {/* Quantum states */}
      {quantumStates.map((state, i) => {
        const isSelected = selectedState === i
        const opacity = collapsed ? (isSelected ? 1 : 0.1) : 0.8
        
        return (
          <group key={i}>
            {/* State sphere */}
            <Sphere
              position={state.position as [number, number, number]}
              args={[0.5, 32, 32]}
              onClick={() => handleObservation(i)}
            >
              <meshPhysicalMaterial
                color={state.color}
                emissive={state.color}
                emissiveIntensity={isSelected ? 0.8 : 0.3}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={opacity}
              />
            </Sphere>
            
            {/* State label */}
            <Text
              position={[
                state.position[0],
                state.position[1] + 1,
                state.position[2]
              ]}
              fontSize={0.3}
              color={state.color}
              anchorX="center"
              anchorY="bottom"
              material-transparent
              material-opacity={opacity}
            >
              {state.label}
            </Text>
            
            {/* Probability amplitude waves */}
            {!collapsed && (
              <ProbabilityWave
                position={state.position as [number, number, number]}
                color={state.color}
                amplitude={0.5}
              />
            )}
          </group>
        )
      })}
      
      {/* Schrödinger equation */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.4}
        color="#10B981"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={0.7}
      >
        iℏ ∂|ψ⟩/∂t = Ĥ|ψ⟩
      </Text>
      
      {/* Observer effect message */}
      <Text
        position={[0, -4, 0]}
        fontSize={0.3}
        color="#666"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={collapsed ? 1 : 0.5}
      >
        {collapsed 
          ? `State collapsed to: ${quantumStates[selectedState!].label}`
          : "Click a state to collapse the wave function"
        }
      </Text>
      
      {/* Entanglement connections */}
      {!collapsed && quantumStates.map((state1, i) => 
        quantumStates.slice(i + 1).map((state2, j) => {
          const actualJ = i + j + 1
          return (
            <Line
              key={`${i}-${actualJ}`}
              points={[
                new THREE.Vector3(...state1.position),
                new THREE.Vector3(...state2.position)
              ]}
              color="#8B5CF6"
              lineWidth={1}
              transparent
              opacity={0.1}
              dashed
              dashSize={0.1}
              gapSize={0.2}
            />
          )
        })
      )}
    </group>
  )
}

const ProbabilityWave: React.FC<{
  position: [number, number, number]
  color: string
  amplitude: number
}> = ({ position, color, amplitude }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const scale = 1 + Math.sin(time * 3) * amplitude
      meshRef.current.scale.setScalar(scale)
      meshRef.current.material.opacity = 0.3 * (2 - scale)
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        side={THREE.BackSide}
      />
    </mesh>
  )
}