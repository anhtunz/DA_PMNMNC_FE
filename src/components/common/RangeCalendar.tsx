import { DatePicker, Space } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'
interface InitialCalender {
  firstDay: string | null
  lastDay: string | null
}

interface RangeCalendarProps {
  nowDay: string
  isDisableFirstDay?: boolean
  isDisableLastDay?: boolean
}

const RangeCalendarComponent = ({ nowDay, isDisableFirstDay, isDisableLastDay }: RangeCalendarProps) => {
  const [time, setTime] = useState<InitialCalender>({ firstDay: null, lastDay: null })
  const onChangeRangerTime = (rangeDate: InitialCalender) => {
    setTime(rangeDate)
  }
  console.log(time)
  return (
    <Space direction='vertical'>
      <DatePicker.RangePicker
        defaultValue={[dayjs(`${nowDay}`, 'YYYY-MM-DD'), dayjs(`${nowDay}`, 'YYYY-MM-DD')]}
        disabled={[isDisableFirstDay ?? false, isDisableLastDay ?? false]}
        onChange={(_date, toDateString) => onChangeRangerTime({ firstDay: toDateString[0], lastDay: toDateString[1] })}
      />
    </Space>
  )
}
export default RangeCalendarComponent
