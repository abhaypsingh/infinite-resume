import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StrangeAttractorProps {
  position?: [number, number, number]
  scale?: number
  type?: 'lorenz' | 'rossler' | 'chua'
}

export const StrangeAttractor: React.FC<StrangeAttractorProps> = ({ 
  position = [0, 0, 0], 
  scale = 1,
  type = 'lorenz'
}) => {
  const meshRef = useRef<THREE.Line>(null)
  const materialRef = useRef<THREE.LineBasicMaterial>(null)
  
  const points = useMemo(() => {
    const points: THREE.Vector3[] = []
    const dt = 0.01
    const iterations = 10000
    
    if (type === 'lorenz') {
      // Lorenz attractor parameters
      const sigma = 10
      const rho = 28
      const beta = 8 / 3
      
      let x = 0.1
      let y = 0
      let z = 0
      
      for (let i = 0; i < iterations; i++) {
        const dx = sigma * (y - x) * dt
        const dy = (x * (rho - z) - y) * dt
        const dz = (x * y - beta * z) * dt
        
        x += dx
        y += dy
        z += dz
        
        points.push(new THREE.Vector3(x * 0.1, y * 0.1, z * 0.1))
      }
    } else if (type === 'rossler') {
      // Rössler attractor parameters
      const a = 0.2
      const b = 0.2
      const c = 5.7
      
      let x = 1
      let y = 1
      let z = 1
      
      for (let i = 0; i < iterations; i++) {
        const dx = (-y - z) * dt
        const dy = (x + a * y) * dt
        const dz = (b + z * (x - c)) * dt
        
        x += dx
        y += dy
        z += dz
        
        points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.05))
      }
    } else if (type === 'chua') {
      // Chua's circuit attractor
      const a = 15.6
      const b = 28
      const c = -1.143
      const d = -0.714
      
      let x = 0.1
      let y = 0
      let z = 0
      
      const f = (x: number) => {
        return c * x + 0.5 * (d - c) * (Math.abs(x + 1) - Math.abs(x - 1))
      }
      
      for (let i = 0; i < iterations; i++) {
        const dx = a * (y - x - f(x)) * dt
        const dy = (x - y + z) * dt
        const dz = -b * y * dt
        
        x += dx
        y += dy
        z += dz
        
        points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5))
      }
    }
    
    return points
  }, [type])
  
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    // Add color gradient
    const colors = new Float32Array(points.length * 3)
    for (let i = 0; i < points.length; i++) {
      const t = i / points.length
      const color = new THREE.Color()
      color.setHSL(t * 0.5 + 0.5, 0.8, 0.5)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    return geometry
  }, [points])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2
    }
    
    if (materialRef.current) {
      // Animate opacity for breathing effect
      materialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })
  
  return (
    <group position={position} scale={scale}>
      <line ref={meshRef} geometry={geometry}>
        <lineBasicMaterial
          ref={materialRef}
          vertexColors
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </line>
      
      {/* Add glow effect */}
      <line geometry={geometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          linewidth={3}
        />
      </line>
    </group>
  )
}