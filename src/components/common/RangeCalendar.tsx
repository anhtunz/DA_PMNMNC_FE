import { DatePicker, Space } from 'antd'
import dayjs from 'dayjs'
interface RangeCalendarProps {
  startDate?: string
  endDate?: string
  isDisableFirstDay?: boolean
  isDisableLastDay?: boolean
  onChange?: (range: { firstDay: string | null; lastDay: string | null }) => void
}

const RangeCalendarComponent = ({
  startDate,
  endDate,
  isDisableFirstDay,
  isDisableLastDay,
  onChange
}: RangeCalendarProps) => {
  return (
    <Space direction='vertical'>
      <DatePicker.RangePicker
        {...(startDate && endDate
          ? {
            value: [
              dayjs(startDate, 'YYYY-MM-DD'),
              dayjs(endDate, 'YYYY-MM-DD'),
            ],
          }
          : {})}
        disabled={[isDisableFirstDay ?? false, isDisableLastDay ?? false]}
        onChange={(_date, toDateString) => onChange?.({ firstDay: toDateString[0], lastDay: toDateString[1] })}
      />
    </Space>
  )
}
export default RangeCalendarComponent
