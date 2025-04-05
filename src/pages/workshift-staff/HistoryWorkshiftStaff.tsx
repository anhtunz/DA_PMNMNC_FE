import SelectOption from '../../components/common/SelectOption'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import { optionShift } from '../../assets/dataset/optionsShift'
import TableComponent from '../../components/common/TableComponent'
import { data, columns } from '../../assets/dataset/tableContent'
import { Button, Popover } from 'antd'
import { useState } from 'react'
import { FilterOutlined } from '@ant-design/icons'
const HistoryWorkshiftStaffPage = () => {
  const optionStaff = [
    {
      value: 'nv1',
      label: 'Nhân viên A'
    },
    {
      value: 'nv2',
      label: 'Nhân viên B'
    },
    {
      value: 'nv3',
      label: 'Nhân viên C'
    },
    {
      value: 'nv4',
      label: 'Nhân viên D'
    },
    {
      value: 'nv5',
      label: 'Nhân viên E'
    },
    {
      value: 'nv6',
      label: 'Nhân viên F'
    },
    {
      value: 'nv7',
      label: 'Nhân viên G'
    },
    {
      value: 'nv8',
      label: 'Nhân viên H'
    },
    {
      value: 'nv9',
      label: 'Nhân viên I'
    },
  ]
  const [open, setOpen] = useState(false)
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  const now = new Date()
  const date = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  const day = date + '/' + month + '/' + year
  //date format: yyyy/mm/dd
  const dateFormat = year + '/' + month + '/' + date
  return (
    <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${day}`}</span>
        <Popover
          content={
            <div className='flex justify-center items-end flex-col p-3 gap-3'>
              <div className='flex flex-col justify-start items-start md:items-start gap-3'>
                <div className='flex flex-row gap-3'>
                  <SelectOption optionData={optionStaff} />
                  <SelectOption optionData={optionShift} />
                </div>
                <div className='flex gap-3'>
                  <RangeCalendarComponent nowDay={dateFormat} isDisableLastDay={true} /></div>
              </div>
              <Button type='primary' style={{ width: 'fit-content' }}>
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
      </div>
      <div>
        <TableComponent
          columns={columns}
          dataSource={data}
          pageSizeCustom={5}
        />
      </div>
    </div>
  )
}
export default HistoryWorkshiftStaffPage
