import { Tag } from 'antd'
import React from 'react'
import millify from 'millify'

type LastMonthComparisonFigureProps = {
  title: string
  newQuantity: number
  oldQuantity: number
  type: number
}

const LastMonthComparisonFigure: React.FC<LastMonthComparisonFigureProps> = ({
  title,
  newQuantity,
  oldQuantity,
  type
}) => {
  const formatNumber = ({ money }: { money: number }): string => {
    if (type === 0) {
      return millify(money)
    } else if(type === 1) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(money)
    } else {
        return `${money}%`
    }
  }
  const getPercentage = () => {
    if (oldQuantity === 0) {
      return '+100%'
    } else {
      const percent = ((newQuantity - oldQuantity) / oldQuantity) * 100
      const rounded = Math.round(percent * 100) / 100
      return newQuantity > oldQuantity ? `+${rounded}%` : `${rounded}%`
    }
  }

  return (
    <div className='bg-white rounded-xl p-5 shadow-sm text-gray-600'>
      <h3 className='text-base font-medium mb-4'>{title}</h3>
      <div className='flex items-center justify-between'>
        <span className='text-3xl font-bold'>{formatNumber({ money: newQuantity })}</span>
        <div className='flex items-center gap-2'>
          <Tag color={newQuantity > oldQuantity ? 'green' : 'red'}>{getPercentage()}</Tag>
          <span className='text-sm'>so với tháng trước</span>
        </div>
      </div>
    </div>
  )
}

export default LastMonthComparisonFigure
