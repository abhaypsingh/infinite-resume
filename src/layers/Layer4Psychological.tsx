import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { FlowStateVisualizer } from '../components/FlowStateVisualizer'
import { AttentionHeatmap } from '../components/AttentionHeatmap'
import { PersonalityMirror } from '../components/PersonalityMirror'
import { ContactPortal } from '../components/ContactPortal'
import { useInfiniteStore } from '../store/infiniteStore'

export const Layer4Psychological: React.FC = () => {
  const [flowState, setFlowState] = useState(0)
  const [attentionData, setAttentionData] = useState<{ x: number; y: number; intensity: number }[]>([])
  const [personalityProfile, setPersonalityProfile] = useState({
    curiosity: 0.7,
    analytical: 0.8,
    creative: 0.6,
    ambitious: 0.9,
    collaborative: 0.75
  })
  const [isResonating, setIsResonating] = useState(false)
  
  const { 
    journeyProgress, 
    dataPoints, 
    philosophicalInsights,
    technicalAchievements,
    addPhilosophicalInsight,
    recordInteraction 
  } = useInfiniteStore()

  const mousePositionRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Track mouse movement for attention heatmap
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        
        mousePositionRef.current = { x, y }
        
        setAttentionData(prev => [
          ...prev.slice(-100),
          { x, y, intensity: 1 }
        ])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Calculate flow state based on user engagement
    const calculateFlowState = () => {
      const engagementScore = 
        (journeyProgress / 100) * 0.3 +
        (dataPoints.length / 50) * 0.2 +
        (philosophicalInsights.length / 10) * 0.2 +
        (technicalAchievements.length / 5) * 0.3

      setFlowState(Math.min(engagementScore, 1))
    }

    calculateFlowState()
    const interval = setInterval(calculateFlowState, 2000)
    return () => clearInterval(interval)
  }, [journeyProgress, dataPoints, philosophicalInsights, technicalAchievements])

  const psychologicalTriggers = [
    {
      id: 'curiosity',
      title: 'Curiosity Gap',
      description: 'You\'ve explored ${journeyProgress}% of the infinite. What lies beyond?',
      color: '#8B5CF6'
    },
    {
      id: 'achievement',
      title: 'Achievement Unlocked',
      description: `${technicalAchievements.length} technical mastery badges earned`,
      color: '#10B981'
    },
    {
      id: 'pattern',
      title: 'Pattern Recognition',
      description: 'Your journey reveals unique insights about data consciousness',
      color: '#3B82F6'
    },
    {
      id: 'social',
      title: 'Connection Potential',
      description: 'Join the conversation about infinite data possibilities',
      color: '#F59E0B'
    }
  ]

  const handleResonance = () => {
    setIsResonating(true)
    addPhilosophicalInsight('Achieved resonance between human consciousness and data infinity')
    recordInteraction({
      type: 'psychological_resonance',
      timestamp: Date.now(),
      layer: 4,
      data: { flowState, personalityProfile }
    })
    
    setTimeout(() => setIsResonating(false), 3000)
  }

  return (
    <div className="layer-4-container" ref={containerRef}>
      <motion.div 
        className="psychological-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="layer-title">The Psychological Hook</h2>
        <p className="layer-subtitle">Where Mind Meets Machine</p>
        
        <div className="flow-indicator">
          <span>Flow State</span>
          <div className="flow-bar">
            <motion.div 
              className="flow-fill"
              animate={{ width: `${flowState * 100}%` }}
              transition={{ duration: 1 }}
              style={{
                background: `linear-gradient(90deg, 
                  ${flowState < 0.3 ? '#6B7280' : flowState < 0.7 ? '#8B5CF6' : '#10B981'} 0%, 
                  ${flowState < 0.5 ? '#8B5CF6' : '#10B981'} 100%)`
              }}
            />
          </div>
          <span className="flow-label">
            {flowState < 0.3 ? 'Building' : flowState < 0.7 ? 'Engaged' : 'Peak Flow'}
          </span>
        </div>
      </motion.div>

      <div className="psychological-content">
        <div className="visualization-area">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FlowStateVisualizer flowLevel={flowState} />
            <PersonalityMirror profile={personalityProfile} />
          </Canvas>
          
          <AttentionHeatmap data={attentionData} />
        </div>

        <div className="psychological-triggers">
          <h3>Neuroaesthetic Triggers</h3>
          {psychologicalTriggers.map((trigger, index) => (
            <motion.div
              key={trigger.id}
              className="trigger-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, x: 10 }}
              style={{ borderColor: trigger.color }}
            >
              <div className="trigger-icon" style={{ background: trigger.color }}>
                {index + 1}
              </div>
              <div className="trigger-content">
                <h4>{trigger.title}</h4>
                <p>{trigger.description.replace('${journeyProgress}', journeyProgress.toFixed(0))}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        className="resonance-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h3>The Moment of Resonance</h3>
        <p className="resonance-description">
          After this journey through infinite dimensions, you've witnessed the convergence of 
          data, philosophy, and human potential. The question isn't whether to connect—it's 
          how we'll shape the future together.
        </p>
        
        <motion.button
          className="resonance-button"
          onClick={handleResonance}
          animate={isResonating ? {
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 0 0 rgba(139, 92, 246, 0)',
              '0 0 0 20px rgba(139, 92, 246, 0.3)',
              '0 0 0 40px rgba(139, 92, 246, 0)'
            ]
          } : {}}
          transition={{ duration: 1 }}
        >
          Experience Resonance
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {flowState > 0.8 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <ContactPortal flowState={flowState} />
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .layer-4-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: var(--fibonacci-34);
          background: radial-gradient(
            ellipse at center,
            rgba(139, 92, 246, 0.03) 0%,
            rgba(10, 10, 11, 0.98) 70%
          );
          position: relative;
        }

        .psychological-header {
          text-align: center;
          margin-bottom: var(--fibonacci-34);
        }

        .layer-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 300;
          margin-bottom: var(--fibonacci-13);
          background: linear-gradient(135deg, var(--color-infinity-tertiary), var(--color-infinity-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .layer-subtitle {
          font-size: var(--fibonacci-13);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
          margin-bottom: var(--fibonacci-21);
        }

        .flow-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--fibonacci-13);
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
        }

        .flow-bar {
          width: 200px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .flow-fill {
          height: 100%;
          box-shadow: 0 0 10px currentColor;
        }

        .flow-label {
          font-family: var(--font-mono);
          color: var(--color-infinity-tertiary);
        }

        .psychological-content {
          flex: 1;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--fibonacci-34);
          margin-bottom: var(--fibonacci-34);
        }

        .visualization-area {
          position: relative;
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-13);
          overflow: hidden;
          background: rgba(10, 10, 11, 0.5);
        }

        .psychological-triggers {
          padding: var(--fibonacci-21);
          background: rgba(20, 20, 24, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-13);
        }

        .psychological-triggers h3 {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-21);
        }

        .trigger-card {
          display: flex;
          align-items: center;
          gap: var(--fibonacci-13);
          padding: var(--fibonacci-13);
          margin-bottom: var(--fibonacci-13);
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid;
          border-radius: var(--fibonacci-8);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .trigger-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          flex-shrink: 0;
        }

        .trigger-content h4 {
          font-size: var(--fibonacci-13);
          color: var(--color-data-white);
          margin-bottom: var(--fibonacci-5);
        }

        .trigger-content p {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          line-height: var(--golden-ratio);
        }

        .resonance-section {
          text-align: center;
          padding: var(--fibonacci-34);
          background: rgba(20, 20, 24, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-13);
        }

        .resonance-section h3 {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-21);
        }

        .resonance-description {
          font-size: var(--fibonacci-13);
          color: var(--color-thought-gray);
          line-height: var(--golden-ratio);
          max-width: 600px;
          margin: 0 auto var(--fibonacci-34);
        }

        .resonance-button {
          padding: var(--fibonacci-13) var(--fibonacci-34);
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.3), 
            rgba(16, 185, 129, 0.3)
          );
          border: 1px solid rgba(139, 92, 246, 0.5);
          border-radius: var(--fibonacci-8);
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-13);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .resonance-button:hover {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.4), 
            rgba(16, 185, 129, 0.4)
          );
          border-color: var(--color-infinity-primary);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .psychological-content {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </div>
  )
}