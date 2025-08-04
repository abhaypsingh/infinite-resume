import React, { useRef, useState, useEffect } from 'react'
import { Text, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const PhilosophicalQuotes: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const opacityRef = useRef(1)
  
  const quotes = [
    {
      text: "The Tao that can be told is not the eternal Tao",
      author: "Lao Tzu",
      color: "#8B5CF6"
    },
    {
      text: "I think, therefore I am... thinking about data",
      author: "Descartes (modernized)",
      color: "#3B82F6"
    },
    {
      text: "One cannot step into the same data stream twice",
      author: "Heraclitus (adapted)",
      color: "#10B981"
    },
    {
      text: "The unexamined data is not worth analyzing",
      author: "Socrates (reimagined)",
      color: "#F59E0B"
    },
    {
      text: "In the beginning was the Word, and the Word was Data",
      author: "Digital Genesis",
      color: "#EC4899"
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [quotes.length])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime % 5
    if (time < 0.5) {
      opacityRef.current = time * 2
    } else if (time > 4.5) {
      opacityRef.current = (5 - time) * 2
    } else {
      opacityRef.current = 1
    }
  })
  
  const currentQuote = quotes[currentQuoteIndex]
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <group>
        <Text
          position={[0, 0, 0]}
          fontSize={0.8}
          color={currentQuote.color}
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
          material-transparent
          material-opacity={opacityRef.current}
        >
          "{currentQuote.text}"
        </Text>
        
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.4}
          color="#666"
          anchorX="center"
          anchorY="top"
          material-transparent
          material-opacity={opacityRef.current * 0.8}
        >
          — {currentQuote.author}
        </Text>
        
        {/* Floating philosophy symbols */}
        <FloatingSymbols />
      </group>
    </Float>
  )
}

const FloatingSymbols: React.FC = () => {
  const symbols = ["∞", "Ω", "∃", "∀", "⊨", "λ", "∅", "≡"]
  
  return (
    <>
      {symbols.map((symbol, i) => {
        const angle = (i / symbols.length) * Math.PI * 2
        const radius = 5
        
        return (
          <Float
            key={i}
            speed={3 + i * 0.5}
            rotationIntensity={1}
            floatIntensity={2}
          >
            <Text
              position={[
                Math.cos(angle) * radius,
                Math.sin(i * 0.7) * 2,
                Math.sin(angle) * radius
              ]}
              fontSize={0.5}
              color="#8B5CF6"
              anchorX="center"
              anchorY="middle"
              material-transparent
              material-opacity={0.3}
            >
              {symbol}
            </Text>
          </Float>
        )
      })}
    </>
  )
}