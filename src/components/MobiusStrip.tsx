import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MobiusStripProps {
  position?: [number, number, number]
  scale?: number
}

export const MobiusStrip: React.FC<MobiusStripProps> = ({ 
  position = [0, 0, 0], 
  scale = 1 
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const segments = 100
    const width = 1
    const vertices = []
    const normals = []
    const uvs = []
    
    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2
      
      for (let j = 0; j <= 1; j++) {
        const v = (j - 0.5) * width
        
        const x = (1 + v * Math.cos(u / 2)) * Math.cos(u)
        const y = (1 + v * Math.cos(u / 2)) * Math.sin(u)
        const z = v * Math.sin(u / 2)
        
        vertices.push(x, y, z)
        
        const nx = Math.cos(u) * Math.cos(u / 2)
        const ny = Math.sin(u) * Math.cos(u / 2)
        const nz = Math.sin(u / 2)
        
        normals.push(nx, ny, nz)
        uvs.push(i / segments, j)
      }
    }
    
    const indices = []
    for (let i = 0; i < segments; i++) {
      const a = i * 2
      const b = a + 1
      const c = a + 2
      const d = a + 3
      
      indices.push(a, b, c)
      indices.push(b, d, c)
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    
    return geometry
  }, [])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  
  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshPhysicalMaterial
        color="#3B82F6"
        emissive="#8B5CF6"
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}