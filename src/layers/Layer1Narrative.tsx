import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'
import { Canvas } from '@react-three/fiber'
import { Text3D, Center, Float } from '@react-three/drei'
import { DataFlowVisualization } from '../components/DataFlowVisualization'
import { TimelineSpiral } from '../components/TimelineSpiral'
import { SkillConstellation } from '../components/SkillConstellation'
import { useInfiniteStore } from '../store/infiniteStore'

interface NarrativeNode {
  id: string
  title: string
  description: string
  year: number
  impact: number
  skills: string[]
  connections: string[]
  type: 'role' | 'project' | 'achievement' | 'insight'
}

export const Layer1Narrative: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<NarrativeNode | null>(null)
  const [narrativeMode, setNarrativeMode] = useState<'timeline' | 'network' | 'flow'>('timeline')
  const [journeyComplete, setJourneyComplete] = useState(false)
  const { addDataPoint, addPhilosophicalInsight, recordInteraction, setCurrentLayer, unlockLayer } = useInfiniteStore()

  const narrativeData: NarrativeNode[] = [
    {
      id: 'n1',
      title: 'Data Science Pioneer',
      description: 'Began journey into the infinite dimensions of data analysis',
      year: 2018,
      impact: 85,
      skills: ['Python', 'Machine Learning', 'Statistics'],
      connections: ['n2', 'n3'],
      type: 'role'
    },
    {
      id: 'n2',
      title: 'AI Strategy Framework',
      description: 'Developed comprehensive AI strategy reducing implementation time by 40%',
      year: 2020,
      impact: 92,
      skills: ['Strategic Planning', 'AI Architecture', 'Leadership'],
      connections: ['n4', 'n5'],
      type: 'project'
    },
    {
      id: 'n3',
      title: 'Quantum Analytics Engine',
      description: 'Built analytics platform processing 10TB daily with 99.9% accuracy',
      year: 2021,
      impact: 95,
      skills: ['Big Data', 'Cloud Architecture', 'Real-time Processing'],
      connections: ['n5', 'n6'],
      type: 'project'
    },
    {
      id: 'n4',
      title: 'Thought Leadership',
      description: 'Published research on infinite-dimensional data spaces',
      year: 2022,
      impact: 88,
      skills: ['Research', 'Technical Writing', 'Public Speaking'],
      connections: ['n6', 'n7'],
      type: 'achievement'
    },
    {
      id: 'n5',
      title: 'Enterprise Transformation',
      description: 'Led digital transformation for Fortune 500 company',
      year: 2022,
      impact: 97,
      skills: ['Change Management', 'Enterprise Architecture', 'Stakeholder Management'],
      connections: ['n7'],
      type: 'role'
    },
    {
      id: 'n6',
      title: 'The Data Paradox',
      description: 'Discovered that true insights emerge from embracing data chaos',
      year: 2023,
      impact: 90,
      skills: ['Philosophy', 'Systems Thinking', 'Innovation'],
      connections: ['n7'],
      type: 'insight'
    },
    {
      id: 'n7',
      title: 'Infinite Horizons',
      description: 'Current mission: Transcending traditional data boundaries',
      year: 2024,
      impact: 100,
      skills: ['Quantum Computing', 'AI Ethics', 'Visionary Leadership'],
      connections: [],
      type: 'role'
    }
  ]

  useEffect(() => {
    if (narrativeMode === 'network' && svgRef.current) {
      createNetworkVisualization()
    }
  }, [narrativeMode])

  const createNetworkVisualization = () => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    svg.selectAll('*').remove()

    const simulation = d3.forceSimulation(narrativeData as any)
      .force('link', d3.forceLink(
        narrativeData.flatMap(d => 
          d.connections.map(target => ({ source: d.id, target }))
        )
      ).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    const defs = svg.append('defs')
    
    const gradient = defs.append('linearGradient')
      .attr('id', 'nodeGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')

    gradient.append('stop')
      .attr('offset', '0%')
      .style('stop-color', '#8B5CF6')
      .style('stop-opacity', 0.8)

    gradient.append('stop')
      .attr('offset', '100%')
      .style('stop-color', '#3B82F6')
      .style('stop-opacity', 0.8)

    const link = svg.append('g')
      .selectAll('line')
      .data(narrativeData.flatMap(d => 
        d.connections.map(target => ({ 
          source: d.id, 
          target,
          sourceNode: d,
          targetNode: narrativeData.find(n => n.id === target)
        }))
      ))
      .enter().append('line')
      .attr('stroke', '#8B5CF6')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 2)

    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(narrativeData)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)
      .on('click', (event, d) => {
        setSelectedNode(d)
        recordInteraction({ type: 'node_selected', timestamp: Date.now(), layer: 1, data: d })
      })

    nodeGroup.append('circle')
      .attr('r', d => Math.sqrt(d.impact) * 5)
      .attr('fill', 'url(#nodeGradient)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    nodeGroup.append('text')
      .text(d => d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', d => Math.sqrt(d.impact) * 5 + 20)
      .style('fill', '#fff')
      .style('font-size', '12px')
      .style('pointer-events', 'none')

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      nodeGroup
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
  }

  const handleModeChange = (mode: 'timeline' | 'network' | 'flow') => {
    setNarrativeMode(mode)
    recordInteraction({ 
      type: 'narrative_mode_change', 
      timestamp: Date.now(), 
      layer: 1, 
      data: { mode } 
    })
  }

  return (
    <div className="layer-1-container">
      <motion.div 
        className="narrative-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="layer-title">The Narrative Architecture</h2>
        <p className="layer-subtitle">Where Data Tells Its Infinite Story</p>
      </motion.div>

      <div className="narrative-controls">
        <motion.button
          className={`mode-button ${narrativeMode === 'timeline' ? 'active' : ''}`}
          onClick={() => handleModeChange('timeline')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Timeline Spiral
        </motion.button>
        <motion.button
          className={`mode-button ${narrativeMode === 'network' ? 'active' : ''}`}
          onClick={() => handleModeChange('network')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Network Graph
        </motion.button>
        <motion.button
          className={`mode-button ${narrativeMode === 'flow' ? 'active' : ''}`}
          onClick={() => handleModeChange('flow')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Data Flow
        </motion.button>
      </div>

      <div className="visualization-container">
        {narrativeMode === 'timeline' && (
          <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <TimelineSpiral data={narrativeData} onNodeSelect={setSelectedNode} />
            <SkillConstellation skills={narrativeData.flatMap(n => n.skills)} />
          </Canvas>
        )}

        {narrativeMode === 'network' && (
          <svg ref={svgRef} className="network-svg" />
        )}

        {narrativeMode === 'flow' && (
          <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <DataFlowVisualization data={narrativeData} />
          </Canvas>
        )}
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="node-details"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="close-button"
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>
            <h3>{selectedNode.title}</h3>
            <p className="node-year">{selectedNode.year}</p>
            <p className="node-description">{selectedNode.description}</p>
            <div className="node-skills">
              {selectedNode.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="impact-meter">
              <span>Impact</span>
              <div className="impact-bar">
                <motion.div 
                  className="impact-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedNode.impact}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="narrative-insights"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <p className="insight-text">
          "Each data point contains infinite stories, each story branches into infinite possibilities."
        </p>
        <button 
          className="insight-button"
          onClick={() => {
            addPhilosophicalInsight('Data narratives exist in superposition until observed')
            addDataPoint({
              id: `dp-${Date.now()}`,
              timestamp: Date.now(),
              value: { narrativeMode, nodesExplored: narrativeData.length },
              dimension: 'narrative',
              connections: narrativeData.map(n => n.id)
            })
            setJourneyComplete(true)
          }}
        >
          Capture This Moment in the Data Stream
        </button>
      </motion.div>

      {/* Journey Progression */}
      <motion.div
        className="journey-progression"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: journeyComplete ? 1 : 0, y: journeyComplete ? 0 : 50 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Your narrative has been woven into the infinite tapestry</h3>
        <p>Ready to explore the philosophical dimensions?</p>
        <motion.button
          className="continue-button"
          onClick={() => {
            unlockLayer(2)
            setCurrentLayer(2)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter the Philosophical Framework →
        </motion.button>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .layer-1-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: var(--fibonacci-34);
          position: relative;
        }

        .narrative-header {
          text-align: center;
          margin-bottom: var(--fibonacci-34);
        }

        .layer-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 300;
          margin-bottom: var(--fibonacci-13);
          background: linear-gradient(135deg, var(--color-infinity-primary), var(--color-infinity-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .layer-subtitle {
          font-size: var(--fibonacci-13);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
        }

        .narrative-controls {
          display: flex;
          justify-content: center;
          gap: var(--fibonacci-21);
          margin-bottom: var(--fibonacci-34);
        }

        .mode-button {
          padding: var(--fibonacci-13) var(--fibonacci-21);
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-8);
          color: var(--color-data-white);
          font-family: var(--font-mono);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .mode-button:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--color-infinity-primary);
        }

        .mode-button.active {
          background: rgba(139, 92, 246, 0.3);
          border-color: var(--color-infinity-primary);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }

        .visualization-container {
          flex: 1;
          position: relative;
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-13);
          overflow: hidden;
          background: rgba(20, 20, 24, 0.5);
        }

        .network-svg {
          width: 100%;
          height: 100%;
        }

        .node-details {
          position: absolute;
          right: var(--fibonacci-34);
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          background: rgba(20, 20, 24, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-13);
          padding: var(--fibonacci-21);
          backdrop-filter: blur(20px);
        }

        .close-button {
          position: absolute;
          top: var(--fibonacci-13);
          right: var(--fibonacci-13);
          width: 30px;
          height: 30px;
          background: transparent;
          border: none;
          color: var(--color-thought-gray);
          font-size: 24px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close-button:hover {
          color: var(--color-data-white);
        }

        .node-details h3 {
          font-size: var(--fibonacci-21);
          margin-bottom: var(--fibonacci-8);
          color: var(--color-infinity-primary);
        }

        .node-year {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
          margin-bottom: var(--fibonacci-13);
        }

        .node-description {
          font-size: var(--fibonacci-13);
          line-height: var(--golden-ratio);
          margin-bottom: var(--fibonacci-21);
        }

        .node-skills {
          display: flex;
          flex-wrap: wrap;
          gap: var(--fibonacci-8);
          margin-bottom: var(--fibonacci-21);
        }

        .skill-tag {
          padding: var(--fibonacci-5) var(--fibonacci-13);
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: var(--fibonacci-21);
          font-size: var(--fibonacci-8);
          font-family: var(--font-mono);
        }

        .impact-meter {
          display: flex;
          align-items: center;
          gap: var(--fibonacci-13);
        }

        .impact-meter span {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
        }

        .impact-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .impact-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-infinity-primary), var(--color-infinity-secondary));
        }

        .narrative-insights {
          text-align: center;
          margin-top: var(--fibonacci-34);
        }

        .insight-text {
          font-size: var(--fibonacci-13);
          font-style: italic;
          color: var(--color-thought-gray);
          margin-bottom: var(--fibonacci-21);
        }

        .insight-button {
          padding: var(--fibonacci-13) var(--fibonacci-21);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--fibonacci-8);
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .insight-button:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: var(--color-infinity-tertiary);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
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
      ` }} />
    </div>
  )
}