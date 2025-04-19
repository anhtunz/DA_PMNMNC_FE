import { FilterOutlined } from '@ant-design/icons'
import { Button, Popover } from 'antd'
import React from 'react'

interface InitialProps {
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  handleApi: () => void
  loading: boolean
}
const Filter = ({ children, open, setOpen, handleApi, loading }: InitialProps) => {
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Popover
      content={
        <div className='flex justify-center items-end flex-col p-3 gap-3 sm:w-[400px] max-w-full'>
          <div className='flex flex-col justify-start items-start md:items-start gap-3 w-full'>{children}</div>
          <Button type='primary' loading={loading} style={{ width: 'fit-content' }} onClick={handleApi}>
            Tìm kiếm
          </Button>
        </div>
      }
      title='Lọc kết quả'
      trigger='click'
      placement='bottomRight'
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type='primary'>
        <FilterOutlined />
        Filter
      </Button>
    </Popover>
  )
}
export default Filter
