import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInfiniteStore } from '../store/infiniteStore'

interface NavigationSystemProps {
  currentLayer: number
  onNavigate: (layer: number) => void
  totalLayers: number
}

export const NavigationSystem: React.FC<NavigationSystemProps> = ({
  currentLayer,
  onNavigate,
  totalLayers
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { unlockedLayers, dimensionShifts } = useInfiniteStore()

  const layerNames = [
    'Gateway',
    'Narrative',
    'Philosophy',
    'Technical',
    'Psychological'
  ]

  const layerDescriptions = [
    'The entrance to infinite dimensions',
    'Where data tells its story',
    'The metaphysical framework',
    'Technical mastery revealed',
    'The psychological connection'
  ]

  const handleNavigation = (layer: number) => {
    console.log('Attempting to navigate to layer:', layer)
    console.log('Unlocked layers:', unlockedLayers)
    if (unlockedLayers.includes(layer)) {
      onNavigate(layer)
      setIsExpanded(false)
    } else {
      console.log('Layer', layer, 'is locked')
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '4') {
        const layer = parseInt(e.key)
        if (unlockedLayers.includes(layer)) {
          handleNavigation(layer)
        }
      } else if (e.key === 'ArrowUp' && currentLayer > 0) {
        handleNavigation(currentLayer - 1)
      } else if (e.key === 'ArrowDown' && currentLayer < totalLayers - 1) {
        if (unlockedLayers.includes(currentLayer + 1)) {
          handleNavigation(currentLayer + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentLayer, unlockedLayers])

  return (
    <>
      <motion.button
        className="navigation-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isExpanded ? 45 : 0 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M2 17L12 22L22 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M2 12L12 17L22 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="navigation-menu"
            initial={{ opacity: 0, scale: 0.8, x: -50, y: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -50, y: -50 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <h3 className="navigation-title">Dimensional Navigation</h3>
            <div className="layer-grid">
              {Array.from({ length: totalLayers }, (_, i) => (
                <motion.button
                  key={i}
                  className={`layer-node ${currentLayer === i ? 'active' : ''} ${
                    !unlockedLayers.includes(i) ? 'locked' : ''
                  }`}
                  onClick={() => handleNavigation(i)}
                  whileHover={unlockedLayers.includes(i) ? { scale: 1.1 } : {}}
                  whileTap={unlockedLayers.includes(i) ? { scale: 0.95 } : {}}
                  disabled={!unlockedLayers.includes(i)}
                >
                  <div className="layer-number">{i}</div>
                  <div className="layer-name">{layerNames[i]}</div>
                  <div className="layer-description">{layerDescriptions[i]}</div>
                  {!unlockedLayers.includes(i) && (
                    <div className="lock-icon">🔒</div>
                  )}
                  {currentLayer === i && (
                    <motion.div
                      className="current-indicator"
                      layoutId="current-layer"
                      transition={{ type: 'spring', damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <div className="navigation-stats">
              <p>Dimensions Shifted: {dimensionShifts}</p>
              <p>Layers Unlocked: {unlockedLayers.length}/{totalLayers}</p>
            </div>
            <div className="navigation-hints">
              <p>Use ↑↓ or number keys to navigate</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .navigation-toggle {
          position: fixed;
          top: var(--fibonacci-34);
          right: var(--fibonacci-34);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(20, 20, 24, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 50%;
          color: var(--color-infinity-primary);
          cursor: pointer;
          z-index: 1000;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .navigation-toggle:hover {
          border-color: var(--color-infinity-primary);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }

        .navigation-menu {
          position: fixed;
          top: var(--fibonacci-89);
          right: var(--fibonacci-34);
          width: 320px;
          background: rgba(20, 20, 24, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-13);
          padding: var(--fibonacci-21);
          backdrop-filter: blur(20px);
          z-index: 999;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .navigation-title {
          font-size: var(--fibonacci-13);
          font-weight: 500;
          margin-bottom: var(--fibonacci-21);
          text-align: center;
          color: var(--color-infinity-primary);
        }

        .layer-grid {
          display: grid;
          gap: var(--fibonacci-8);
          margin-bottom: var(--fibonacci-21);
        }

        .layer-node {
          position: relative;
          padding: var(--fibonacci-13);
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--fibonacci-8);
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .layer-node:hover:not(.locked) {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .layer-node.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--color-infinity-primary);
        }

        .layer-node.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .layer-number {
          position: absolute;
          top: var(--fibonacci-8);
          right: var(--fibonacci-13);
          font-size: var(--fibonacci-21);
          font-weight: 700;
          color: var(--color-infinity-primary);
          opacity: 0.3;
        }

        .layer-name {
          font-size: var(--fibonacci-13);
          font-weight: 500;
          margin-bottom: var(--fibonacci-3);
          color: var(--color-data-white);
        }

        .layer-description {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
        }

        .lock-icon {
          position: absolute;
          top: 50%;
          right: var(--fibonacci-13);
          transform: translateY(-50%);
          font-size: var(--fibonacci-13);
        }

        .current-indicator {
          position: absolute;
          inset: -1px;
          border: 2px solid var(--color-infinity-primary);
          border-radius: var(--fibonacci-8);
          pointer-events: none;
        }

        .navigation-stats {
          display: flex;
          justify-content: space-between;
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          margin-bottom: var(--fibonacci-13);
          font-family: var(--font-mono);
        }

        .navigation-hints {
          text-align: center;
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
          opacity: 0.7;
        }
      ` }} />
    </>
  )
}