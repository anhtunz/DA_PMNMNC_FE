import { DatePicker, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
interface RangeCalendarProps {
  startDate?: string
  endDate?: string
  isDisableFirstDay?: boolean
  isDisableLastDay?: boolean
  onChange?: (range: { firstDay: Dayjs | null; lastDay: Dayjs | null }) => void
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
        onChange={(dates) => {
          onChange?.({
            firstDay: dates?.[0] ?? null,
            lastDay: dates?.[1] ?? null
          });
        }}

      />
    </Space>
  )
}
export default RangeCalendarComponent
