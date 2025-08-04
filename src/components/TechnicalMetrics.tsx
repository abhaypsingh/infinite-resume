import React from 'react'
import { motion } from 'framer-motion'

interface Achievement {
  title: string
  description: string
  metric: string
  impact: number
}

interface TechnicalMetricsProps {
  achievements: Achievement[]
}

export const TechnicalMetrics: React.FC<TechnicalMetricsProps> = ({ achievements }) => {
  const totalImpact = achievements.reduce((sum, a) => sum + a.impact, 0) / achievements.length

  return (
    <div className="metrics-container">
      <div className="overall-impact">
        <h3>Overall Technical Impact</h3>
        <div className="impact-score">
          <span className="score-value">{totalImpact.toFixed(1)}</span>
          <span className="score-label">/ 100</span>
        </div>
        <p className="impact-description">
          Quantified impact across {achievements.length} major technical achievements
        </p>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            className="achievement-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="achievement-header">
              <h4>{achievement.title}</h4>
              <span className="impact-badge">{achievement.impact}%</span>
            </div>
            <p className="achievement-description">{achievement.description}</p>
            <div className="metric-display">
              <span className="metric-icon">📊</span>
              <span className="metric-value">{achievement.metric}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="technical-philosophy">
        <h4>Technical Philosophy</h4>
        <blockquote>
          "Performance is not just about speed; it's about creating systems that scale infinitely 
          while maintaining elegance in their implementation."
        </blockquote>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .metrics-container {
          padding: var(--fibonacci-21);
          display: flex;
          flex-direction: column;
          gap: var(--fibonacci-34);
        }

        .overall-impact {
          text-align: center;
          padding: var(--fibonacci-34);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: var(--fibonacci-13);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .overall-impact h3 {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-21);
        }

        .impact-score {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: var(--fibonacci-8);
          margin-bottom: var(--fibonacci-13);
        }

        .score-value {
          font-size: clamp(48px, 8vw, 72px);
          font-weight: 300;
          background: linear-gradient(135deg, var(--color-infinity-primary), var(--color-infinity-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .score-label {
          font-size: var(--fibonacci-21);
          color: var(--color-thought-gray);
        }

        .impact-description {
          color: var(--color-thought-gray);
          font-size: var(--fibonacci-13);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--fibonacci-21);
        }

        .achievement-card {
          background: rgba(20, 20, 24, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: var(--fibonacci-8);
          padding: var(--fibonacci-21);
          transition: all 0.3s ease;
        }

        .achievement-card:hover {
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }

        .achievement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--fibonacci-13);
        }

        .achievement-header h4 {
          font-size: var(--fibonacci-13);
          color: var(--color-infinity-secondary);
          margin: 0;
        }

        .impact-badge {
          padding: var(--fibonacci-3) var(--fibonacci-8);
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: var(--fibonacci-21);
          color: var(--color-infinity-tertiary);
          font-size: var(--fibonacci-8);
          font-weight: 500;
        }

        .achievement-description {
          color: var(--color-thought-gray);
          font-size: var(--fibonacci-8);
          line-height: var(--golden-ratio);
          margin-bottom: var(--fibonacci-13);
        }

        .metric-display {
          display: flex;
          align-items: center;
          gap: var(--fibonacci-8);
          padding: var(--fibonacci-8);
          background: rgba(139, 92, 246, 0.05);
          border-radius: var(--fibonacci-5);
        }

        .metric-icon {
          font-size: var(--fibonacci-13);
        }

        .metric-value {
          color: var(--color-infinity-tertiary);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          font-weight: 500;
        }

        .technical-philosophy {
          text-align: center;
          padding: var(--fibonacci-34);
          background: rgba(20, 20, 24, 0.6);
          border-radius: var(--fibonacci-13);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .technical-philosophy h4 {
          font-size: var(--fibonacci-13);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-21);
        }

        .technical-philosophy blockquote {
          font-size: var(--fibonacci-13);
          color: var(--color-thought-gray);
          font-style: italic;
          line-height: var(--golden-ratio);
          max-width: 600px;
          margin: 0 auto;
        }
      ` }} />
    </div>
  )
}