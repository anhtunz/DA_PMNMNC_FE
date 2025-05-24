import { Divider } from 'antd'
import React from 'react'

type TopFiveServicesOrRoomProps = {
  title: string
  name: string
  datas: any
}

const TopFiveServicesOrRoom: React.FC<TopFiveServicesOrRoomProps> = ({ title, name, datas }) => {
  return (
    <div className='rounded-xl bg-white shadow-sm'>
      <h3 className='p-4 text-lg font-semibold text-gray-800'>{title}</h3>

      <div className='px-4 flex justify-between'>
        <div className='text-gray-400 text-sm'>{name}</div>
        <div className='text-gray-400 text-sm'>Số lần sử dụng</div>
      </div>

      <Divider className='my-0.5' />
      {datas.map((data: any) => (
        <React.Fragment key={data.id}>
          <div className='px-4 py-1 flex justify-between items-center transition-colors'>
            <div className='text-gray-600 '>{data.name}</div>
            <div className='text-gray-600 font-medium'>{data.usage_count}</div>
          </div>
          <Divider className='my-0.5' />
        </React.Fragment>
      ))}
    </div>
  )
}

export default TopFiveServicesOrRoom
