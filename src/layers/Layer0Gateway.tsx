import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Float, Stars, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { MobiusStrip } from '../components/MobiusStrip'
import { PenroseTriangle } from '../components/PenroseTriangle'
import { FractalTree } from '../components/FractalTree'
import { StrangeAttractor } from '../components/StrangeAttractor'
import { SacredGeometry } from '../components/SacredGeometry'
import { KleinBottle } from '../components/KleinBottle'
import { HopfFibration } from '../components/HopfFibration'
import { useInfiniteStore } from '../store/infiniteStore'

interface Layer0GatewayProps {
  onEnter: () => void
}

const InfinitySymbol: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.4) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[2, 0.5, 128, 16, 2, 3]} />
        <MeshDistortMaterial
          color="#8B5CF6"
          emissive="#3B82F6"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

const CantorDust: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null)
  const [positions, setPositions] = useState<Float32Array>()

  useEffect(() => {
    const generateCantorSet = (level: number = 5): number[] => {
      const points: number[] = []
      
      const cantor = (start: number, end: number, depth: number) => {
        if (depth === 0) {
          points.push(start, end)
          return
        }
        const third = (end - start) / 3
        cantor(start, start + third, depth - 1)
        cantor(end - third, end, depth - 1)
      }
      
      cantor(-5, 5, level)
      return points
    }

    const cantorPoints = generateCantorSet()
    const posArray = new Float32Array(cantorPoints.length * 3 * 100)
    
    for (let i = 0; i < cantorPoints.length; i++) {
      for (let j = 0; j < 100; j++) {
        const idx = (i * 100 + j) * 3
        posArray[idx] = cantorPoints[i]
        posArray[idx + 1] = (Math.random() - 0.5) * 10
        posArray[idx + 2] = (Math.random() - 0.5) * 10
      }
    }
    
    setPositions(posArray)
  }, [])

  useFrame((state) => {
    if (pointsRef.current && positions) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
      
      const time = state.clock.elapsedTime
      const posAttr = pointsRef.current.geometry.attributes.position
      
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i)
        const y = posAttr.getY(i)
        const z = posAttr.getZ(i)
        
        posAttr.setY(i, y + Math.sin(time + x * 0.5) * 0.01)
        posAttr.setZ(i, z + Math.cos(time + x * 0.3) * 0.01)
      }
      
      posAttr.needsUpdate = true
    }
  })

  if (!positions) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#10B981"
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export const Layer0Gateway: React.FC<Layer0GatewayProps> = ({ onEnter }) => {
  const [isReady, setIsReady] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const { incrementInfinityGlimpses } = useInfiniteStore()

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleInfinityClick = () => {
    console.log('Enter button clicked')
    incrementInfinityGlimpses()
    // Unlock the next layer when entering
    const store = useInfiniteStore.getState()
    store.unlockLayer(1)
    console.log('Calling onEnter to navigate to layer 1')
    onEnter()
  }

  return (
    <div className="layer-0-container">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
        
        <InfinitySymbol />
        <CantorDust />
        <MobiusStrip position={[-4, 2, -2]} scale={0.5} />
        <PenroseTriangle position={[4, -2, -1]} scale={0.7} />
        <FractalTree position={[0, -3, -5]} scale={0.3} />
        <StrangeAttractor position={[0, 0, -8]} scale={2} />
        <SacredGeometry position={[-6, 0, -4]} scale={0.8} />
        <KleinBottle position={[6, 1, -3]} scale={0.6} />
        <HopfFibration position={[0, 4, -6]} scale={0.5} />
        
        <Stars 
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>

      <motion.div 
        className="gateway-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 2 }}
      >
        <motion.h1
          className="gateway-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          ∞
        </motion.h1>
        
        <motion.p
          className="gateway-subtitle"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Where Data Transcends Dimension
        </motion.p>

        <motion.div
          className="philosophical-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
        >
          <p>"In the infinite hotel of data, every room is occupied,</p>
          <p>yet there's always space for one more insight."</p>
          <cite>— Paraphrasing Hilbert's Paradox</cite>
        </motion.div>

        <motion.button
          className="enter-button"
          onClick={handleInfinityClick}
          onMouseEnter={() => setHoveredElement('enter')}
          onMouseLeave={() => setHoveredElement(null)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="enter-text">Enter the Infinite</span>
          <span className="enter-subtext">Begin Your Journey Through Data Dimensions</span>
        </motion.button>

        <motion.div
          className="navigation-hints"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <p>Navigate with consciousness • Interact with purpose • Discover connections</p>
        </motion.div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .layer-0-container {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .gateway-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          max-width: 800px;
          padding: var(--fibonacci-34);
        }

        .gateway-title {
          font-size: clamp(80px, 15vw, 200px);
          font-weight: 300;
          line-height: 1;
          margin-bottom: var(--fibonacci-21);
          background: linear-gradient(
            135deg,
            var(--color-infinity-primary),
            var(--color-infinity-secondary),
            var(--color-infinity-tertiary)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.5));
          animation: infinityRotate 20s linear infinite;
        }

        .gateway-subtitle {
          font-size: clamp(18px, 3vw, 28px);
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-thought-gray);
          margin-bottom: var(--fibonacci-55);
        }

        .philosophical-quote {
          margin-bottom: var(--fibonacci-55);
          font-style: italic;
          color: var(--color-thought-gray);
          font-size: var(--fibonacci-13);
          line-height: var(--golden-ratio);
        }

        .philosophical-quote cite {
          display: block;
          margin-top: var(--fibonacci-13);
          font-size: var(--fibonacci-8);
          opacity: 0.7;
        }

        .enter-button {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: var(--fibonacci-21) var(--fibonacci-34);
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-8);
          backdrop-filter: blur(10px);
          transition: all 0.3s var(--transition-quantum);
          cursor: pointer;
        }

        .enter-button:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.6);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }

        .enter-text {
          font-size: var(--fibonacci-21);
          font-weight: 500;
          color: var(--color-data-white);
          margin-bottom: var(--fibonacci-5);
        }

        .enter-subtext {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
        }

        .navigation-hints {
          position: absolute;
          bottom: var(--fibonacci-34);
          left: 50%;
          transform: translateX(-50%);
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
        }
      ` }} />
    </div>
  )
}