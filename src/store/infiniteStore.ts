import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface InfiniteState {
  currentLayer: number
  journeyProgress: number
  unlockedLayers: number[]
  dataPoints: DataPoint[]
  philosophicalInsights: string[]
  technicalAchievements: Achievement[]
  userInteractions: Interaction[]
  dimensionShifts: number
  infinityGlimpses: number
  
  setCurrentLayer: (layer: number) => void
  updateJourneyProgress: () => void
  unlockLayer: (layer: number) => void
  addDataPoint: (point: DataPoint) => void
  addPhilosophicalInsight: (insight: string) => void
  addTechnicalAchievement: (achievement: Achievement) => void
  recordInteraction: (interaction: Interaction) => void
  incrementDimensionShifts: () => void
  incrementInfinityGlimpses: () => void
  reset: () => void
}

interface DataPoint {
  id: string
  timestamp: number
  value: any
  dimension: string
  connections: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt: number
  rarity: 'common' | 'rare' | 'legendary' | 'transcendent'
}

interface Interaction {
  type: string
  timestamp: number
  layer: number
  data?: any
}

const initialState = {
  currentLayer: 0,
  journeyProgress: 0,
  unlockedLayers: [0],
  dataPoints: [],
  philosophicalInsights: [],
  technicalAchievements: [],
  userInteractions: [],
  dimensionShifts: 0,
  infinityGlimpses: 0
}

export const useInfiniteStore = create<InfiniteState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setCurrentLayer: (layer) => {
          set((state) => {
            const newState = { 
              currentLayer: layer,
              journeyProgress: Math.max(state.journeyProgress, (layer / 4) * 100)
            }
            
            if (!state.unlockedLayers.includes(layer)) {
              newState.unlockedLayers = [...state.unlockedLayers, layer]
            }
            
            return newState
          })
        },

        updateJourneyProgress: () => {
          set((state) => ({
            journeyProgress: Math.min(
              100,
              (state.currentLayer / 4) * 100 + 
              (state.dataPoints.length * 0.5) +
              (state.philosophicalInsights.length * 2) +
              (state.technicalAchievements.length * 3)
            )
          }))
        },

        unlockLayer: (layer) => {
          set((state) => ({
            unlockedLayers: state.unlockedLayers.includes(layer) 
              ? state.unlockedLayers 
              : [...state.unlockedLayers, layer]
          }))
        },

        addDataPoint: (point) => {
          set((state) => {
            const newDataPoints = [...state.dataPoints, point]
            
            if (newDataPoints.length >= 10 && !state.technicalAchievements.find(a => a.id === 'data-collector')) {
              state.addTechnicalAchievement({
                id: 'data-collector',
                title: 'Data Collector',
                description: 'Gathered 10 data points across dimensions',
                unlockedAt: Date.now(),
                rarity: 'common'
              })
            }
            
            return { dataPoints: newDataPoints }
          })
          get().updateJourneyProgress()
        },

        addPhilosophicalInsight: (insight) => {
          set((state) => ({
            philosophicalInsights: [...state.philosophicalInsights, insight]
          }))
          get().updateJourneyProgress()
        },

        addTechnicalAchievement: (achievement) => {
          set((state) => ({
            technicalAchievements: [...state.technicalAchievements, achievement]
          }))
          get().updateJourneyProgress()
        },

        recordInteraction: (interaction) => {
          set((state) => ({
            userInteractions: [...state.userInteractions, interaction]
          }))
        },

        incrementDimensionShifts: () => {
          set((state) => {
            const newShifts = state.dimensionShifts + 1
            
            if (newShifts === 5 && !state.technicalAchievements.find(a => a.id === 'dimension-walker')) {
              state.addTechnicalAchievement({
                id: 'dimension-walker',
                title: 'Dimension Walker',
                description: 'Shifted through 5 dimensional planes',
                unlockedAt: Date.now(),
                rarity: 'rare'
              })
            }
            
            return { dimensionShifts: newShifts }
          })
        },

        incrementInfinityGlimpses: () => {
          set((state) => {
            const newGlimpses = state.infinityGlimpses + 1
            
            if (newGlimpses === 3 && !state.technicalAchievements.find(a => a.id === 'infinity-seeker')) {
              state.addTechnicalAchievement({
                id: 'infinity-seeker',
                title: 'Infinity Seeker',
                description: 'Glimpsed the infinite 3 times',
                unlockedAt: Date.now(),
                rarity: 'legendary'
              })
            }
            
            return { infinityGlimpses: newGlimpses }
          })
        },

        reset: () => set(initialState)
      }),
      {
        name: 'infinite-resume-storage'
      }
    )
  )
)