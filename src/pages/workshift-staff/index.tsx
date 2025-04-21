import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import SelectOption from '../../components/common/SelectOption'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import { formatDateByYMD, formatDateByDMY } from '../../components/helpers/formatNowDate'
import { optionStaff } from '../../assets/dataset/optionStaff'
import { useSelectOption } from '../../hooks/useSelectOption'
import { getCurrentWeek, getCurrentMonth } from '../../components/helpers/dateRange'
import { timeFilterOption } from '../../assets/dataset/timeFilerOption'
import Filter from '../../components/common/Filter'
const WorkshiftStaffPage = () => {

  const { selected: selectedSingle, handleSelect: handleSelectSingle } = useSelectOption(false)
  const { selected: selectedMulti, handleSelect: handleSelecteMulti } = useSelectOption(true)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleCallApi = () => {
    try {
      setLoading(true)
    } catch (error) {
      setLoading(false)
      console.log(error);
    } finally {
      setLoading(false)
      setOpen(false)
    }
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
  const [rangeDate, setRangeDate] = useState<{ startDate: Dayjs | null; endDate: Dayjs | null }>({ startDate: null, endDate: null })
  const onChange = (range: { firstDay: Dayjs | null; lastDay: Dayjs | null }) => {
    let startDate = range.firstDay?.format('YYYY-MM-DD HH:mm:ss');
    let endDate = range.lastDay?.format('YYYY-MM-DD HH:mm:ss');
    setRangeDate({
      startDate: startDate ? dayjs(startDate) : null,
      endDate: endDate ? dayjs(endDate) : null,
    });
  };

  let timeWeek, timeMonth
  if (selectedSingle === 'week') {
    timeWeek = getCurrentWeek(dateFormatYMD)
  } else if (selectedSingle === 'month') {
    timeMonth = getCurrentMonth(dateFormatYMD)
  }
  return (
    <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${dateFormatDMY}`}</span>
        <Filter open={open} setOpen={setOpen} loading={loading} handleApi={handleCallApi}>
          <SelectOption
            optionData={optionStaff}
            isMultiSelect={true}
            placeholder='Chọn nhân viên'
            customWidth='100%'
            onChange={handleSelecteMulti}
          />
          <div className='flex gap-4'>
            <SelectOption
              optionData={timeFilterOption}
              isMultiSelect={false}
              placeholder='Chọn thời gian'
              customWidth='50%'
              onChange={handleSelectSingle}
            />
            <RangeCalendarComponent
              startDate={rangeDate.startDate?.format('YYYY-MM-DD') || dateFormatYMD}
              endDate={rangeDate.endDate?.format('YYYY-MM-DD') || dateFormatYMD}
              isDisableFirstDay={true}
              onChange={onChange}
            />
          </div>
        </Filter>
      </div>
    </div>
  )
}
export default WorkshiftStaffPage
