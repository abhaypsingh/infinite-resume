import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { Layer0Gateway } from './layers/Layer0Gateway'
import { Layer1Narrative } from './layers/Layer1Narrative'
import { Layer2Philosophy } from './layers/Layer2Philosophy'
import { Layer3Technical } from './layers/Layer3Technical'
import { Layer4Psychological } from './layers/Layer4Psychological'
import { NavigationSystem } from './components/NavigationSystem'
import { QuantumBackground } from './components/QuantumBackground'
import { useInfiniteStore } from './store/infiniteStore'
import { Analytics } from './utils/analytics'

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { currentLayer, setCurrentLayer, journeyProgress, incrementDimensionShifts } = useInfiniteStore()
  const analyticsRef = useRef<Analytics>()

  useEffect(() => {
    analyticsRef.current = new Analytics()
    analyticsRef.current.init()

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
      document.getElementById('loading-screen')?.classList.add('hidden')
      analyticsRef.current?.trackEvent('experience_started')
    }, 3000)

    // Debug: Press Shift+U to unlock all layers
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'U') {
        console.log('Unlocking all layers for debugging')
        const store = useInfiniteStore.getState()
        for (let i = 0; i < 5; i++) {
          store.unlockLayer(i)
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      clearTimeout(loadingTimeout)
      analyticsRef.current?.cleanup()
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    console.log('Current layer changed to:', currentLayer)
    analyticsRef.current?.trackEvent('layer_viewed', { layer: currentLayer })
    if (currentLayer > 0) {
      incrementDimensionShifts()
    }
  }, [currentLayer])

  const renderLayer = () => {
    switch (currentLayer) {
      case 0:
        return <Layer0Gateway onEnter={() => setCurrentLayer(1)} />
      case 1:
        return <Layer1Narrative />
      case 2:
        return <Layer2Philosophy />
      case 3:
        return <Layer3Technical />
      case 4:
        return <Layer4Psychological />
      default:
        return <Layer0Gateway onEnter={() => setCurrentLayer(1)} />
    }
  }

  return (
    <div className="app-container">
      <Canvas
        className="canvas-container"
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
      >
        <QuantumBackground />
      </Canvas>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentLayer}
          className={`layer layer-${currentLayer}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          {renderLayer()}
        </motion.div>
      </AnimatePresence>

      {currentLayer > 0 && (
        <NavigationSystem
          currentLayer={currentLayer}
          onNavigate={setCurrentLayer}
          totalLayers={5}
        />
      )}

      <div className="journey-progress" aria-label="Journey progress">
        <div 
          className="progress-bar"
          style={{ width: `${journeyProgress}%` }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .app-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .canvas-container {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        .journey-progress {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 1000;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--color-infinity-primary) 0%,
            var(--color-infinity-secondary) 50%,
            var(--color-infinity-tertiary) 100%
          );
          transition: width 0.5s var(--transition-quantum);
        }
      ` }} />
    </div>
  )
}