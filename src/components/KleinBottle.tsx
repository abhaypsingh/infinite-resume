import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface KleinBottleProps {
  position?: [number, number, number]
  scale?: number
}

export const KleinBottle: React.FC<KleinBottleProps> = ({ 
  position = [0, 0, 0], 
  scale = 1 
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    const uSegments = 64
    const vSegments = 32

    // Klein bottle parametric equations
    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * Math.PI * 2
      
      for (let j = 0; j <= vSegments; j++) {
        const v = (j / vSegments) * Math.PI * 2
        
        // Klein bottle parametrization
        const r = 4 * (1 - Math.cos(u) / 2)
        let x, y, z
        
        if (u < Math.PI) {
          x = 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(u) * Math.cos(v)
          y = 16 * Math.sin(u) + r * Math.sin(u) * Math.cos(v)
        } else {
          x = 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(v + Math.PI)
          y = 16 * Math.sin(u)
        }
        z = r * Math.sin(v)
        
        // Scale down for reasonable display
        vertices.push(x * 0.05, y * 0.05, z * 0.05)
        
        // Calculate normal (approximation)
        const normal = new THREE.Vector3(x, y, z).normalize()
        normals.push(normal.x, normal.y, normal.z)
        
        // UV coordinates
        uvs.push(i / uSegments, j / vSegments)
      }
    }

    // Create indices
    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j
        const b = a + vSegments + 1
        const c = a + 1
        const d = b + 1

        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)

    return geometry
  }, [])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#8B5CF6') },
        color2: { value: new THREE.Color('#10B981') },
        color3: { value: new THREE.Color('#3B82F6') }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position;
          float wave = sin(position.x * 2.0 + time) * 0.05;
          pos += normal * wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float t = sin(vUv.x * 6.28318 + time) * 0.5 + 0.5;
          float s = cos(vUv.y * 6.28318 + time * 0.7) * 0.5 + 0.5;
          
          vec3 color = mix(color1, color2, t);
          color = mix(color, color3, s);
          
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          color += fresnel * 0.3;
          
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false
    })
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      scale={scale}
      geometry={geometry}
    >
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  )
}