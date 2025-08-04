import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Extrude } from '@react-three/drei'

interface PenroseTriangleProps {
  position?: [number, number, number]
  scale?: number
}

export const PenroseTriangle: React.FC<PenroseTriangleProps> = ({ 
  position = [0, 0, 0], 
  scale = 1 
}) => {
  const groupRef = useRef<THREE.Group>(null)
  
  const shape = React.useMemo(() => {
    const shape = new THREE.Shape()
    const size = 2
    
    // Create the impossible triangle shape
    shape.moveTo(0, size)
    shape.lineTo(-size * 0.866, -size * 0.5)
    shape.lineTo(size * 0.866, -size * 0.5)
    shape.closePath()
    
    // Create inner hole
    const hole = new THREE.Path()
    const innerSize = size * 0.6
    hole.moveTo(0, innerSize)
    hole.lineTo(-innerSize * 0.866, -innerSize * 0.5)
    hole.lineTo(innerSize * 0.866, -innerSize * 0.5)
    hole.closePath()
    
    shape.holes.push(hole)
    
    return shape
  }, [])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.5
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
      
      // Create the impossible illusion effect
      const time = state.clock.elapsedTime
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.z = Math.sin(time + index * Math.PI / 3) * 0.1
        }
      })
    }
  })
  
  const extrudeSettings = {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1
  }
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {[0, 120, 240].map((rotation, index) => (
        <mesh key={index} rotation={[0, 0, (rotation * Math.PI) / 180]}>
          <Extrude args={[shape, extrudeSettings]}>
            <meshPhysicalMaterial
              color={index === 0 ? '#8B5CF6' : index === 1 ? '#3B82F6' : '#10B981'}
              emissive={index === 0 ? '#8B5CF6' : index === 1 ? '#3B82F6' : '#10B981'}
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0}
              transparent
              opacity={0.9}
            />
          </Extrude>
        </mesh>
      ))}
    </group>
  )
}