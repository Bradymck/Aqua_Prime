import React from 'react';
import { motion } from 'framer-motion'

interface BatteryProps {
  level: number;
  onDrain: (amount: number) => void;
}

export default function Battery({ level }: BatteryProps) {
  const batteryWidth = 35
  const batteryHeight = 20
  const cornerRadius = 3
  const tipHeight = 3
  const tipWidth = 8
  const segmentCount = 4
  const segmentGap = 1.5
  const activeSegments = Math.ceil((level / 100) * segmentCount)
  const frameWidth = 2
  const framePadding = 2

  const getBatteryColor = () => {
    if (level <= 25) return '#FF4136'
    if (level <= 50) return '#FFDC00'
    return '#2ECC40'
  }

  return (
    <div className="relative" style={{ 
      width: batteryWidth + 2 * (frameWidth + framePadding), 
      height: batteryHeight + 2 * (frameWidth + framePadding) 
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md rounded-lg" style={{ padding: frameWidth }}>
        <div className="w-full h-full bg-gray-800 bg-opacity-50 rounded-lg" style={{ padding: framePadding }}>
          <svg width={batteryWidth} height={batteryHeight} viewBox={`0 0 ${batteryWidth} ${batteryHeight}`}>
            {/* Battery outline */}
            <rect
              x={0}
              y={0}
              width={batteryWidth - tipHeight}
              height={batteryHeight}
              rx={cornerRadius}
              fill="none"
              stroke="#2ECC40"
              strokeWidth="1"
            />
            
            {/* Battery tip */}
            <rect
              x={batteryWidth - tipHeight}
              y={(batteryHeight - tipWidth) / 2}
              width={tipHeight}
              height={tipWidth}
              fill="#2ECC40"
            />

            {/* Battery segments */}
            {[...Array(segmentCount)].map((_, index) => {
              const segmentSize = (batteryWidth - tipHeight - (segmentCount + 1) * segmentGap) / segmentCount
              const x = segmentGap + index * (segmentSize + segmentGap)
              const y = segmentGap
              return (
                <motion.rect
                  key={index}
                  x={x}
                  y={y}
                  width={segmentSize}
                  height={batteryHeight - 2 * segmentGap}
                  rx={2}
                  fill={getBatteryColor()}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: index < activeSegments ? 1 : 0.2, scale: index < activeSegments ? 1 : 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              )
            })}

            {/* Battery level text */}
            <text
              x={batteryWidth / 2 - tipHeight / 2}
              y={batteryHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
            >
              {Math.round(level)}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}