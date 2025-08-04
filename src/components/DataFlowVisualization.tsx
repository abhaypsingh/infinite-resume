import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances, Line, Text } from '@react-three/drei'
import * as THREE from 'three'

interface DataFlowVisualizationProps {
  data: any[]
}

interface DataParticle {
  id: number
  position: THREE.Vector3
  velocity: THREE.Vector3
  color: THREE.Color
  size: number
  life: number
  path: THREE.Vector3[]
}

export const DataFlowVisualization: React.FC<DataFlowVisualizationProps> = ({ data }) => {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<DataParticle[]>([])
  const time = useRef(0)
  
  // Create flow paths based on data connections
  const flowPaths = useMemo(() => {
    const paths: THREE.Vector3[][] = []
    
    data.forEach((node, i) => {
      const startAngle = (i / data.length) * Math.PI * 2
      const startRadius = 10
      const start = new THREE.Vector3(
        Math.cos(startAngle) * startRadius,
        0,
        Math.sin(startAngle) * startRadius
      )
      
      node.connections.forEach((targetId: string) => {
        const targetIndex = data.findIndex(n => n.id === targetId)
        if (targetIndex !== -1) {
          const endAngle = (targetIndex / data.length) * Math.PI * 2
          const end = new THREE.Vector3(
            Math.cos(endAngle) * startRadius,
            0,
            Math.sin(endAngle) * startRadius
          )
          
          // Create curved path
          const controlPoint1 = new THREE.Vector3(
            start.x * 0.5,
            5 + Math.random() * 5,
            start.z * 0.5
          )
          const controlPoint2 = new THREE.Vector3(
            end.x * 0.5,
            5 + Math.random() * 5,
            end.z * 0.5
          )
          
          const curve = new THREE.CubicBezierCurve3(start, controlPoint1, controlPoint2, end)
          paths.push(curve.getPoints(50))
        }
      })
    })
    
    return paths
  }, [data])
  
  // Initialize particles
  useMemo(() => {
    particlesRef.current = []
    for (let i = 0; i < 200; i++) {
      const pathIndex = Math.floor(Math.random() * flowPaths.length)
      const path = flowPaths[pathIndex] || flowPaths[0]
      
      particlesRef.current.push({
        id: i,
        position: path[0].clone(),
        velocity: new THREE.Vector3(),
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.5),
        size: Math.random() * 0.3 + 0.1,
        life: Math.random(),
        path: path
      })
    }
  }, [flowPaths])
  
  useFrame((state, delta) => {
    time.current += delta
    
    // Update particles
    particlesRef.current.forEach((particle) => {
      particle.life += delta * 0.5
      
      if (particle.life >= 1) {
        particle.life = 0
        const pathIndex = Math.floor(Math.random() * flowPaths.length)
        particle.path = flowPaths[pathIndex] || flowPaths[0]
      }
      
      // Move along path
      const pathPosition = Math.min(particle.life, 0.999)
      const pointIndex = Math.floor(pathPosition * (particle.path.length - 1))
      const nextIndex = Math.min(pointIndex + 1, particle.path.length - 1)
      const localT = (pathPosition * (particle.path.length - 1)) % 1
      
      particle.position.lerpVectors(
        particle.path[pointIndex],
        particle.path[nextIndex],
        localT
      )
      
      // Add some noise
      particle.position.x += Math.sin(time.current + particle.id) * 0.02
      particle.position.y += Math.cos(time.current + particle.id * 0.7) * 0.02
      particle.position.z += Math.sin(time.current + particle.id * 1.3) * 0.02
    })
    
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Data nodes */}
      {data.map((node, i) => {
        const angle = (i / data.length) * Math.PI * 2
        const radius = 10
        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
        
        return (
          <group key={node.id} position={position}>
            <mesh>
              <cylinderGeometry args={[1, 1, 0.5, 6]} />
              <meshPhysicalMaterial
                color={
                  node.type === 'role' ? '#8B5CF6' :
                  node.type === 'project' ? '#3B82F6' :
                  node.type === 'achievement' ? '#10B981' :
                  '#F59E0B'
                }
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                clearcoatRoughness={0}
                emissive={
                  node.type === 'role' ? '#8B5CF6' :
                  node.type === 'project' ? '#3B82F6' :
                  node.type === 'achievement' ? '#10B981' :
                  '#F59E0B'
                }
                emissiveIntensity={0.3}
              />
            </mesh>
            
            <Text
              position={[0, 2, 0]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="bottom"
            >
              {node.title}
            </Text>
            
            {/* Rotating ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.5, 0.1, 8, 20]} />
              <meshBasicMaterial
                color={node.type === 'role' ? '#8B5CF6' : '#3B82F6'}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        )
      })}
      
      {/* Flow paths */}
      {flowPaths.map((path, i) => (
        <Line
          key={i}
          points={path}
          color="#8B5CF6"
          lineWidth={1}
          transparent
          opacity={0.1}
          dashed
          dashSize={0.5}
          gapSize={0.5}
        />
      ))}
      
      {/* Particle system */}
      <Instances limit={200}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#8B5CF6"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
          roughness={0}
          metalness={0}
        />
        {particlesRef.current.map((particle) => (
          <Instance
            key={particle.id}
            position={particle.position}
            scale={particle.size}
            color={particle.color}
          />
        ))}
      </Instances>
      
      {/* Central data core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 1]} />
        <meshPhysicalMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Floating data labels */}
      <group>
        {['AI Strategy', 'Data Science', 'Leadership', 'Innovation'].map((label, i) => {
          const angle = (i / 4) * Math.PI * 2
          const radius = 15
          
          return (
            <Text
              key={label}
              position={[
                Math.cos(angle) * radius,
                Math.sin(time.current * 0.5 + i) * 2,
                Math.sin(angle) * radius
              ]}
              fontSize={0.8}
              color="#666"
              anchorX="center"
              anchorY="middle"
              material-transparent
              material-opacity={0.5}
            >
              {label}
            </Text>
          )
        })}
      </group>
    </group>
  )
}