import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Sphere, Line, Float } from '@react-three/drei'
import * as THREE from 'three'
import { GodelParadox } from '../components/GodelParadox'
import { BuddhistMandala } from '../components/BuddhistMandala'
import { QuantumSuperposition } from '../components/QuantumSuperposition'
import { PhilosophicalQuotes } from '../components/PhilosophicalQuotes'
import { useInfiniteStore } from '../store/infiniteStore'

export const Layer2Philosophy: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<'godel' | 'buddhism' | 'quantum' | null>(null)
  const [enlightenmentLevel, setEnlightenmentLevel] = useState(0)
  const [journeyComplete, setJourneyComplete] = useState(false)
  const { addPhilosophicalInsight, incrementInfinityGlimpses, recordInteraction, setCurrentLayer, unlockLayer } = useInfiniteStore()

  const philosophicalConcepts = [
    {
      id: 'godel',
      title: "Gödel's Incompleteness",
      subtitle: 'The Limits of Formal Systems',
      description: 'Any consistent formal system cannot prove its own consistency',
      insight: 'Just as mathematics contains undecidable propositions, data contains unmeasurable truths'
    },
    {
      id: 'buddhism',
      title: 'Buddhist Impermanence',
      subtitle: 'अनित्य (Anitya) - The Nature of Change',
      description: 'All conditioned existence is transient, including data itself',
      insight: 'Data flows like water, taking the shape of its container while remaining formless'
    },
    {
      id: 'quantum',
      title: 'Quantum Superposition',
      subtitle: 'Multiple States Simultaneously',
      description: 'Career states exist in superposition until observed by opportunity',
      insight: 'We are simultaneously all our potential futures until choice collapses the wave function'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setEnlightenmentLevel(prev => Math.min(prev + 0.01, 1))
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const handleConceptSelect = (concept: 'godel' | 'buddhism' | 'quantum') => {
    setSelectedConcept(concept)
    const selected = philosophicalConcepts.find(c => c.id === concept)
    if (selected) {
      addPhilosophicalInsight(selected.insight)
      recordInteraction({ 
        type: 'philosophical_concept_explored', 
        timestamp: Date.now(), 
        layer: 2, 
        data: { concept } 
      })
      
      // Check if user has explored enough concepts
      const store = useInfiniteStore.getState()
      if (store.philosophicalInsights.length >= 3) {
        setJourneyComplete(true)
      }
    }
  }

  return (
    <div className="layer-2-container">
      <motion.div 
        className="philosophy-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="layer-title">The Philosophical Framework</h2>
        <p className="layer-subtitle">Where Data Meets Metaphysics</p>
        <div className="enlightenment-meter">
          <span>Enlightenment Progress</span>
          <div className="enlightenment-bar">
            <motion.div 
              className="enlightenment-fill"
              animate={{ width: `${enlightenmentLevel * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      <div className="philosophy-content">
        <div className="concepts-grid">
          {philosophicalConcepts.map((concept) => (
            <motion.div
              key={concept.id}
              className={`concept-card ${selectedConcept === concept.id ? 'active' : ''}`}
              onClick={() => handleConceptSelect(concept.id as 'godel' | 'buddhism' | 'quantum')}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>{concept.title}</h3>
              <p className="concept-subtitle">{concept.subtitle}</p>
              <p className="concept-description">{concept.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="visualization-area">
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            
            <AnimatePresence mode="wait">
              {selectedConcept === 'godel' && (
                <GodelParadox key="godel" />
              )}
              {selectedConcept === 'buddhism' && (
                <BuddhistMandala key="buddhism" enlightenmentLevel={enlightenmentLevel} />
              )}
              {selectedConcept === 'quantum' && (
                <QuantumSuperposition key="quantum" />
              )}
            </AnimatePresence>

            {!selectedConcept && (
              <PhilosophicalQuotes />
            )}
          </Canvas>
        </div>
      </div>

      <motion.div 
        className="philosophical-insights"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="insight-cards">
          <motion.div 
            className="insight-card"
            whileHover={{ scale: 1.05 }}
          >
            <h4>The Data Paradox</h4>
            <p>"The more we measure, the less we understand the immeasurable."</p>
          </motion.div>
          
          <motion.div 
            className="insight-card"
            whileHover={{ scale: 1.05 }}
          >
            <h4>Infinite Regression</h4>
            <p>"Every answer spawns new questions, ad infinitum."</p>
          </motion.div>
          
          <motion.div 
            className="insight-card"
            whileHover={{ scale: 1.05 }}
          >
            <h4>The Observer Effect</h4>
            <p>"Data changes by the very act of observation."</p>
          </motion.div>
        </div>

        <button 
          className="transcendence-button"
          onClick={() => {
            incrementInfinityGlimpses()
            setEnlightenmentLevel(1)
            addPhilosophicalInsight('Achieved temporary transcendence of data limitations')
            setJourneyComplete(true)
          }}
        >
          Glimpse the Infinite
        </button>
      </motion.div>

      {/* Journey Progression */}
      <motion.div
        className="journey-progression"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: journeyComplete ? 1 : 0, y: journeyComplete ? 0 : 50 }}
        transition={{ duration: 0.5 }}
      >
        <h3>You have contemplated the infinite nature of data</h3>
        <p>Ready to manifest technical mastery?</p>
        <motion.button
          className="continue-button"
          onClick={() => {
            unlockLayer(3)
            setCurrentLayer(3)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter the Technical Showcase →
        </motion.button>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .layer-2-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: var(--fibonacci-34);
          background: radial-gradient(
            ellipse at center,
            rgba(139, 92, 246, 0.05) 0%,
            transparent 70%
          );
        }

        .philosophy-header {
          text-align: center;
          margin-bottom: var(--fibonacci-34);
        }

        .layer-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 300;
          margin-bottom: var(--fibonacci-13);
          background: linear-gradient(135deg, var(--color-infinity-primary), var(--color-infinity-tertiary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .layer-subtitle {
          font-size: var(--fibonacci-13);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
          margin-bottom: var(--fibonacci-21);
        }

        .enlightenment-meter {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--fibonacci-13);
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
        }

        .enlightenment-bar {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .enlightenment-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-infinity-primary), var(--color-infinity-tertiary));
          box-shadow: 0 0 10px var(--color-infinity-primary);
        }

        .philosophy-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--fibonacci-34);
          margin-bottom: var(--fibonacci-34);
        }

        .concepts-grid {
          display: flex;
          flex-direction: column;
          gap: var(--fibonacci-21);
        }

        .concept-card {
          padding: var(--fibonacci-21);
          background: rgba(20, 20, 24, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-13);
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .concept-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(139, 92, 246, 0.1);
        }

        .concept-card.active {
          border-color: var(--color-infinity-primary);
          background: rgba(139, 92, 246, 0.2);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
        }

        .concept-card h3 {
          font-size: var(--fibonacci-21);
          font-weight: 400;
          margin-bottom: var(--fibonacci-8);
          color: var(--color-infinity-primary);
        }

        .concept-subtitle {
          font-size: var(--fibonacci-8);
          color: var(--color-infinity-secondary);
          font-family: var(--font-mono);
          margin-bottom: var(--fibonacci-13);
        }

        .concept-description {
          font-size: var(--fibonacci-13);
          line-height: var(--golden-ratio);
          color: var(--color-thought-gray);
        }

        .visualization-area {
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-13);
          overflow: hidden;
          background: rgba(10, 10, 11, 0.5);
        }

        .philosophical-insights {
          text-align: center;
        }

        .insight-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--fibonacci-21);
          margin-bottom: var(--fibonacci-34);
        }

        .insight-card {
          padding: var(--fibonacci-21);
          background: rgba(20, 20, 24, 0.6);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--fibonacci-8);
          backdrop-filter: blur(10px);
        }

        .insight-card h4 {
          font-size: var(--fibonacci-13);
          color: var(--color-infinity-tertiary);
          margin-bottom: var(--fibonacci-8);
        }

        .insight-card p {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-style: italic;
        }

        .transcendence-button {
          padding: var(--fibonacci-13) var(--fibonacci-34);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.2));
          border: 1px solid rgba(139, 92, 246, 0.4);
          border-radius: var(--fibonacci-8);
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-13);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .transcendence-button:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(16, 185, 129, 0.3));
          border-color: var(--color-infinity-primary);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
        }

        .journey-progression {
          position: fixed;
          bottom: var(--fibonacci-34);
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          padding: var(--fibonacci-34);
          background: rgba(20, 20, 24, 0.9);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-13);
          backdrop-filter: blur(20px);
          max-width: 600px;
          z-index: 100;
        }

        .journey-progression h3 {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-13);
        }

        .journey-progression p {
          font-size: var(--fibonacci-13);
          color: var(--color-thought-gray);
          margin-bottom: var(--fibonacci-21);
        }

        .continue-button {
          padding: var(--fibonacci-13) var(--fibonacci-34);
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.3), 
            rgba(16, 185, 129, 0.3)
          );
          border: 1px solid rgba(139, 92, 246, 0.5);
          border-radius: var(--fibonacci-8);
          color: var(--color-data-white);
          font-size: var(--fibonacci-13);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-button:hover {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.4), 
            rgba(16, 185, 129, 0.4)
          );
          border-color: var(--color-infinity-primary);
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .philosophy-content {
            grid-template-columns: 1fr;
          }

          .insight-cards {
            grid-template-columns: 1fr;
          }
          
          .journey-progression {
            width: 90%;
            max-width: none;
          }
        }
      ` }} />
    </div>
  )
}