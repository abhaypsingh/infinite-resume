import React, { useEffect, useRef } from 'react'

interface AttentionHeatmapProps {
  data: { x: number; y: number; intensity: number }[]
}

export const AttentionHeatmap: React.FC<AttentionHeatmapProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(10, 10, 11, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw heatmap points
    data.forEach((point, index) => {
      const x = (point.x / 100) * canvas.width
      const y = (point.y / 100) * canvas.height
      const radius = 30
      const opacity = Math.max(0, 1 - index / data.length) * 0.5
      
      // Create radial gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`)
      gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * 0.5})`)
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    })
    
    // Draw attention trails
    if (data.length > 1) {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      data.forEach((point, index) => {
        const x = (point.x / 100) * canvas.width
        const y = (point.y / 100) * canvas.height
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
    }
  }, [data])
  
  return (
    <div className="heatmap-container">
      <canvas ref={canvasRef} className="heatmap-canvas" />
      <div className="heatmap-overlay">
        <div className="heatmap-stats">
          <div className="stat-item">
            <span className="stat-label">Attention Points</span>
            <span className="stat-value">{data.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Focus Areas</span>
            <span className="stat-value">
              {data.length > 0 ? Math.floor(data.length / 10) : 0}
            </span>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .heatmap-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .heatmap-canvas {
          width: 100%;
          height: 100%;
          opacity: 0.6;
          mix-blend-mode: screen;
        }
        
        .heatmap-overlay {
          position: absolute;
          bottom: var(--fibonacci-21);
          left: var(--fibonacci-21);
          background: rgba(20, 20, 24, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-8);
          padding: var(--fibonacci-13);
          backdrop-filter: blur(10px);
        }
        
        .heatmap-stats {
          display: flex;
          gap: var(--fibonacci-21);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: var(--fibonacci-5);
        }
        
        .stat-label {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
        }
        
        .stat-value {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-primary);
          font-weight: 500;
        }
      ` }} />
    </div>
  )
}