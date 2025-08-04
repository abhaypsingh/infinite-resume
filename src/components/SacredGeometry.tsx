import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SacredGeometryProps {
  position?: [number, number, number]
  scale?: number
}

export const SacredGeometry: React.FC<SacredGeometryProps> = ({ 
  position = [0, 0, 0], 
  scale = 1 
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const metatronRef = useRef<THREE.LineSegments>(null)
  const flowerRef = useRef<THREE.LineSegments>(null)
  const merkabahRef = useRef<THREE.Mesh>(null)

  // Create Metatron's Cube geometry
  const metatronGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []
    
    // Create 13 spheres of Metatron's Cube
    const phi = (1 + Math.sqrt(5)) / 2
    const spherePositions = [
      [0, 0, 0], // Center
      // Inner hexagon
      [1, 0, 0], [-1, 0, 0],
      [0.5, Math.sqrt(3)/2, 0], [-0.5, Math.sqrt(3)/2, 0],
      [0.5, -Math.sqrt(3)/2, 0], [-0.5, -Math.sqrt(3)/2, 0],
      // Outer hexagon
      [2, 0, 0], [-2, 0, 0],
      [1, Math.sqrt(3), 0], [-1, Math.sqrt(3), 0],
      [1, -Math.sqrt(3), 0], [-1, -Math.sqrt(3), 0]
    ]

    // Connect all spheres to create the sacred pattern
    for (let i = 0; i < spherePositions.length; i++) {
      for (let j = i + 1; j < spherePositions.length; j++) {
        vertices.push(...spherePositions[i], ...spherePositions[j])
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }, [])

  // Create Flower of Life geometry
  const flowerGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []
    const radius = 1
    const circles = 19 // Traditional flower of life

    // Create overlapping circles
    const circlePoints = 64
    const centerCircle = []
    for (let i = 0; i <= circlePoints; i++) {
      const angle = (i / circlePoints) * Math.PI * 2
      centerCircle.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ))
    }

    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const centerX = Math.cos(angle) * radius
      const centerY = Math.sin(angle) * radius
      
      for (let j = 0; j < circlePoints; j++) {
        const angle2 = (j / circlePoints) * Math.PI * 2
        const x = centerX + Math.cos(angle2) * radius
        const y = centerY + Math.sin(angle2) * radius
        
        if (j > 0) {
          vertices.push(
            centerX + Math.cos((j-1) / circlePoints * Math.PI * 2) * radius,
            centerY + Math.sin((j-1) / circlePoints * Math.PI * 2) * radius,
            0,
            x, y, 0
          )
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }, [])

  // Create Merkabah (3D Star Tetrahedron)
  const merkabahGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []
    
    // Upper tetrahedron
    const h = Math.sqrt(2/3)
    const upperVertices = [
      [0, h, 0],
      [-1, -h/2, -1/Math.sqrt(3)],
      [1, -h/2, -1/Math.sqrt(3)],
      [0, -h/2, 2/Math.sqrt(3)]
    ]
    
    // Lower tetrahedron (inverted)
    const lowerVertices = [
      [0, -h, 0],
      [-1, h/2, 1/Math.sqrt(3)],
      [1, h/2, 1/Math.sqrt(3)],
      [0, h/2, -2/Math.sqrt(3)]
    ]
    
    // Create faces for both tetrahedrons
    const createTetrahedron = (verts: number[][]) => {
      const faces = [
        [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]
      ]
      
      faces.forEach(face => {
        face.forEach(idx => {
          vertices.push(...verts[idx])
        })
      })
    }
    
    createTetrahedron(upperVertices)
    createTetrahedron(lowerVertices)
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.computeVertexNormals()
    return geometry
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    // Sacred rotation patterns
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    
    if (metatronRef.current) {
      metatronRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
    
    if (flowerRef.current) {
      flowerRef.current.rotation.z = -state.clock.elapsedTime * 0.05
      flowerRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      )
    }
    
    if (merkabahRef.current) {
      merkabahRef.current.rotation.x = state.clock.elapsedTime * 0.3
      merkabahRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Metatron's Cube */}
      <lineSegments ref={metatronRef} geometry={metatronGeometry}>
        <lineBasicMaterial color="#8B5CF6" transparent opacity={0.3} />
      </lineSegments>
      
      {/* Flower of Life */}
      <lineSegments ref={flowerRef} geometry={flowerGeometry} position={[0, 0, -0.5]}>
        <lineBasicMaterial color="#10B981" transparent opacity={0.4} />
      </lineSegments>
      
      {/* Merkabah */}
      <mesh ref={merkabahRef} geometry={merkabahGeometry} scale={0.5}>
        <meshPhysicalMaterial
          color="#3B82F6"
          emissive="#3B82F6"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Sacred points of light */}
      {[...Array(13)].map((_, i) => {
        const angle = (i / 13) * Math.PI * 2
        const radius = 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#FAFAFA" />
          </mesh>
        )
      })}
    </group>
  )
}