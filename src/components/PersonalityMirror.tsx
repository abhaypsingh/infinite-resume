import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'

interface PersonalityProfile {
  curiosity: number
  analytical: number
  creative: number
  ambitious: number
  collaborative: number
}

interface PersonalityMirrorProps {
  profile: PersonalityProfile
}

export const PersonalityMirror: React.FC<PersonalityMirrorProps> = ({ profile }) => {
  const groupRef = useRef<THREE.Group>(null)
  
  const traits = Object.entries(profile)
  const angleStep = (Math.PI * 2) / traits.length
  
  // Create radar chart points
  const radarPoints = traits.map(([trait, value], index) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = value * 3
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    )
  })
  
  // Close the shape
  radarPoints.push(radarPoints[0].clone())
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* Radar grid */}
      {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
        <group key={scale}>
          <Line
            points={traits.map(([_, __], index) => {
              const angle = index * angleStep - Math.PI / 2
              return new THREE.Vector3(
                Math.cos(angle) * scale * 3,
                Math.sin(angle) * scale * 3,
                0
              )
            }).concat([
              new THREE.Vector3(
                Math.cos(-Math.PI / 2) * scale * 3,
                Math.sin(-Math.PI / 2) * scale * 3,
                0
              )
            ])}
            color="#444"
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        </group>
      ))}
      
      {/* Trait lines */}
      {traits.map(([trait, value], index) => {
        const angle = index * angleStep - Math.PI / 2
        const endPoint = new THREE.Vector3(
          Math.cos(angle) * 3,
          Math.sin(angle) * 3,
          0
        )
        
        return (
          <group key={trait}>
            <Line
              points={[new THREE.Vector3(0, 0, 0), endPoint]}
              color="#666"
              lineWidth={1}
              transparent
              opacity={0.5}
            />
            
            <Text
              position={[
                Math.cos(angle) * 3.5,
                Math.sin(angle) * 3.5,
                0
              ]}
              fontSize={0.3}
              color="#999"
              anchorX="center"
              anchorY="middle"
            >
              {trait.charAt(0).toUpperCase() + trait.slice(1)}
            </Text>
            
            <Text
              position={[
                Math.cos(angle) * 4,
                Math.sin(angle) * 4,
                0
              ]}
              fontSize={0.2}
              color="#10B981"
              anchorX="center"
              anchorY="middle"
            >
              {(value * 100).toFixed(0)}%
            </Text>
          </group>
        )
      })}
      
      {/* Personality shape */}
      <Line
        points={radarPoints}
        color="#8B5CF6"
        lineWidth={3}
        transparent
        opacity={0.8}
      />
      
      {/* Filled area */}
      <mesh>
        <shapeGeometry args={[new THREE.Shape(radarPoints.map(p => new THREE.Vector2(p.x, p.y)))]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Value dots */}
      {radarPoints.slice(0, -1).map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshPhysicalMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Center text */}
      <Text
        position={[0, -4, 0]}
        fontSize={0.4}
        color="#666"
        anchorX="center"
        anchorY="middle"
      >
        Your Data DNA
      </Text>
    </group>
  )
}