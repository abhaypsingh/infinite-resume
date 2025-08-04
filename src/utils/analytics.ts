export class Analytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private startTime: number
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
  }
  
  init() {
    // Track session start
    this.trackEvent('session_start', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language
    })
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', {
        hidden: document.hidden,
        sessionDuration: this.getSessionDuration()
      })
    })
    
    // Track performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          
          this.trackEvent('performance_metrics', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
          })
        }, 0)
      })
    }
  }
  
  trackEvent(eventName: string, data?: any) {
    const event: AnalyticsEvent = {
      name: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      data: {
        ...data,
        sessionDuration: this.getSessionDuration()
      }
    }
    
    this.events.push(event)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, data)
    }
    
    // Here you would send to your analytics service
    // this.sendToAnalytics(event)
  }
  
  trackInteraction(element: string, action: string, value?: any) {
    this.trackEvent('user_interaction', {
      element,
      action,
      value,
      timestamp: new Date().toISOString()
    })
  }
  
  trackError(error: Error, context?: string) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  }
  
  getSessionDuration(): number {
    return Math.floor((Date.now() - this.startTime) / 1000)
  }
  
  getEvents(): AnalyticsEvent[] {
    return this.events
  }
  
  generateReport(): AnalyticsReport {
    const eventCounts = this.events.reduce((acc, event) => {
      acc[event.name] = (acc[event.name] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      sessionId: this.sessionId,
      duration: this.getSessionDuration(),
      eventCount: this.events.length,
      eventTypes: eventCounts,
      firstEvent: this.events[0],
      lastEvent: this.events[this.events.length - 1],
      timestamp: new Date().toISOString()
    }
  }
  
  cleanup() {
    // Send final analytics
    this.trackEvent('session_end', {
      duration: this.getSessionDuration(),
      eventCount: this.events.length
    })
    
    // Clear event listeners
    document.removeEventListener('visibilitychange', () => {})
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Placeholder for sending to analytics service
  private sendToAnalytics(event: AnalyticsEvent) {
    // Implement your analytics service integration here
    // Example: Google Analytics, Mixpanel, custom backend, etc.
    
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // Google Analytics example
      (window as any).gtag('event', event.name, event.data)
    }
  }
}

interface AnalyticsEvent {
  name: string
  timestamp: number
  sessionId: string
  data?: any
}

interface AnalyticsReport {
  sessionId: string
  duration: number
  eventCount: number
  eventTypes: Record<string, number>
  firstEvent: AnalyticsEvent
  lastEvent: AnalyticsEvent
  timestamp: string
}