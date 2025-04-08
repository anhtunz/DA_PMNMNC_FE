export const formatDateByYMD = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const formatDay = year + '/' + month + '/' + day
  return formatDay
}
export const formatDateByDMY = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const formatDate = day + '/' + month + '/' + year
  return formatDate
}