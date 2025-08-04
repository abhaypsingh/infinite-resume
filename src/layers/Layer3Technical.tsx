import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { LiveCodeEditor } from '../components/LiveCodeEditor'
import { AlgorithmVisualization } from '../components/AlgorithmVisualization'
import { SelfModifyingCode } from '../components/SelfModifyingCode'
import { TechnicalMetrics } from '../components/TechnicalMetrics'
import { useInfiniteStore } from '../store/infiniteStore'
import * as d3 from 'd3'

export const Layer3Technical: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'algorithms' | 'live-code' | 'self-modify' | 'metrics'>('algorithms')
  const [codeOutput, setCodeOutput] = useState<string>('')
  const [journeyComplete, setJourneyComplete] = useState(false)
  const [demosExplored, setDemosExplored] = useState(new Set<string>())
  const { addTechnicalAchievement, addDataPoint, recordInteraction, setCurrentLayer, unlockLayer } = useInfiniteStore()
  const metricsRef = useRef<HTMLDivElement>(null)

  const technicalSkills = {
    languages: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'R', 'Scala'],
    frameworks: ['TensorFlow', 'PyTorch', 'React', 'Node.js', 'Spark', 'Kubernetes'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'ElasticSearch', 'Neo4j'],
    cloud: ['AWS', 'GCP', 'Azure', 'Terraform', 'Docker', 'CI/CD'],
    ai: ['Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning', 'MLOps', 'LLMs']
  }

  const achievements = [
    { 
      title: 'Performance Optimizer', 
      description: 'Reduced model inference time by 87%',
      metric: '13ms → 1.7ms',
      impact: 95
    },
    { 
      title: 'Scale Master', 
      description: 'Architected system handling 1B+ requests/day',
      metric: '99.99% uptime',
      impact: 98
    },
    { 
      title: 'Data Pipeline Architect', 
      description: 'Built real-time ETL processing 10TB daily',
      metric: '<5min latency',
      impact: 92
    },
    { 
      title: 'Algorithm Innovator', 
      description: 'Patented novel recommendation algorithm',
      metric: '+34% engagement',
      impact: 96
    }
  ]

  useEffect(() => {
    if (activeDemo === 'metrics' && metricsRef.current) {
      createD3Visualization()
    }
  }, [activeDemo])

  const createD3Visualization = () => {
    if (!metricsRef.current) return

    const svg = d3.select(metricsRef.current)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', '100%')
      .attr('height', 400)

    const width = metricsRef.current.clientWidth
    const height = 400

    // Create performance metrics visualization
    const data = achievements.map(a => ({
      name: a.title,
      value: a.impact,
      metric: a.metric
    }))

    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.selectAll('.chart-group')
      .data([null])
      .join('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.1)

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0])

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', '#8B5CF6')
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1)
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('opacity', 0.8)
      })

    // Add metric labels
    g.selectAll('.metric-label')
      .data(data)
      .join('text')
      .attr('class', 'metric-label')
      .attr('x', d => x(d.name)! + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#10B981')
      .attr('font-size', '12px')
      .attr('font-family', 'monospace')
      .text(d => d.metric)
  }

  const handleDemoChange = (demo: typeof activeDemo) => {
    setActiveDemo(demo)
    setDemosExplored(prev => new Set([...prev, demo]))
    recordInteraction({
      type: 'technical_demo_selected',
      timestamp: Date.now(),
      layer: 3,
      data: { demo }
    })
    
    // Check if user has explored enough demos
    if (demosExplored.size >= 2) {
      setJourneyComplete(true)
    }
  }

  const handleCodeExecution = (output: string) => {
    setCodeOutput(output)
    addDataPoint({
      id: `code-${Date.now()}`,
      timestamp: Date.now(),
      value: { code: output },
      dimension: 'technical',
      connections: []
    })
  }

  return (
    <div className="layer-3-container">
      <motion.div 
        className="technical-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="layer-title">The Technical Showcase</h2>
        <p className="layer-subtitle">Mastery Through Demonstration</p>
      </motion.div>

      <div className="demo-selector">
        <motion.button
          className={`demo-button ${activeDemo === 'algorithms' ? 'active' : ''}`}
          onClick={() => handleDemoChange('algorithms')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Algorithm Visualization
        </motion.button>
        <motion.button
          className={`demo-button ${activeDemo === 'live-code' ? 'active' : ''}`}
          onClick={() => handleDemoChange('live-code')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Live Coding
        </motion.button>
        <motion.button
          className={`demo-button ${activeDemo === 'self-modify' ? 'active' : ''}`}
          onClick={() => handleDemoChange('self-modify')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Self-Modifying Code
        </motion.button>
        <motion.button
          className={`demo-button ${activeDemo === 'metrics' ? 'active' : ''}`}
          onClick={() => handleDemoChange('metrics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Performance Metrics
        </motion.button>
      </div>

      <div className="technical-content">
        <AnimatePresence mode="wait">
          {activeDemo === 'algorithms' && (
            <motion.div
              key="algorithms"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="demo-area"
            >
              <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                <AlgorithmVisualization />
              </Canvas>
            </motion.div>
          )}

          {activeDemo === 'live-code' && (
            <motion.div
              key="live-code"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="demo-area"
            >
              <LiveCodeEditor onExecute={handleCodeExecution} />
              {codeOutput && (
                <div className="code-output">
                  <h4>Output:</h4>
                  <pre>{codeOutput}</pre>
                </div>
              )}
            </motion.div>
          )}

          {activeDemo === 'self-modify' && (
            <motion.div
              key="self-modify"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="demo-area"
            >
              <SelfModifyingCode />
            </motion.div>
          )}

          {activeDemo === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="demo-area"
            >
              <div ref={metricsRef} className="metrics-visualization" />
              <TechnicalMetrics achievements={achievements} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="skills-showcase">
          <h3>Technical Arsenal</h3>
          <div className="skills-grid">
            {Object.entries(technicalSkills).map(([category, skills]) => (
              <motion.div
                key={category}
                className="skill-category"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h4>{category.toUpperCase()}</h4>
                <div className="skill-tags">
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="skill-tag"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        className="achievement-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          className="achievement-button"
          onClick={() => {
            addTechnicalAchievement({
              id: 'technical-master',
              title: 'Technical Mastery Demonstrated',
              description: 'Explored all technical demonstrations',
              unlockedAt: Date.now(),
              rarity: 'legendary'
            })
          }}
        >
          Unlock Technical Mastery Achievement
        </button>
      </motion.div>

      {/* Journey Progression */}
      <motion.div
        className="journey-progression"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: journeyComplete ? 1 : 0, y: journeyComplete ? 0 : 50 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Technical mastery demonstrated across infinite dimensions</h3>
        <p>Ready to forge the final connection?</p>
        <motion.button
          className="continue-button"
          onClick={() => {
            unlockLayer(4)
            setCurrentLayer(4)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter the Psychological Hook →
        </motion.button>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .layer-3-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: var(--fibonacci-34);
          background: linear-gradient(135deg, rgba(20, 20, 24, 0.95) 0%, rgba(10, 10, 11, 0.98) 100%);
        }

        .technical-header {
          text-align: center;
          margin-bottom: var(--fibonacci-34);
        }

        .layer-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 300;
          margin-bottom: var(--fibonacci-13);
          background: linear-gradient(135deg, var(--color-infinity-secondary), var(--color-infinity-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .layer-subtitle {
          font-size: var(--fibonacci-13);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
        }

        .demo-selector {
          display: flex;
          justify-content: center;
          gap: var(--fibonacci-21);
          margin-bottom: var(--fibonacci-34);
        }

        .demo-button {
          padding: var(--fibonacci-13) var(--fibonacci-21);
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: var(--fibonacci-8);
          color: var(--color-data-white);
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .demo-button:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .demo-button.active {
          background: rgba(59, 130, 246, 0.3);
          border-color: var(--color-infinity-secondary);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .technical-content {
          flex: 1;
          display: flex;
          gap: var(--fibonacci-34);
        }

        .demo-area {
          flex: 2;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: var(--fibonacci-13);
          background: rgba(10, 10, 11, 0.8);
          overflow: hidden;
          position: relative;
          min-height: 500px;
        }

        .code-output {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          padding: var(--fibonacci-21);
          border-top: 1px solid rgba(139, 92, 246, 0.3);
        }

        .code-output h4 {
          color: var(--color-infinity-tertiary);
          margin-bottom: var(--fibonacci-8);
        }

        .code-output pre {
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          overflow-x: auto;
        }

        .skills-showcase {
          flex: 1;
          padding: var(--fibonacci-21);
          background: rgba(20, 20, 24, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-13);
          overflow-y: auto;
        }

        .skills-showcase h3 {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-21);
        }

        .skills-grid {
          display: flex;
          flex-direction: column;
          gap: var(--fibonacci-21);
        }

        .skill-category h4 {
          font-size: var(--fibonacci-8);
          color: var(--color-infinity-secondary);
          margin-bottom: var(--fibonacci-13);
          font-family: var(--font-mono);
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--fibonacci-8);
        }

        .skill-tag {
          padding: var(--fibonacci-5) var(--fibonacci-13);
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-21);
          font-size: var(--fibonacci-8);
          font-family: var(--font-mono);
          transition: all 0.3s ease;
          cursor: default;
        }

        .metrics-visualization {
          width: 100%;
          height: 400px;
          margin-bottom: var(--fibonacci-21);
        }

        .achievement-banner {
          text-align: center;
          margin-top: var(--fibonacci-34);
        }

        .achievement-button {
          padding: var(--fibonacci-13) var(--fibonacci-34);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: var(--fibonacci-8);
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-13);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .achievement-button:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
          border-color: var(--color-infinity-secondary);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
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
          .technical-content {
            flex-direction: column;
          }

          .demo-selector {
            flex-wrap: wrap;
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