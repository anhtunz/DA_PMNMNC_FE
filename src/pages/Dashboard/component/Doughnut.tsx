import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

type DoughnutChartProps = {
  data: {
    label: string
    value: number
    color: string
  }[]
  className?: string
  showLegend?: boolean
  centerText?: {
    main: string
    sub: string
  }
  size?: 'small' | 'medium' | 'large'
}

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  className = '',
  showLegend = true,
  centerText,
  size = 'medium'
}) => {
  const [animatedData, setAnimatedData] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Animation effect
  useEffect(() => {
    if (data.length === 0) {
      setAnimatedData([])
      return
    }

    const targetValues = data.map((item) => item.value)
    const startValues =
      animatedData.length === targetValues.length ? animatedData : new Array(targetValues.length).fill(0)

    setIsAnimating(true)

    const duration = 1000
    const steps = 40
    const stepDuration = duration / steps

    let currentStep = 0

    const animate = () => {
      currentStep++
      const progress = Math.min(currentStep / steps, 1)

      // Easing function (ease-out-cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      const newValues = targetValues.map((targetValue, index) => {
        const startValue = startValues[index] || 0
        return startValue + (targetValue - startValue) * easeProgress
      })

      setAnimatedData(newValues)

      if (progress < 1) {
        setTimeout(animate, stepDuration)
      } else {
        setIsAnimating(false)
      }
    }

    animate()
  }, [data])

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: animatedData.length > 0 ? animatedData : data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderWidth: 0,
        cutout: '70%',
        borderRadius: 4,
        spacing: 2
      }
    ]
  }

  const getChartSize = () => {
    switch (size) {
      case 'small':
        return 'h-48'
      case 'large':
        return 'h-80'
      default:
        return 'h-64'
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable default animation
    },
    onHover: (event: any, elements: any) => {
      if (elements && elements.length > 0) {
        setHoveredIndex(elements[0].index)
      } else {
        setHoveredIndex(null)
      }
      // Change cursor
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default'
    },
    plugins: {
      legend: {
        display: false 
      },
      tooltip: {
        enabled: false 
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  }

  // Calculate center text values based on hover or default
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Determine what to show in center - only when hovering
  let displayCenterText
  if (centerText && hoveredIndex !== null) {
    displayCenterText = centerText
  } else if (hoveredIndex !== null && data[hoveredIndex]) {
    displayCenterText = {
      main: data[hoveredIndex].label,
      sub: data[hoveredIndex].value.toString()
    }
  }

  return (
    <div className={`${className}`}>
      <div className='relative'>
        {/* Chart Container */}
        <div className={`relative ${getChartSize()}`}>
          <Doughnut data={chartData} options={chartOptions} />

          {/* Center Text - Only show when hovering */}
          {hoveredIndex !== null && (
            <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
              <div className='text-center transition-all duration-200 ease-in-out animate-fade-in'>
                <div className='text-lg font-semibold text-gray-800 transition-all duration-200'>
                  {displayCenterText?.main}
                </div>
                <div className='text-2xl font-bold text-gray-900 mt-1 transition-all duration-200'>
                  {displayCenterText?.sub}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Legend */}
        {showLegend && (
          <div className='flex flex-wrap justify-center gap-4 mt-6'>
            {data.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
              return (
                <div key={index} className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
                  <span className='text-sm text-gray-600 font-medium'>{item.label}</span>
                  <span className='text-xs text-gray-400'>({percentage}%)</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoughnutChart
