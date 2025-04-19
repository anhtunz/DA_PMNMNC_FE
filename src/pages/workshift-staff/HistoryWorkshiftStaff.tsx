import SelectOption from '../../components/common/SelectOption'
import { Dayjs } from 'dayjs'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import { useState } from 'react'
import { optionStaff } from '../../assets/dataset/optionStaff'
import { formatDateByDMY, formatDateByYMD } from '../../components/helpers/formatNowDate'
import { useSelectOption } from '../../hooks/useSelectOption'
import { Link } from 'react-router-dom'
import Filter from '../../components/common/Filter'
import useCappedDateRange from '../../hooks/useCappedDateRange'
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
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { rangeDate, handleDateChange } = useCappedDateRange()

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
  const onChange = (range: { firstDay: Dayjs | null; lastDay: Dayjs | null }) => {
    handleDateChange(range)
  }

  return (
    <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${nowFormatDMY}`}</span>
        <Filter open={open} setOpen={setOpen} handleApi={() => handleCallApi} loading={loading}>
          <SelectOption
            optionData={optionStaff}
            isMultiSelect={true}
            placeholder='Chọn nhân viên'
            customWidth='100%'
            onChange={handleSelecteMulti} />
          <div className='flex flex-col gap-2 w-full'>
            <span className='font-bold'>Chọn thời gian</span>
            <RangeCalendarComponent
              startDate={rangeDate.startDate?.format('YYYY-MM-DD') || nowFormatYMD}
              endDate={rangeDate.endDate?.format('YYYY-MM-DD') || nowFormatYMD}
              isDisableLastDay={false}
              onChange={onChange}
            />
          </div>
        </Filter>
        <Link to={'/personal-history-workshift'}>Lịch sử cá nhân</Link>
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
