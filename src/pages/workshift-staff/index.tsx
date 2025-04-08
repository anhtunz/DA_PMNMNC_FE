import { useState } from 'react'
import { Button, Popover } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import SelectOption from '../../components/common/SelectOption'
import TableComponent from '../../components/common/TableComponent'
import ConfirmModal from '../../components/common/ConfirmModal'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import { formatDateByYMD, formatDateByDMY } from '../../components/helpers/formatNowDate'
import { data, columns } from '../../assets/dataset/tableContent'
import { optionStaff } from '../../assets/dataset/optionStaff'
import { useSelectOption } from '../../hooks/useSelectOption'
import { getCurrentWeek, getCurrentMonth } from '../../components/helpers/dateRange'
const WorkshiftStaffPage = () => {
  const optionTime = [
    {
      value: 'week',
      label: 'Tuần này'
    },
    {
      value: 'month',
      label: 'Tháng này'
    }
  ]

  const { selected: selectedSingle, handleSelect: handleSelectSingle } = useSelectOption(false)
  const { selected: selectedMulti, handleSelect: handleSelecteMulti } = useSelectOption(true)


  const handleRemoveItem = (key: string) => {
    console.log(key)
  }
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  const handleCallApi = (open: boolean) => {
    setOpen(!open)
  }
  /** Xử lí dữ liệu date 
   * @param {nowFormatYMD} - là ngày hiện tại theo định dạng YYYY/MM/DD
   * @param {nowFormatDMY} - là ngày hiện tại theo định dạng DD/MM/YYYY
   * @param {rangeDate} - là khoảng thời gian được chọn
   * @param {onChange} - là hàm xử lí khi chọn khoảng thời gian
  */
  const now = new Date()
  const dateFormatYMD = formatDateByYMD(now)
  const dateFormatDMY = formatDateByDMY(now)
  const [rangeDate, setRangeDate] = useState({ startDate: dateFormatYMD, endDate: dateFormatYMD })
  const onChange = (range: { firstDay: string | null; lastDay: string | null }) => {
    setRangeDate({ startDate: range.firstDay ?? dateFormatYMD, endDate: range.lastDay ?? dateFormatYMD })
  }

  let timeWeek, timeMonth
  if (selectedSingle === 'week') {
    timeWeek = getCurrentWeek(dateFormatYMD);
  } else if (selectedSingle === 'month') {
    timeMonth = getCurrentMonth(dateFormatYMD);
  }
  return (
    <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${dateFormatDMY}`}</span>
        <Popover
          content={
            <div className='flex justify-center items-end flex-col p-3 gap-3 sm:w-[400px] max-w-full'>
              <div className='flex flex-col justify-start items-start md:items-start gap-3 w-full'>
                <SelectOption
                  optionData={optionStaff}
                  isMultiSelect={true}
                  placeholder='Chọn nhân viên'
                  customWidth='100%'
                  onChange={handleSelecteMulti}
                />
                <div className='flex gap-4'>
                  <SelectOption
                    optionData={optionTime}
                    isMultiSelect={false}
                    placeholder='Chọn thời gian'
                    customWidth='50%'
                    onChange={handleSelectSingle}
                  />
                  <RangeCalendarComponent
                    startDate={rangeDate.startDate}
                    endDate={rangeDate.endDate}
                    isDisableFirstDay={true}
                    onChange={onChange}
                  />
                </div>
              </div>
              <Button type='primary' style={{ width: 'fit-content' }} onClick={() => handleCallApi(open)}>
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
          actions={(record) => (
            <ConfirmModal
              type='default'
              variant='solid'
              color='danger'
              confirmContent={'Bạn có chắc chắn muốn xoá không'}
              handleOk={() => handleRemoveItem(record.key)}
              btnText={'Delete'}
            />
          )}
        />
      </div>
    </div>
  )
}
export default WorkshiftStaffPage
