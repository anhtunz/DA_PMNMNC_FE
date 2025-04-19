import { Shift } from '../../services/shift/shiftService';

/**
 * Format ngày theo định dạng "DD/MM/YYYY"
 * @param date Đối tượng Date
 * @returns Chuỗi ngày đã định dạng
 */
export const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

/**
 * Format chuỗi ngày từ API (YYYY-MM-DD) sang định dạng "DD/MM/YYYY"
 * @param dateString Chuỗi ngày từ API (YYYY-MM-DD)
 * @returns Chuỗi ngày đã định dạng (DD/MM/YYYY)
 */
export const formatAPIDateToDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDate(date);
};

/**
 * Format chuỗi ngày hiển thị (DD/MM/YYYY) thành định dạng cho API (YYYY-MM-DD)
 * @param displayDate Chuỗi ngày hiển thị (DD/MM/YYYY)
 * @returns Chuỗi ngày cho API (YYYY-MM-DD)
 */
export const formatDisplayDateToAPIDate = (displayDate: string): string => {
  const [day, month, year] = displayDate.split('/');
  return `${year}-${month}-${day}`;
};

/**
 * Format thời gian từ định dạng 24 giờ thành định dạng 12 giờ có AM/PM
 * @param timeString Chuỗi thời gian định dạng 24 giờ (HH:MM:SS)
 * @returns Chuỗi thời gian định dạng 12 giờ (hh:mm AM/PM)
 */
export const formatTimeToAMPM = (timeString: string): string => {
  if (!timeString) return '';
  
  const timeParts = timeString.split(':');
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 giờ sẽ hiển thị là 12
  
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Format thời gian ca làm việc
 * @param shift Thông tin ca làm việc
 * @returns Chuỗi hiển thị thời gian làm việc
 */
export const formatShiftTime = (shift: Shift): string => {
  if (!shift.start_time || !shift.end_time) return '';
  
  // Chỉ lấy phần giờ:phút từ chuỗi thời gian
  const startTime = shift.start_time.substring(0, 5);
  const endTime = shift.end_time.substring(0, 5);
  
  return `${startTime} - ${endTime}`;
};

/**
 * Lấy ngày đầu tuần (thứ 2) của một ngày bất kỳ
 * @param date Một ngày bất kỳ
 * @returns Ngày thứ 2 của tuần chứa ngày đã cho
 */
export const getFirstDayOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh cho Chủ nhật
  newDate.setDate(diff);
  return newDate;
};

/**
 * Lấy 7 ngày trong tuần bắt đầu từ ngày thứ 2
 * @param date Ngày bất kỳ
 * @returns Mảng 7 ngày trong tuần
 */
export const getWeekDays = (date: Date): Date[] => {
  const days = [];
  const mondayDate = getFirstDayOfWeek(date);

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(mondayDate);
    newDate.setDate(mondayDate.getDate() + i);
    days.push(newDate);
  }
  return days;
};

/**
 * Chuyển đổi ngày về thời điểm đầu ngày (00:00:00)
 * @param date Đối tượng Date
 * @returns Đối tượng Date đã đặt về đầu ngày
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Kiểm tra xem một ngày có phải là ngày trong quá khứ không
 * @param date Ngày cần kiểm tra
 * @param currentDate Ngày hiện tại (mặc định là new Date())
 * @returns true nếu là ngày trong quá khứ, false nếu không phải
 */
export const isPastDate = (date: Date, currentDate = new Date()): boolean => {
  const today = startOfDay(currentDate);
  const compareDate = startOfDay(date);
  return compareDate < today;
};

/**
 * Nhóm danh sách ca làm việc theo số ca và ngày
 * @param shifts Danh sách ca làm việc
 * @returns Object chứa các ca làm việc đã nhóm
 */
export const groupShiftsByNumberAndDate = (shifts: Shift[]): { [key: string]: Shift } => {
  const groupedShifts: { [key: string]: Shift } = {};
  
  shifts.forEach(shift => {
    const displayDate = formatAPIDateToDisplayDate(shift.date);
    const key = `${shift.shift_number}-${displayDate}`;
    groupedShifts[key] = shift;
  });
  
  return groupedShifts;
};

/**
 * Lấy danh sách các số ca làm việc duy nhất từ dữ liệu ca làm
 * @param shifts Danh sách tất cả ca làm việc
 * @returns Mảng các số ca làm việc duy nhất, đã sắp xếp
 */
export const getUniqueShiftNumbers = (shifts: Shift[]): number[] => {
  const shiftNumbers = shifts.map(shift => shift.shift_number);
  // Lọc ra các số ca làm việc duy nhất và sắp xếp
  const uniqueShiftNumbers = [...new Set(shiftNumbers)].sort((a, b) => a - b);
  return uniqueShiftNumbers;
};

/**
 * Lấy tên thứ trong tuần bằng tiếng Việt
 * @param day Số thứ tự trong tuần (0-6, 0 là Chủ nhật)
 * @returns Tên thứ bằng tiếng Việt
 */
export const getVietnameseDayName = (day: number): string => {
  const dayNames = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return dayNames[day];
};