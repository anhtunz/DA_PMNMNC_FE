import SelectOption from '../../components/common/SelectOption'
import dayjs from 'dayjs'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import TableComponent from '../../components/common/TableComponent'
import { data, columns } from '../../assets/dataset/tableContent'
import { Button, Popover } from 'antd'
import { useState } from 'react'
import { FilterOutlined } from '@ant-design/icons'
import { optionStaff } from '../../assets/dataset/optionStaff'
import { formatDateByDMY, formatDateByYMD } from '../../components/helpers/formatNowDate'
import { useSelectOption } from '../../hooks/useSelectOption'
const HistoryWorkshiftStaffPage = () => {
  const shiftStaff = [
    {
      id: 0,
      staffname: 'anh quan',
      shift: [
        {
          workDate: '11/04/2025',
          detail: [
            {
              shiftname: 'ca 1',
              startTime: '6:00:00',
              endTime: '8:00:00',
            },
            {
              shiftname: 'ca 2',
              startTime: '8:00:00',
              endTime: '10:00:00',
            }
          ]
        },
        {
          workDate: '12/04/2025',
          detail: [
            {
              shiftname: 'ca 1',
              startTime: '6:00:00',
              endTime: '8:00:00',
            },
            {
              shiftname: 'ca 2',
              startTime: '8:00:00',
              endTime: '10:00:00',

            }
          ]
        }
      ]
    },
    {
      id: 1,
      staffname: 'tuan',
      shift: [
        {
          workDate: '11/04/2025',
          detail: [
            {
              shiftname: 'ca 1',
              startTime: '6:00:00',
              endTime: '8:00:00',

            },
            {
              shiftname: 'ca 2',
              startTime: '8:00:00',
              endTime: '10:00:00',

            }
          ]
        },
        {
          workDate: '12/04/2025',
          detail: [
            {
              shiftname: 'ca 1',
              startTime: '6:00:00',
              endTime: '8:00:00',
            },
            {
              shiftname: 'ca 2',
              startTime: '8:00:00',
              endTime: '10:00:00',
            }
          ]
        }
      ]
    }
  ]
  const { selected: selectedMulti, handleSelect: handleSelecteMulti } = useSelectOption(true)

  const [open, setOpen] = useState(false)
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  const handleCallApi = (open: boolean) => {
    setOpen(!open)
  }

  /** Xử lí dữ liệu date 
   * @param {nowFormatYMD} - ngày hiện tại theo định dạng YYYY/MM/DD
   * @param {nowFormatDMY} - ngày hiện tại theo định dạng DD/MM/YYYY
   * @param {rangeDate} - khoảng thời gian được chọn
   * @param {onChange} - hàm xử lí khi chọn khoảng thời gian
   * @description
    * `onChange` sẽ nhận vào 2 tham số là `firstDay` và `lastDay`, nếu không có giá trị thì sẽ gán bằng ngày hiện tại.
    * Nếu `firstDay` hoặc `lastDay` lớn hơn ngày hiện tại thì sẽ gán lại bằng ngày hiện tại.
  */
  const now = new Date()
  const nowFormatYMD = formatDateByYMD(now)
  const nowFormatDMY = formatDateByDMY(now)
  const [rangeDate, setRangeDate] = useState({ startDate: nowFormatYMD, endDate: nowFormatYMD })

  const onChange = (range: { firstDay: string | null; lastDay: string | null }) => {
    let startDate = range.firstDay ?? nowFormatYMD
    let endDate = range.lastDay ?? nowFormatYMD
    let startDateDayjs = dayjs(startDate, 'YYYY-MM-DD');
    let endDateDayjs = dayjs(endDate, 'YYYY-MM-DD');
    if (startDateDayjs.isAfter(now)) {
      startDateDayjs = dayjs(now).startOf('day');
      startDate = startDateDayjs.format('YYYY-MM-DD');
    }

    if (endDateDayjs.isAfter(now)) {
      endDateDayjs = dayjs(now).endOf('day');
      endDate = endDateDayjs.format('YYYY-MM-DD');
    }
    setRangeDate({ startDate, endDate })
  }

  return (
    <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${nowFormatDMY}`}</span>
        <Popover
          content={
            <div className='flex justify-center items-end flex-col p-3 gap-3 sm:w-[400px] max-w-full'>
              <div className='flex flex-col justify-start items-start md:items-start gap-3 w-full'>
                <SelectOption
                  optionData={optionStaff}
                  isMultiSelect={true}
                  placeholder='Chọn nhân viên'
                  customWidth='100%'
                  onChange={handleSelecteMulti} />
                <div className='flex flex-col gap-2 w-full'>
                  <span className='font-bold'>Chọn thời gian</span>
                  <RangeCalendarComponent
                    startDate={rangeDate.startDate}
                    endDate={rangeDate.endDate}
                    isDisableLastDay={false}
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
      <div className='flex flex-col gap-6 '>
        {shiftStaff.map((item) => (
          <div className='flex flex-col gap-4 border bg-gray-50 rounded-xl p-5'>
            <span className='font-bold text-2xl'>Image {item.staffname} (email)</span>
            <div className='flex flex-col gap-3'>
              {item.shift.map((infoShift) => (
                <div className='flex flex-col gap-3'>
                  <span className='font-bold italic'>Ngày: {infoShift.workDate}</span>
                  <section className='flex flex-col gap-3'>
                    {infoShift.detail.map((detail) => (
                      <div className='flex p-3 gap-5 items-center h-fit bg-gray-100 rounded-md'>
                        <div className='flex flex-col gap-2 w-[35%]'>
                          <span className='font-bold text-blue-400'>{detail.shiftname}</span>
                          <span className='text-gray-400'>
                            Thời gian: {detail.startTime} - {detail.endTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </section>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default HistoryWorkshiftStaffPage
