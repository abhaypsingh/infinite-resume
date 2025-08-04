import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FractalTreeProps {
  position?: [number, number, number]
  scale?: number
  depth?: number
}

interface Branch {
  start: THREE.Vector3
  end: THREE.Vector3
  level: number
}

export const FractalTree: React.FC<FractalTreeProps> = ({ 
  position = [0, 0, 0], 
  scale = 1,
  depth = 7
}) => {
  const groupRef = useRef<THREE.Group>(null)
  
  const branches = useMemo(() => {
    const branches: Branch[] = []
    const angleVariation = Math.PI / 6
    const lengthFactor = 0.7
    const initialLength = 2
    
    const createBranch = (
      start: THREE.Vector3,
      angle: number,
      length: number,
      level: number
    ) => {
      if (level > depth) return
      
      const end = new THREE.Vector3(
        start.x + Math.cos(angle) * length,
        start.y + Math.sin(angle) * length,
        start.z + (Math.random() - 0.5) * 0.2
      )
      
      branches.push({ start, end, level })
      
      // Create child branches
      const newLength = length * lengthFactor
      const leftAngle = angle + angleVariation + (Math.random() - 0.5) * 0.2
      const rightAngle = angle - angleVariation + (Math.random() - 0.5) * 0.2
      
      createBranch(end, leftAngle, newLength, level + 1)
      createBranch(end, rightAngle, newLength, level + 1)
      
      // Sometimes create a third branch
      if (Math.random() > 0.7) {
        const middleAngle = angle + (Math.random() - 0.5) * 0.3
        createBranch(end, middleAngle, newLength * 0.8, level + 1)
      }
    }
    
    // Start the tree
    const origin = new THREE.Vector3(0, 0, 0)
    createBranch(origin, Math.PI / 2, initialLength, 0)
    
    return branches
  }, [depth])
  
  const geometry = useMemo(() => {
    const points: number[] = []
    const colors: number[] = []
    
    branches.forEach(({ start, end, level }) => {
      points.push(start.x, start.y, start.z)
      points.push(end.x, end.y, end.z)
      
      // Color based on level (deeper = greener)
      const hue = 0.3 - (level / depth) * 0.3 // From purple to green
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5 + (level / depth) * 0.3)
      
      colors.push(color.r, color.g, color.b)
      colors.push(color.r, color.g, color.b)
    })
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    return geometry
  }, [branches, depth])
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion
      const time = state.clock.elapsedTime
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.05
      groupRef.current.rotation.x = Math.cos(time * 0.3) * 0.03
      
      // Pulsing scale
      const scale = 1 + Math.sin(time * 2) * 0.02
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          vertexColors
          linewidth={2}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Add glowing points at branch ends */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={branches.filter(b => b.level === depth).length}
            array={new Float32Array(
              branches
                .filter(b => b.level === depth)
                .flatMap(b => [b.end.x, b.end.y, b.end.z])
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#10B981"
          sizeAttenuation
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}