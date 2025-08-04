import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInfiniteStore } from '../store/infiniteStore'

interface ContactPortalProps {
  flowState: number
}

export const ContactPortal: React.FC<ContactPortalProps> = ({ flowState }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [contactMethod, setContactMethod] = useState<'email' | 'linkedin' | 'calendar' | null>(null)
  const { addTechnicalAchievement, journeyProgress } = useInfiniteStore()

  const handleContact = (method: typeof contactMethod) => {
    setContactMethod(method)
    addTechnicalAchievement({
      id: 'connection-established',
      title: 'Connection Established',
      description: `Initiated contact through ${method}`,
      unlockedAt: Date.now(),
      rarity: 'transcendent'
    })
  }

  const contactInfo = {
    email: 'ai.strategist@infinitedata.io',
    linkedin: 'linkedin.com/in/data-infinity',
    calendar: 'calendly.com/infinite-possibilities'
  }

  return (
    <div className="contact-portal">
      <motion.div
        className="portal-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(16, 185, 129, 0)',
            '0 0 0 10px rgba(16, 185, 129, 0.3)',
            '0 0 0 20px rgba(16, 185, 129, 0)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <h3>Ready to Shape the Future?</h3>
        <p>Your journey completion: {journeyProgress.toFixed(1)}%</p>
        <p className="flow-message">
          Flow state achieved. Let's create something extraordinary.
        </p>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="contact-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h4>Choose Your Connection Path</h4>
            
            <div className="contact-methods">
              <motion.button
                className="contact-method"
                onClick={() => handleContact('email')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="method-icon">📧</span>
                <span className="method-label">Direct Message</span>
                <span className="method-description">For immediate discussion</span>
              </motion.button>
              
              <motion.button
                className="contact-method"
                onClick={() => handleContact('linkedin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="method-icon">🔗</span>
                <span className="method-label">Professional Network</span>
                <span className="method-description">Connect and collaborate</span>
              </motion.button>
              
              <motion.button
                className="contact-method"
                onClick={() => handleContact('calendar')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="method-icon">📅</span>
                <span className="method-label">Schedule Meeting</span>
                <span className="method-description">Book a discovery call</span>
              </motion.button>
            </div>

            {contactMethod && (
              <motion.div
                className="contact-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="contact-info">
                  {contactInfo[contactMethod]}
                </p>
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(contactInfo[contactMethod])
                  }}
                >
                  Copy to Clipboard
                </button>
              </motion.div>
            )}

            <div className="final-message">
              <p>
                "The best way to predict the future is to invent it together."
              </p>
              <p className="signature">
                — Your Future AI Strategy Partner
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .contact-portal {
          position: fixed;
          bottom: var(--fibonacci-34);
          right: var(--fibonacci-34);
          z-index: 100;
        }

        .portal-trigger {
          padding: var(--fibonacci-21);
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.2), 
            rgba(139, 92, 246, 0.2)
          );
          border: 1px solid rgba(16, 185, 129, 0.5);
          border-radius: var(--fibonacci-13);
          cursor: pointer;
          backdrop-filter: blur(10px);
          max-width: 400px;
        }

        .portal-trigger h3 {
          font-size: var(--fibonacci-21);
          color: var(--color-infinity-tertiary);
          margin-bottom: var(--fibonacci-8);
        }

        .portal-trigger p {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
          margin-bottom: var(--fibonacci-5);
        }

        .flow-message {
          color: var(--color-data-white);
          font-size: var(--fibonacci-13);
          margin-top: var(--fibonacci-8);
        }

        .contact-options {
          position: absolute;
          bottom: 100%;
          right: 0;
          width: 400px;
          margin-bottom: var(--fibonacci-13);
          padding: var(--fibonacci-21);
          background: rgba(20, 20, 24, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-13);
          backdrop-filter: blur(20px);
        }

        .contact-options h4 {
          font-size: var(--fibonacci-13);
          color: var(--color-infinity-primary);
          margin-bottom: var(--fibonacci-21);
          text-align: center;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: var(--fibonacci-13);
          margin-bottom: var(--fibonacci-21);
        }

        .contact-method {
          display: flex;
          align-items: center;
          gap: var(--fibonacci-13);
          padding: var(--fibonacci-13);
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--fibonacci-8);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .contact-method:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--color-infinity-primary);
        }

        .method-icon {
          font-size: var(--fibonacci-21);
        }

        .method-label {
          flex: 1;
          font-size: var(--fibonacci-13);
          color: var(--color-data-white);
        }

        .method-description {
          font-size: var(--fibonacci-8);
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
        }

        .contact-details {
          padding: var(--fibonacci-13);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--fibonacci-8);
          margin-bottom: var(--fibonacci-21);
          text-align: center;
        }

        .contact-info {
          font-family: var(--font-mono);
          color: var(--color-infinity-tertiary);
          margin-bottom: var(--fibonacci-13);
        }

        .copy-button {
          padding: var(--fibonacci-8) var(--fibonacci-21);
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: var(--fibonacci-5);
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .copy-button:hover {
          background: rgba(16, 185, 129, 0.3);
          border-color: var(--color-infinity-tertiary);
        }

        .final-message {
          text-align: center;
          font-style: italic;
          color: var(--color-thought-gray);
        }

        .final-message p {
          font-size: var(--fibonacci-13);
          line-height: var(--golden-ratio);
          margin-bottom: var(--fibonacci-8);
        }

        .signature {
          font-size: var(--fibonacci-8);
          color: var(--color-infinity-primary);
        }

        @media (max-width: 768px) {
          .contact-portal {
            right: var(--fibonacci-21);
            bottom: var(--fibonacci-21);
          }

          .contact-options {
            width: 320px;
          }
        }
      ` }} />
    </div>
  )
}