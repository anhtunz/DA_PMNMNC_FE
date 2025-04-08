import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)

const tz = 'Asia/Ho_Chi_Minh'

export const getCurrentWeek = (date: string | Date = new Date()) => {
  const startOfWeek = dayjs(date).tz(tz).startOf('isoWeek').format('YYYY-MM-DD')
  const endOfWeek = dayjs(date).tz(tz).endOf('isoWeek').format('YYYY-MM-DD')
  return [startOfWeek, endOfWeek]
}

export const getCurrentMonth = (date: string | Date = new Date()) => {
  const startOfMonth = dayjs(date).tz(tz).startOf('month').format('YYYY-MM-DD')
  const endOfMonth = dayjs(date).tz(tz).endOf('month').format('YYYY-MM-DD')
  return [startOfMonth, endOfMonth]
}
