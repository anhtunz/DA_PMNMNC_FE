import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

type BarChartProps = {
  type: number
  labels: string[]
  values: number[]
  className?: string
  showCurrency?: boolean
  color?: string
  stepSize?: number
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const BarChart: React.FC<BarChartProps> = ({
  type,
  labels,
  values,
  className = '',
  showCurrency = true,
  color = '#4F46E5',
  stepSize = 1000
}) => {
  const [animatedValues, setAnimatedValues] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const convertDatesToWeekdays = (labels: string[]): string[] => {
    return labels.map((dateStr) => {
      const date = new Date(dateStr)
      const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(date)
      return weekday.charAt(0).toUpperCase() + weekday.slice(1) // Viết hoa chữ đầu
    })
  }
    
  useEffect(() => {
    if (values.length === 0) {
      setAnimatedValues([])
      return
    }

    const startValues = animatedValues.length === values.length ? animatedValues : new Array(values.length).fill(0)

    setIsAnimating(true)

    const duration = 800
    const steps = 30
    const stepDuration = duration / steps

    let currentStep = 0

    const animate = () => {
      currentStep++
      const progress = Math.min(currentStep / steps, 1)

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      const newValues = values.map((targetValue, index) => {
        const startValue = startValues[index] || 0
        return startValue + (targetValue - startValue) * easeProgress
      })

      setAnimatedValues(newValues)

      if (progress < 1) {
        setTimeout(animate, stepDuration)
      } else {
        setIsAnimating(false)
      }
    }

    animate()
  }, [values])

  const maxValue = Math.max(...(animatedValues.length > 0 ? animatedValues : values))
  const minValue = Math.min(...(animatedValues.length > 0 ? animatedValues : values))
  const padding = Math.max(1000, (maxValue - minValue) * 0.1)

  const chartData = {
    labels: type === 1 ? convertDatesToWeekdays(labels) : labels,
    datasets: [
      {
        data: animatedValues.length > 0 ? animatedValues : values,
        backgroundColor: color,
        borderRadius: 4,
        borderSkipped: false as const,
        barThickness: 16,
        maxBarThickness: 20
      }
    ]
  }
  const getTitle = () => {
    if (type === 1) {
      return 'Thứ'
    } else if (type === 2) {
      return 'Tháng'
    } else {
      return ''
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#111827',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 14,
          weight: 'bold' as const
        },
        callbacks: {
          title: (items: any) => {
            const label = items[0].label
            if (!isNaN(Number(label))) {
              return `${getTitle()} ${label}`
            }
            return label
          },
          label: (context: any) => {
            const displayValue = animatedValues.length > 0 ? values[context.dataIndex] : context.parsed.y
            if (showCurrency) {
              return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(displayValue)
            }
            return new Intl.NumberFormat('vi-VN').format(displayValue)
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: minValue > 0 ? false : true,
        min: minValue > 0 ? Math.max(0, minValue - padding) : 0,
        max: maxValue + padding,
        grid: {
          color: '#F3F4F6',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          stepSize: stepSize,
          callback: (value: any) => {
            if (showCurrency) {
              return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                notation: value >= 1000000 ? 'compact' : 'standard'
              }).format(value)
            }
            return new Intl.NumberFormat('vi-VN', {
              notation: value >= 1000 ? 'compact' : 'standard'
            }).format(value)
          }
        }
      }
    },
    onHover: (event: any, elements: any) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default'
    }
  }

  return (
    <div className={`w-full h-full ${className} ${isAnimating ? 'transition-opacity duration-300' : ''}`}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  )
}

export default BarChart
