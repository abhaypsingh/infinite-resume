import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const SelfModifyingCode: React.FC = () => {
  const [code, setCode] = useState(`class SelfModifyingResume {
  constructor() {
    this.version = 1.0;
    this.skills = ['AI Strategy', 'Data Science'];
    this.achievements = 0;
    this.insights = [];
  }

  evolve() {
    this.version += 0.1;
    this.achievements++;
    
    if (this.achievements % 3 === 0) {
      this.unlockNewSkill();
    }
    
    this.generateInsight();
    this.optimizePerformance();
  }

  unlockNewSkill() {
    const newSkills = [
      'Quantum Computing',
      'Neural Architecture Search',
      'Causal Inference',
      'Reinforcement Learning',
      'Knowledge Graphs'
    ];
    
    const skill = newSkills[
      Math.floor(Math.random() * newSkills.length)
    ];
    
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
      this.modifyCode('skills', this.skills);
    }
  }

  generateInsight() {
    const insights = [
      'Data is the new oil, but insights are the refinery',
      'Every model is wrong, but some are useful',
      'The best algorithm is the one that ships',
      'Complexity is the enemy of execution'
    ];
    
    const insight = insights[
      Math.floor(Math.random() * insights.length)
    ];
    
    this.insights.push({
      text: insight,
      timestamp: new Date().toISOString()
    });
  }

  optimizePerformance() {
    // Self-optimization logic
    if (this.version > 2.0) {
      this.modifyCode('constructor', 
        this.constructor.toString()
          .replace('1.0', '2.0')
      );
    }
  }

  modifyCode(section, newContent) {
    // This would actually modify the displayed code
    console.log(\`Modified \${section}: \${newContent}\`);
  }
}

const resume = new SelfModifyingResume();`)

  const [iterations, setIterations] = useState(0)
  const [modifications, setModifications] = useState<string[]>([])
  const [isEvolving, setIsEvolving] = useState(false)
  const codeRef = useRef(code)

  useEffect(() => {
    codeRef.current = code
  }, [code])

  const evolveCode = () => {
    setIsEvolving(true)
    const evolutionSteps = [
      {
        find: /this\.version = \d+\.\d+/,
        replace: `this.version = ${(1.0 + (iterations + 1) * 0.1).toFixed(1)}`,
        description: `Version upgraded to ${(1.0 + (iterations + 1) * 0.1).toFixed(1)}`
      },
      {
        find: /this\.achievements = \d+/,
        replace: `this.achievements = ${iterations + 1}`,
        description: `Achievements increased to ${iterations + 1}`
      },
      {
        find: /this\.skills = \[([^\]]+)\]/,
        replace: () => {
          const newSkills = [
            'Machine Learning Ops',
            'Distributed Systems',
            'Edge Computing',
            'Explainable AI',
            'Privacy-Preserving ML'
          ]
          const randomSkill = newSkills[Math.floor(Math.random() * newSkills.length)]
          const currentSkills = codeRef.current.match(/this\.skills = \[([^\]]+)\]/)?.[1] || ''
          if (!currentSkills.includes(randomSkill)) {
            return `this.skills = [${currentSkills}, '${randomSkill}']`
          }
          return `this.skills = [${currentSkills}]`
        },
        description: 'Added new skill through self-learning'
      }
    ]

    setTimeout(() => {
      const modification = evolutionSteps[iterations % evolutionSteps.length]
      const newCode = codeRef.current.replace(
        modification.find,
        typeof modification.replace === 'function' 
          ? modification.replace() 
          : modification.replace
      )
      
      if (newCode !== codeRef.current) {
        setCode(newCode)
        setModifications(prev => [...prev, modification.description])
      }
      
      setIterations(prev => prev + 1)
      setIsEvolving(false)
    }, 1500)
  }

  const executeCode = () => {
    try {
      eval(code + '\nresume.evolve();')
      evolveCode()
    } catch (error) {
      console.error('Execution error:', error)
    }
  }

  return (
    <div className="self-modifying-container">
      <div className="header">
        <h3>Self-Modifying Code Demonstration</h3>
        <p>Watch as the code evolves and improves itself</p>
      </div>

      <div className="code-display">
        <pre className="code-content">
          <code>{code}</code>
        </pre>
        
        <motion.button
          className="evolve-button"
          onClick={executeCode}
          disabled={isEvolving}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEvolving ? 'Evolving...' : 'Trigger Evolution'}
        </motion.button>
      </div>

      <div className="modifications-log">
        <h4>Evolution Log</h4>
        <AnimatePresence>
          {modifications.slice(-5).map((mod, index) => (
            <motion.div
              key={`${mod}-${index}`}
              className="modification-entry"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <span className="mod-timestamp">
                {new Date().toLocaleTimeString()}
              </span>
              <span className="mod-description">{mod}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="metrics">
        <div className="metric-item">
          <span className="metric-label">Iterations</span>
          <span className="metric-value">{iterations}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Code Version</span>
          <span className="metric-value">{(1.0 + iterations * 0.1).toFixed(1)}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Modifications</span>
          <span className="metric-value">{modifications.length}</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .self-modifying-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: var(--fibonacci-21);
          gap: var(--fibonacci-21);
        }

        .header {
          text-align: center;
        }

        .header h3 {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-8);
        }

        .header p {
          color: var(--color-thought-gray);
          font-size: var(--fibonacci-13);
        }

        .code-display {
          flex: 1;
          background: #1a1a1f;
          border-radius: var(--fibonacci-8);
          padding: var(--fibonacci-21);
          position: relative;
          overflow: auto;
        }

        .code-content {
          margin: 0;
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          line-height: 1.6;
        }

        .evolve-button {
          position: absolute;
          top: var(--fibonacci-13);
          right: var(--fibonacci-13);
          padding: var(--fibonacci-8) var(--fibonacci-21);
          background: var(--color-infinity-tertiary);
          border: none;
          border-radius: var(--fibonacci-5);
          color: white;
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .evolve-button:hover {
          background: var(--color-infinity-primary);
        }

        .evolve-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modifications-log {
          background: rgba(20, 20, 24, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-8);
          padding: var(--fibonacci-21);
          max-height: 200px;
          overflow-y: auto;
        }

        .modifications-log h4 {
          font-size: var(--fibonacci-13);
          color: var(--color-infinity-secondary);
          margin-bottom: var(--fibonacci-13);
        }

        .modification-entry {
          display: flex;
          gap: var(--fibonacci-13);
          padding: var(--fibonacci-8);
          background: rgba(139, 92, 246, 0.1);
          border-radius: var(--fibonacci-5);
          margin-bottom: var(--fibonacci-8);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
        }

        .mod-timestamp {
          color: var(--color-infinity-tertiary);
          min-width: 80px;
        }

        .mod-description {
          color: var(--color-data-white);
        }

        .metrics {
          display: flex;
          justify-content: space-around;
          padding: var(--fibonacci-21);
          background: rgba(20, 20, 24, 0.6);
          border-radius: var(--fibonacci-8);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .metric-item {
          text-align: center;
        }

        .metric-label {
          display: block;
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          margin-bottom: var(--fibonacci-5);
          font-family: var(--font-mono);
        }

        .metric-value {
          display: block;
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-secondary);
          font-weight: 500;
        }
      ` }} />
    </div>
  )
}