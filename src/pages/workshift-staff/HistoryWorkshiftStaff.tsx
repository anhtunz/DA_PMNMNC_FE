import SelectOption from '../../components/common/SelectOption'
import dayjs, { Dayjs } from 'dayjs'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import { useEffect, useState } from 'react'
import { formatDateByDMY, formatDateByYMD } from '../../components/helpers/formatNowDate'
import { useSelectOption } from '../../hooks/useSelectOption'
import Filter from '../../components/common/Filter'
import useCappedDateRange from '../../hooks/useCappedDateRange'
import { getAllUser } from '../../services/userProfile/userManagementService'
import getAllHistoryWorkshift from '../../services/history-shift/staffShiftHistoryService'
import { Skeleton } from 'antd'
import EmptyData from '../../components/common/EmptyData'
import { useTitle } from '../../hooks/useTitle'

interface ShiftDetail {
  dayRegis: string
  data: {
    id: string;
    name: string;
    timeStart: string;
    timeEnd: string;
  }[];
}

interface Shift {
  user_id: string
  user_name: string
  avatar: string
  shifts_by_day: ShiftDetail[]
}
const HistoryWorkshiftStaffPage = () => {

  const [users, setUsers] = useState<{ id: string; name: string }[]>([])
  const [userWorkshiftHistory, setUserWorkshiftHistory] = useState<Shift[]>([])
  const getUsersFromApi = async () => {
    try {
      const resposne = await getAllUser();

      setUsers(resposne.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUsersFromApi()
  }, [])

  const optionUsers = users.map(item => ({
    value: item.id,
    label: item.name
  }))


  const { selected: selectedUsers, handleSelect: handleSelecteMulti } = useSelectOption(true)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
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
  const nowFormatYMD = formatDateByYMD(now)
  const nowFormatDMY = formatDateByDMY(now)
  const onChange = (range: { firstDay: Dayjs | null; lastDay: Dayjs | null }) => {
    handleDateChange(range)
  }
  const handleCallApi = async () => {
    try {
      setLoading(true)
      const startDate = rangeDate.startDate?.format('YYYY-MM-DD HH:mm:ss') ?? null;
      const endDate = rangeDate.endDate?.format('YYYY-MM-DD HH:mm:ss') ?? null;
      const body = {
        startDate,
        endDate,
        userIds: selectedUsers
      }
      const response = await getAllHistoryWorkshift(body)
      setUserWorkshiftHistory(response)
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }
  useEffect(() => {
    handleCallApi()
  }, [])

  useTitle('Lịch sử làm việc nhân viên')
  return (
    <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${nowFormatDMY}`}</span>
        <Filter open={open} setOpen={setOpen} handleApi={handleCallApi} loading={loading}>
          <SelectOption
            optionData={optionUsers}
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
      </div>
      <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
        <div className='flex flex-col gap-6 '>
          {loading ? <Skeleton active /> : userWorkshiftHistory.length === 0 ? (
            <EmptyData styleCss='h-[350px]' />
          ) : (
            userWorkshiftHistory.map((shift, key) => (
              <>
                <div className='flex flex-row items-center gap-4'>
                  <img className='rounded-full size-8 object-cover' src={shift.avatar} alt="Ảnh đại diện" />
                  <span className='font-bold'>{shift.user_name}</span>
                </div>
                <div className='flex flex-col gap-4 border bg-gray-25 rounded-xl p-5' key={key}>
                  <div className='flex flex-col gap-3'>
                    {shift.shifts_by_day.length > 0 ? shift.shifts_by_day.map((detail, key) => (
                      <div className='flex flex-col p-3 gap-5 items-start h-fit bg-gray-100 rounded-md' key={key}>
                        <span className='font-bold italic'>Ngày {dayjs(detail.dayRegis).format('DD-MM-YYYY')}</span>
                        {detail.data.map((item, key) => (
                          <div className='flex flex-col gap-2 w-full p-3 hover:bg-gray-300 rounded-xl' key={key}>
                            <span className='font-bold text-blue-400'>{item.name}</span>
                            <span className='text-gray-500'>
                              Thời gian: {item.timeStart} - {item.timeEnd}
                            </span>
                          </div>
                        ))}
                      </div>
                    )) : <div>Không tìm thấy lịch sử</div>}
                  </div>
                </div>
              </>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
export default HistoryWorkshiftStaffPage
