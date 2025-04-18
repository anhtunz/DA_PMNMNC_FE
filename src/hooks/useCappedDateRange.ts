import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

type RangeInput = { firstDay: Dayjs | null; lastDay: Dayjs | null }
type RangeOutput = { startDate: Dayjs | null; endDate: Dayjs | null }

//hook xử lí giới hạn ngày khi chon quá ngày hiện tại
const useCappedDateRange = () => {
  const [rangeDate, setRangeDate] = useState<RangeOutput>({
    startDate: null,
    endDate: null,
  })

  const handleDateChange = (range: RangeInput) => {
    const now = dayjs()
    let startDate = range.firstDay
    let endDate = range.lastDay

    if (startDate && startDate.isAfter(now)) {
      startDate = now.startOf('day')
    }

    if (endDate && endDate.isAfter(now)) {
      endDate = now.startOf('day')
    }

    setRangeDate({
      startDate,
      endDate,
    })
  }

  return { rangeDate, handleDateChange }
}

export default useCappedDateRange
