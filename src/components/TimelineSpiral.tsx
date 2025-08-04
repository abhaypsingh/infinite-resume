import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const FloatingText: React.FC<{
  position: [number, number, number]
  text: string
  index: number
}> = ({ position, text, index }) => {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5
    }
  })
  
  return (
    <group ref={ref} position={position}>
      <Text
        fontSize={0.2}
        color="#444"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  )
}

interface TimelineSpiralProps {
  data: any[]
  onNodeSelect: (node: any) => void
}

export const TimelineSpiral: React.FC<TimelineSpiralProps> = ({ data, onNodeSelect }) => {
  const groupRef = useRef<THREE.Group>(null)
  
  const spiralPoints = useMemo(() => {
    const points: THREE.Vector3[] = []
    const nodePositions: { position: THREE.Vector3, node: any }[] = []
    
    const turns = 3
    const pointsPerTurn = 100
    const totalPoints = turns * pointsPerTurn
    const radius = 8
    const height = 15
    const startYear = Math.min(...data.map(d => d.year))
    const endYear = Math.max(...data.map(d => d.year))
    const yearRange = endYear - startYear
    
    // Generate spiral
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints
      const angle = t * Math.PI * 2 * turns
      const r = radius * (1 - t * 0.5) // Spiral inward
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const y = -height / 2 + t * height
      
      points.push(new THREE.Vector3(x, y, z))
    }
    
    // Position nodes along spiral
    data.forEach(node => {
      const yearProgress = (node.year - startYear) / yearRange
      const index = Math.floor(yearProgress * totalPoints)
      const t = index / totalPoints
      const angle = t * Math.PI * 2 * turns
      const r = radius * (1 - t * 0.5)
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const y = -height / 2 + t * height
      
      nodePositions.push({
        position: new THREE.Vector3(x, y, z),
        node
      })
    })
    
    return { points, nodePositions }
  }, [data])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const handleNodeClick = (node: any) => {
    onNodeSelect(node)
  }
  
  return (
    <group ref={groupRef}>
      {/* Spiral line */}
      <Line
        points={spiralPoints.points}
        color="#8B5CF6"
        lineWidth={2}
        transparent
        opacity={0.3}
      />
      
      {/* Time markers */}
      {[2018, 2020, 2022, 2024].map((year, index) => {
        const progress = (year - 2018) / 6
        const angle = progress * Math.PI * 2 * 3
        const r = 8 * (1 - progress * 0.5)
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        const y = -7.5 + progress * 15
        
        return (
          <Text
            key={year}
            position={[x * 1.2, y, z * 1.2]}
            fontSize={0.5}
            color="#666"
            anchorX="center"
            anchorY="middle"
          >
            {year}
          </Text>
        )
      })}
      
      {/* Nodes */}
      {spiralPoints.nodePositions.map(({ position, node }, index) => (
        <group key={node.id} position={position}>
          <Sphere
            args={[Math.sqrt(node.impact) * 0.05, 16, 16]}
            onClick={() => handleNodeClick(node)}
          >
            <meshPhysicalMaterial
              color={
                node.type === 'role' ? '#8B5CF6' :
                node.type === 'project' ? '#3B82F6' :
                node.type === 'achievement' ? '#10B981' :
                '#F59E0B'
              }
              emissive={
                node.type === 'role' ? '#8B5CF6' :
                node.type === 'project' ? '#3B82F6' :
                node.type === 'achievement' ? '#10B981' :
                '#F59E0B'
              }
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </Sphere>
          
          <Text
            position={[0, Math.sqrt(node.impact) * 0.1 + 0.3, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {node.title}
          </Text>
          
          {/* Connections */}
          {node.connections.map((targetId: string) => {
            const targetNode = spiralPoints.nodePositions.find(n => n.node.id === targetId)
            if (!targetNode) return null
            
            const points = [
              position,
              new THREE.Vector3(
                (position.x + targetNode.position.x) / 2,
                (position.y + targetNode.position.y) / 2 + 1,
                (position.z + targetNode.position.z) / 2
              ),
              targetNode.position
            ]
            
            return (
              <Line
                key={`${node.id}-${targetId}`}
                points={points}
                color="#8B5CF6"
                lineWidth={1}
                transparent
                opacity={0.2}
              />
            )
          })}
        </group>
      ))}
      
      {/* Floating year indicators */}
      {data.map((node, index) => {
        const angle = (index / data.length) * Math.PI * 2
        const radius = 12
        
        return (
          <FloatingText
            key={`float-${node.id}`}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
            text={node.year.toString()}
            index={index}
          />
        )
      })}
    </group>
  )
}