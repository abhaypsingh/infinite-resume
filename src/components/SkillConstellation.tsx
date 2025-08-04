import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface SkillConstellationProps {
  skills: string[]
}

interface SkillNode {
  skill: string
  position: THREE.Vector3
  connections: number[]
  category: string
  brightness: number
}

export const SkillConstellation: React.FC<SkillConstellationProps> = ({ skills }) => {
  const groupRef = useRef<THREE.Group>(null)
  const starsRef = useRef<THREE.Points>(null)
  
  const skillNodes = useMemo(() => {
    const uniqueSkills = Array.from(new Set(skills))
    const categories = {
      technical: ['Python', 'Machine Learning', 'Big Data', 'Cloud Architecture', 'Real-time Processing', 'Quantum Computing'],
      leadership: ['Leadership', 'Strategic Planning', 'Change Management', 'Stakeholder Management', 'Visionary Leadership'],
      analytical: ['Statistics', 'Research', 'Systems Thinking', 'Data Analytics'],
      creative: ['Innovation', 'Philosophy', 'Technical Writing', 'Public Speaking', 'AI Ethics']
    }
    
    const nodes: SkillNode[] = uniqueSkills.map((skill, i) => {
      let category = 'other'
      for (const [cat, skillList] of Object.entries(categories)) {
        if (skillList.includes(skill)) {
          category = cat
          break
        }
      }
      
      // Position skills in a 3D constellation pattern
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 4
      
      return {
        skill,
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        connections: [],
        category,
        brightness: 0.5 + Math.random() * 0.5
      }
    })
    
    // Create connections between related skills
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j && node.category === otherNode.category) {
          if (node.position.distanceTo(otherNode.position) < 6) {
            node.connections.push(j)
          }
        }
      })
    })
    
    return nodes
  }, [skills])
  
  // Background stars
  const starPositions = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      const i3 = i * 3
      const radius = 20 + Math.random() * 30
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
    
    if (starsRef.current) {
      starsRef.current.rotation.y = -state.clock.elapsedTime * 0.01
    }
  })
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return '#8B5CF6'
      case 'leadership': return '#3B82F6'
      case 'analytical': return '#10B981'
      case 'creative': return '#F59E0B'
      default: return '#6B7280'
    }
  }
  
  return (
    <>
      {/* Background stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          sizeAttenuation
          transparent
          opacity={0.3}
        />
      </points>
      
      <group ref={groupRef}>
        {/* Skill nodes */}
        {skillNodes.map((node, i) => (
          <group key={node.skill} position={node.position}>
            {/* Main star */}
            <Sphere args={[0.2 * node.brightness, 8, 8]}>
              <meshPhysicalMaterial
                color={getCategoryColor(node.category)}
                emissive={getCategoryColor(node.category)}
                emissiveIntensity={node.brightness}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.9}
              />
            </Sphere>
            
            {/* Glow effect */}
            <Sphere args={[0.3 * node.brightness, 8, 8]}>
              <meshBasicMaterial
                color={getCategoryColor(node.category)}
                transparent
                opacity={0.2}
                side={THREE.BackSide}
              />
            </Sphere>
            
            {/* Skill label */}
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="bottom"
              material-transparent
              material-opacity={0.8}
            >
              {node.skill}
            </Text>
            
            {/* Orbiting particles */}
            {[0, 1, 2].map((j) => {
              const orbitRadius = 0.5
              const angle = (j / 3) * Math.PI * 2
              
              return (
                <mesh
                  key={j}
                  position={[
                    Math.cos(angle) * orbitRadius,
                    Math.sin(angle * 1.5) * 0.2,
                    Math.sin(angle) * orbitRadius
                  ]}
                >
                  <sphereGeometry args={[0.05, 6, 6]} />
                  <meshBasicMaterial
                    color={getCategoryColor(node.category)}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              )
            })}
          </group>
        ))}
        
        {/* Constellation lines */}
        {skillNodes.map((node, i) => 
          node.connections.map(j => {
            if (j > i) { // Only draw each connection once
              const targetNode = skillNodes[j]
              return (
                <Line
                  key={`${i}-${j}`}
                  points={[node.position, targetNode.position]}
                  color={getCategoryColor(node.category)}
                  lineWidth={1}
                  transparent
                  opacity={0.2}
                  dashed
                  dashSize={0.5}
                  gapSize={0.5}
                />
              )
            }
            return null
          })
        )}
        
        {/* Category labels floating in space */}
        {Object.entries({
          technical: { position: [10, 5, 0], label: 'Technical Mastery' },
          leadership: { position: [-10, 5, 0], label: 'Leadership Excellence' },
          analytical: { position: [0, 5, 10], label: 'Analytical Prowess' },
          creative: { position: [0, 5, -10], label: 'Creative Innovation' }
        }).map(([category, { position, label }]) => (
          <Text
            key={category}
            position={position as [number, number, number]}
            fontSize={0.6}
            color={getCategoryColor(category)}
            anchorX="center"
            anchorY="middle"
            material-transparent
            material-opacity={0.5}
          >
            {label}
          </Text>
        ))}
        
        {/* Central nexus */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#8B5CF6"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </>
  )
}