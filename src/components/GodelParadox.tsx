import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Line, Torus } from '@react-three/drei'
import * as THREE from 'three'

export const GodelParadox: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const textRefs = useRef<THREE.Mesh[]>([])
  
  // Gödel's famous statement: "This statement cannot be proved"
  const paradoxicalStatements = [
    "This statement",
    "cannot be",
    "proved within",
    "this system"
  ]
  
  const selfReferenceLoop = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 100
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const angle = t * Math.PI * 2
      const radius = 4
      
      // Create a twisted loop
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle * 2) * 1
      const z = Math.sin(angle) * radius
      
      points.push(new THREE.Vector3(x, y, z))
    }
    
    return points
  }, [])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
    
    // Animate text opacity to create "incompleteness" effect
    textRefs.current.forEach((ref, i) => {
      if (ref) {
        const time = state.clock.elapsedTime
        ref.material.opacity = 0.5 + Math.sin(time * 2 + i * 0.5) * 0.5
      }
    })
  })
  
  return (
    <group ref={groupRef}>
      {/* Self-referential loop */}
      <Line
        points={selfReferenceLoop}
        color="#8B5CF6"
        lineWidth={3}
        transparent
        opacity={0.6}
      />
      
      {/* Paradoxical statements floating in space */}
      {paradoxicalStatements.map((statement, i) => {
        const angle = (i / paradoxicalStatements.length) * Math.PI * 2
        const radius = 3
        
        return (
          <group key={i}>
            <Text
              ref={(el) => {
                if (el) textRefs.current[i] = el
              }}
              position={[
                Math.cos(angle) * radius,
                Math.sin(i * 0.5) * 2,
                Math.sin(angle) * radius
              ]}
              fontSize={0.5}
              color="#8B5CF6"
              anchorX="center"
              anchorY="middle"
              material-transparent
            >
              {statement}
            </Text>
            
            {/* Connection lines to next statement */}
            <Line
              points={[
                new THREE.Vector3(
                  Math.cos(angle) * radius,
                  Math.sin(i * 0.5) * 2,
                  Math.sin(angle) * radius
                ),
                new THREE.Vector3(
                  Math.cos(((i + 1) % 4 / 4) * Math.PI * 2) * radius,
                  Math.sin(((i + 1) % 4) * 0.5) * 2,
                  Math.sin(((i + 1) % 4 / 4) * Math.PI * 2) * radius
                )
              ]}
              color="#3B82F6"
              lineWidth={1}
              transparent
              opacity={0.3}
              dashed
              dashSize={0.1}
              gapSize={0.1}
            />
          </group>
        )
      })}
      
      {/* Central incompleteness symbol */}
      <mesh position={[0, 0, 0]}>
        <torusKnotGeometry args={[1, 0.3, 100, 16, 2, 3]} />
        <meshPhysicalMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Axioms floating around */}
      {[0, 1, 2, 3, 4].map((i) => {
        const phi = Math.acos(-1 + (2 * i) / 5)
        const theta = Math.sqrt(5 * Math.PI) * i
        const radius = 6
        
        return (
          <Box
            key={i}
            position={[
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.sin(phi) * Math.sin(theta),
              radius * Math.cos(phi)
            ]}
            args={[0.5, 0.5, 0.5]}
          >
            <meshPhysicalMaterial
              color="#3B82F6"
              emissive="#3B82F6"
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.6}
            />
          </Box>
        )
      })}
      
      {/* Mathematical notation */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.3}
        color="#10B981"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={0.7}
      >
        G ⊢ ¬Prov(⌜G⌝)
      </Text>
      
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.2}
        color="#666"
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={0.5}
      >
        "I am not provable"
      </Text>
    </group>
  )
}