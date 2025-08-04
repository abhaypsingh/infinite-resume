import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export const AlgorithmVisualization: React.FC = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<'sort' | 'pathfind' | 'ml'>('sort')
  const groupRef = useRef<THREE.Group>(null)
  
  // Sorting visualization
  const SortingVisualization: React.FC = () => {
    const [sortingArray, setSortingArray] = useState<number[]>([8, 3, 5, 4, 7, 6, 1, 2])
    const [currentIndices, setCurrentIndices] = useState<[number, number]>([-1, -1])
    const [sorted, setSorted] = useState(false)
    
    useEffect(() => {
      if (!sorted) {
        const timer = setInterval(() => {
          setSortingArray(prev => {
            const arr = [...prev]
            let swapped = false
            
            for (let i = 0; i < arr.length - 1; i++) {
              if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
                setCurrentIndices([i, i + 1])
                swapped = true
                break
              }
            }
            
            if (!swapped) {
              setSorted(true)
              setCurrentIndices([-1, -1])
            }
            
            return arr
          })
        }, 1000)
        
        return () => clearInterval(timer)
      }
    }, [sorted])
    
    return (
      <group>
        {sortingArray.map((value, index) => {
          const isActive = currentIndices.includes(index)
          
          return (
            <Box
              key={index}
              position={[index * 2 - 7, value * 0.5 - 2, 0]}
              args={[1.5, value, 1]}
            >
              <meshPhysicalMaterial
                color={isActive ? '#F59E0B' : sorted ? '#10B981' : '#8B5CF6'}
                emissive={isActive ? '#F59E0B' : sorted ? '#10B981' : '#8B5CF6'}
                emissiveIntensity={isActive ? 0.5 : 0.2}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.8}
              />
            </Box>
          )
        })}
        
        <Text
          position={[0, -5, 0]}
          fontSize={0.5}
          color="#666"
          anchorX="center"
        >
          Bubble Sort: O(n²)
        </Text>
      </group>
    )
  }
  
  // Pathfinding visualization
  const PathfindingVisualization: React.FC = () => {
    const gridSize = 10
    const [path, setPath] = useState<[number, number][]>([])
    const [visited, setVisited] = useState<Set<string>>(new Set())
    const start = [0, 0]
    const end = [9, 9]
    const obstacles = new Set(['3,3', '3,4', '4,3', '4,4', '5,5', '6,5', '5,6'])
    
    useEffect(() => {
      // Simple A* pathfinding animation
      const findPath = async () => {
        const newVisited = new Set<string>()
        const queue: [number, number][] = [start]
        const cameFrom = new Map<string, [number, number]>()
        
        const timer = setInterval(() => {
          if (queue.length === 0) {
            clearInterval(timer)
            return
          }
          
          const current = queue.shift()!
          const key = `${current[0]},${current[1]}`
          newVisited.add(key)
          setVisited(new Set(newVisited))
          
          if (current[0] === end[0] && current[1] === end[1]) {
            // Reconstruct path
            const path: [number, number][] = []
            let curr = end
            while (curr[0] !== start[0] || curr[1] !== start[1]) {
              path.unshift(curr)
              curr = cameFrom.get(`${curr[0]},${curr[1]}`)!
            }
            path.unshift(start)
            setPath(path)
            clearInterval(timer)
            return
          }
          
          // Check neighbors
          const neighbors = [
            [current[0] + 1, current[1]],
            [current[0] - 1, current[1]],
            [current[0], current[1] + 1],
            [current[0], current[1] - 1]
          ]
          
          for (const neighbor of neighbors) {
            const [x, y] = neighbor
            const nKey = `${x},${y}`
            
            if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && 
                !obstacles.has(nKey) && !newVisited.has(nKey)) {
              queue.push([x, y] as [number, number])
              cameFrom.set(nKey, current)
            }
          }
        }, 200)
        
        return () => clearInterval(timer)
      }
      
      findPath()
    }, [])
    
    return (
      <group position={[-5, -5, 0]}>
        {Array.from({ length: gridSize }, (_, x) =>
          Array.from({ length: gridSize }, (_, y) => {
            const key = `${x},${y}`
            const isStart = x === start[0] && y === start[1]
            const isEnd = x === end[0] && y === end[1]
            const isObstacle = obstacles.has(key)
            const isVisited = visited.has(key)
            const isPath = path.some(p => p[0] === x && p[1] === y)
            
            return (
              <Box
                key={key}
                position={[x, y, 0]}
                args={[0.9, 0.9, 0.1]}
              >
                <meshPhysicalMaterial
                  color={
                    isStart ? '#10B981' :
                    isEnd ? '#EC4899' :
                    isObstacle ? '#6B7280' :
                    isPath ? '#F59E0B' :
                    isVisited ? '#3B82F6' :
                    '#1F2937'
                  }
                  emissive={
                    isStart || isEnd || isPath ? 
                    (isStart ? '#10B981' : isEnd ? '#EC4899' : '#F59E0B') : 
                    '#000000'
                  }
                  emissiveIntensity={isStart || isEnd || isPath ? 0.5 : 0}
                  metalness={0.8}
                  roughness={0.2}
                  transparent
                  opacity={isObstacle ? 0.3 : 0.8}
                />
              </Box>
            )
          })
        )}
        
        <Text
          position={[5, -2, 0]}
          fontSize={0.5}
          color="#666"
          anchorX="center"
        >
          A* Pathfinding
        </Text>
      </group>
    )
  }
  
  // Machine Learning visualization
  const MLVisualization: React.FC = () => {
    const neuronsPerLayer = [3, 5, 4, 2]
    const [activations, setActivations] = useState<number[][]>([])
    
    useEffect(() => {
      const timer = setInterval(() => {
        setActivations(
          neuronsPerLayer.map(count => 
            Array.from({ length: count }, () => Math.random())
          )
        )
      }, 1000)
      
      return () => clearInterval(timer)
    }, [])
    
    const neurons: { layer: number, index: number, position: THREE.Vector3 }[] = []
    
    neuronsPerLayer.forEach((count, layer) => {
      for (let i = 0; i < count; i++) {
        neurons.push({
          layer,
          index: i,
          position: new THREE.Vector3(
            layer * 3 - 4.5,
            (i - count / 2) * 1.5,
            0
          )
        })
      }
    })
    
    return (
      <group>
        {/* Neurons */}
        {neurons.map((neuron, idx) => {
          const activation = activations[neuron.layer]?.[neuron.index] || 0
          
          return (
            <Sphere
              key={idx}
              position={neuron.position}
              args={[0.3, 16, 16]}
            >
              <meshPhysicalMaterial
                color="#8B5CF6"
                emissive="#8B5CF6"
                emissiveIntensity={activation}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.5 + activation * 0.5}
              />
            </Sphere>
          )
        })}
        
        {/* Connections */}
        {neurons.map((n1, i) => 
          neurons
            .filter(n2 => n2.layer === n1.layer + 1)
            .map((n2, j) => {
              const weight = Math.random()
              
              return (
                <Line
                  key={`${i}-${j}`}
                  points={[n1.position, n2.position]}
                  color="#3B82F6"
                  lineWidth={weight * 2}
                  transparent
                  opacity={weight * 0.5}
                />
              )
            })
        )}
        
        <Text
          position={[0, -4, 0]}
          fontSize={0.5}
          color="#666"
          anchorX="center"
        >
          Neural Network Forward Pass
        </Text>
      </group>
    )
  }
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      <group position={[0, 5, 0]}>
        <Text
          position={[-4, 0, 0]}
          fontSize={0.3}
          color={activeAlgorithm === 'sort' ? '#F59E0B' : '#666'}
          anchorX="center"
          onClick={() => setActiveAlgorithm('sort')}
        >
          SORTING
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color={activeAlgorithm === 'pathfind' ? '#F59E0B' : '#666'}
          anchorX="center"
          onClick={() => setActiveAlgorithm('pathfind')}
        >
          PATHFINDING
        </Text>
        <Text
          position={[4, 0, 0]}
          fontSize={0.3}
          color={activeAlgorithm === 'ml' ? '#F59E0B' : '#666'}
          anchorX="center"
          onClick={() => setActiveAlgorithm('ml')}
        >
          MACHINE LEARNING
        </Text>
      </group>
      
      {activeAlgorithm === 'sort' && <SortingVisualization />}
      {activeAlgorithm === 'pathfind' && <PathfindingVisualization />}
      {activeAlgorithm === 'ml' && <MLVisualization />}
    </group>
  )
}