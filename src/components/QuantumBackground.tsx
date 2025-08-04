import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

export const QuantumBackground: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const { size } = useThree()
  const noise3D = useMemo(() => createNoise3D(), [])
  
  const [positions, colors] = useMemo(() => {
    const particleCount = 5000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Distribute particles in a sphere with quantum uncertainty
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 10 + Math.random() * 40
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // Quantum color states
      const colorState = Math.random()
      if (colorState < 0.33) {
        // Purple state
        colors[i3] = 0.545
        colors[i3 + 1] = 0.361
        colors[i3 + 2] = 0.965
      } else if (colorState < 0.66) {
        // Blue state
        colors[i3] = 0.231
        colors[i3 + 1] = 0.510
        colors[i3 + 2] = 0.965
      } else {
        // Green state
        colors[i3] = 0.063
        colors[i3 + 1] = 0.725
        colors[i3 + 2] = 0.506
      }
    }
    
    return [positions, colors]
  }, [])
  
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.elapsedTime
    const positions = particlesRef.current.geometry.attributes.position
    const colors = particlesRef.current.geometry.attributes.color
    
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3
      
      // Get original position
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)
      
      // Quantum fluctuations using noise
      const noiseScale = 0.1
      const noiseStrength = 0.5
      
      const nx = noise3D(x * noiseScale, y * noiseScale, time * 0.3) * noiseStrength
      const ny = noise3D(y * noiseScale, z * noiseScale, time * 0.3) * noiseStrength
      const nz = noise3D(z * noiseScale, x * noiseScale, time * 0.3) * noiseStrength
      
      positions.setXYZ(
        i,
        x + nx,
        y + ny,
        z + nz
      )
      
      // Quantum color superposition
      const colorPhase = (Math.sin(time * 2 + i * 0.01) + 1) * 0.5
      colors.setX(i, colors.getX(i) * (0.8 + colorPhase * 0.2))
    }
    
    positions.needsUpdate = true
    colors.needsUpdate = true
    
    // Rotate the entire field
    particlesRef.current.rotation.y = time * 0.02
    particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
  })
  
  return (
    <>
      <color attach="background" args={['#0A0A0B']} />
      <fog attach="fog" args={['#0A0A0B', 20, 60]} />
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Quantum field lines */}
      <QuantumFieldLines />
      
      {/* Dimensional portal effect */}
      <DimensionalPortal />
    </>
  )
}

const QuantumFieldLines: React.FC = () => {
  const linesRef = useRef<THREE.Group>(null)
  
  const lines = useMemo(() => {
    const lines = []
    const lineCount = 20
    
    for (let i = 0; i < lineCount; i++) {
      const points = []
      const segments = 50
      
      for (let j = 0; j < segments; j++) {
        const t = j / (segments - 1)
        const angle = i * (Math.PI * 2) / lineCount
        const radius = 15 + Math.sin(t * Math.PI * 4) * 5
        
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius * t,
            (t - 0.5) * 30,
            Math.sin(angle) * radius * t
          )
        )
      }
      
      lines.push(points)
    }
    
    return lines
  }, [])
  
  useFrame((state) => {
    if (!linesRef.current) return
    
    const time = state.clock.elapsedTime
    linesRef.current.rotation.y = time * 0.1
    
    linesRef.current.children.forEach((line, i) => {
      if (line instanceof THREE.Line) {
        line.material.opacity = 0.2 + Math.sin(time * 2 + i * 0.5) * 0.1
      }
    })
  })
  
  return (
    <group ref={linesRef}>
      {lines.map((points, i) => (
        <line key={i}>
          <bufferGeometry setFromPoints={points} />
          <lineBasicMaterial
            color={i % 3 === 0 ? '#8B5CF6' : i % 3 === 1 ? '#3B82F6' : '#10B981'}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  )
}

const DimensionalPortal: React.FC = () => {
  const portalRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!portalRef.current) return
    
    const time = state.clock.elapsedTime
    portalRef.current.rotation.z = time * 0.5
    portalRef.current.material.uniforms.time.value = time
  })
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#8B5CF6') },
        color2: { value: new THREE.Color('#3B82F6') },
        color3: { value: new THREE.Color('#10B981') }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          float portal = smoothstep(0.2, 0.5, dist) * (1.0 - smoothstep(0.4, 0.5, dist));
          float wave = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
          
          vec3 color = mix(color1, color2, wave);
          color = mix(color, color3, sin(time + dist * 10.0) * 0.5 + 0.5);
          
          float alpha = portal * (0.5 + wave * 0.5) * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  }, [])
  
  return (
    <mesh
      ref={portalRef}
      position={[0, 0, -20]}
      material={shaderMaterial}
    >
      <planeGeometry args={[30, 30, 1, 1]} />
    </mesh>
  )
}