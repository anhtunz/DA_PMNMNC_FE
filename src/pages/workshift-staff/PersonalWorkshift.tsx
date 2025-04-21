import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { formatDateByDMY } from '../../components/helpers/formatNowDate'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import Filter from '../../components/common/Filter'
import getUserShiftHistory from '../../services/userShift/userShiftHistoryService'
import useUserStore from '../../stores/userStore'
import useCappedDateRange from '../../hooks/useCappedDateRange'
import { Skeleton } from 'antd'
import EmptyData from '../../components/common/EmptyData'
interface ShiftDetail {
  name: string;
  timeStart: string;
  timeEnd: string;
}

interface Shift {
  dayRegis: string;
  data: ShiftDetail[];
}

const PersonalWorkshift = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [historyShiftPersonalUser, setHistoryShiftPersonalUser] = useState<Shift[]>([])
  const { user } = useUserStore()
  const { rangeDate, handleDateChange } = useCappedDateRange()
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
  const nowFormatDMY = formatDateByDMY(now)
  // const [rangeDate, setRangeDate] = useState<{ startDate: Dayjs | null; endDate: Dayjs | null }>({ startDate: null, endDate: null })
  const onChange = (range: { firstDay: Dayjs | null; lastDay: Dayjs | null }) => {
    handleDateChange(range)
  }

  const handleCallApi = async () => {
    try {
      setLoading(true)
      setOpen(false)
      const startDate = rangeDate.startDate?.format('YYYY-MM-DD HH:mm:ss') ?? null;
      const endDate = rangeDate.endDate?.format('YYYY-MM-DD HH:mm:ss') ?? null;
      const response = await getUserShiftHistory(startDate, endDate)
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setHistoryShiftPersonalUser(data)
    } catch (error) {
      setLoading(false)
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    handleCallApi()
  }, [])

  return (
    <>
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${nowFormatDMY}`}</span>
        <Filter open={open} setOpen={setOpen} loading={loading} handleApi={handleCallApi}>
          <div className='flex flex-col gap-2 w-full'>
            <span className='font-bold'>Chọn thời gian</span>
            <RangeCalendarComponent
              startDate={rangeDate.startDate?.format('YYYY-MM-DD') || undefined}
              endDate={rangeDate.endDate?.format('YYYY-MM-DD') || undefined}
              isDisableLastDay={false}
              onChange={onChange}
            />
          </div>
        </Filter>
      </div>

      <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
        <div className='flex flex-col gap-6 '>
          <div className='flex flex-row items-center gap-4'>
            <img className='rounded-full size-8 object-cover' src={user?.avatar} alt="Ảnh đại diện" />
            <span className='font-bold'>{user?.name}</span>
            <span className='font-bold'>({user?.email})</span>
          </div>
          {loading ? <Skeleton active /> : historyShiftPersonalUser.length === 0 ? (
            <EmptyData styleCss='h-[350px]' />
          ) : (
            historyShiftPersonalUser.map((shift, key) => (
              <div className='flex flex-col gap-4 border bg-gray-25 rounded-xl p-5' key={key}>
                <div className='flex flex-col gap-3'>
                  <span className='font-bold italic'>Ngày {dayjs(shift.dayRegis).format('DD-MM-YYYY')}</span>
                  {Object.values(shift.data).map((detail, key) => (
                    <div className='flex p-3 gap-5 items-center h-fit bg-gray-100 rounded-md' key={key}>
                      <div className='flex flex-col gap-2'>
                        <span className='font-bold text-blue-400'>{detail.name}</span>
                        <span className='text-gray-500'>
                          Thời gian: {detail.timeStart} - {detail.timeEnd}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
export default PersonalWorkshift
