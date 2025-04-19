import { useState, useEffect } from 'react';
import { DatePicker, Button, message, Spin } from 'antd';
import { CalendarOutlined } from '@ant-design/icons'; // Đã xóa SaveOutlined vì không cần thiết nữa
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import ShiftService, { Shift } from '../../services/shift/shiftService';
import 'antd/dist/reset.css';

// Định nghĩa một kiểu cho giá trị của DatePicker
type DatePickerValue = dayjs.Dayjs;


function ShiftRegistration() {
  // Trạng thái cho ngày hiện tại và ngày đã chọn
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingShift, setProcessingShift] = useState<string | null>(null); // Lưu ID của ca đang xử lý
  const [selectedShifts, setSelectedShifts] = useState<Record<string, boolean>>({});

  // Cập nhật ngày hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tải dữ liệu ca làm khi component được mount
  useEffect(() => {
    fetchShifts();
  }, []);

  // Lấy dữ liệu ca làm từ API
  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await ShiftService.getAllShifts();
      setShifts(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Không thể tải dữ liệu ca làm');
      setLoading(false);
    }
  };

  // Format date as DD/MM/YYYY for display
  const formatDateForDisplay = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format date as YYYY-MM-DD for API
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Điều hướng đến tuần trước
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);

    // Không cho phép điều hướng đến ngày trước ngày hiện tại
    if (newDate >= startOfDay(currentDate)) {
      setSelectedDate(newDate);
    }
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // Get the start of day for a date
  const startOfDay = (date: Date): Date => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  // Check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = startOfDay(currentDate);
    const compareDate = startOfDay(date);
    return compareDate < today;
  };

  const isCellDisabled = (date: Date): boolean => {
    return isPastDate(date);
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const mondayDate = new Date(date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    mondayDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(mondayDate);
      newDate.setDate(mondayDate.getDate() + i);
      days.push(newDate);
    }
    return days;
  };

  const getFirstDayOfWeek = (date: Date): Date => {
    const newDate = new Date(date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    newDate.setDate(diff);
    return newDate;
  };

  const handleDateChange = (date: DatePickerValue | null) => {
    if (date) {
      const jsDate = date.toDate();

      if (jsDate >= startOfDay(currentDate)) {
        setSelectedDate(jsDate);
      }
    }
  };

  // Hàm gửi đăng ký ca lên server
  const registerShiftWithServer = async (shiftId: string, date: Date, isSelected: boolean) => {
    try {
      const apiDate = formatDateForAPI(date);
      const displayDate = formatDateForDisplay(date);
      const shiftKey = `${shiftId}-${displayDate}`;

      setProcessingShift(shiftKey); // Đánh dấu ca đang xử lý

      const result = await ShiftService.registerShift(shiftId, apiDate);

      if (result.success) {
        // Cập nhật UI và hiển thị thông báo thành công
        setSelectedShifts(prev => ({
          ...prev,
          [shiftKey]: isSelected
        }));
        message.success(`${isSelected ? 'Đăng ký' : 'Hủy đăng ký'} ca làm thành công`);
      } else {
        // Hiển thị thông báo lỗi và không cập nhật UI
        message.error(`Lỗi: ${result.message}`);
        // Khôi phục trạng thái trước đó
        setSelectedShifts(prev => ({
          ...prev,
          [shiftKey]: !isSelected
        }));
      }
    } catch (error) {
      console.error('Error registering shift:', error);
      message.error('Đăng ký ca làm thất bại');

      // Khôi phục trạng thái trước đó nếu có lỗi
      const displayDate = formatDateForDisplay(date);
      const shiftKey = `${shiftId}-${displayDate}`;
      setSelectedShifts(prev => ({
        ...prev,
        [shiftKey]: !isSelected
      }));
    } finally {
      setProcessingShift(null); // Kết thúc xử lý
    }
  };

  const toggleShift = (shiftId: string, date: Date) => {
    if (isPastDate(date) || isCellDisabled(date)) {
      return;
    }

    const displayDate = formatDateForDisplay(date);
    const shiftKey = `${shiftId}-${displayDate}`;
    const isCurrentlySelected = selectedShifts[shiftKey];

    // Đảo ngược trạng thái trước để ngay lập tức phản hồi UI
    setSelectedShifts(prev => ({
      ...prev,
      [shiftKey]: !prev[shiftKey]
    }));

    // Gửi đăng ký lên server
    registerShiftWithServer(shiftId, date, !isCurrentlySelected);
  };

  const toggleDayShifts = (date: Date) => {
    if (isPastDate(date) || isCellDisabled(date)) {
      return;
    }

    const displayDate = formatDateForDisplay(date);
    const shiftsForDay = shifts.map(shift => `${shift.id}-${displayDate}`);
    const allSelected = shiftsForDay.every(key => selectedShifts[key]);

    // Đảo ngược trạng thái tất cả ca trong ngày
    const newSelectedShifts = { ...selectedShifts };
    for (const shift of shifts) {
      const shiftKey = `${shift.id}-${displayDate}`;
      newSelectedShifts[shiftKey] = !allSelected;
    }
    setSelectedShifts(newSelectedShifts);

    // Đăng ký từng ca với server
    for (const shift of shifts) {
      registerShiftWithServer(shift.id, date, !allSelected);
    }
  };

  const toggleShiftRow = (shiftId: string) => {
    const currentWeekDays = getWeekDays(selectedDate);
    const shiftsForRow = [];

    for (const date of currentWeekDays) {
      if (!isPastDate(date) && !isCellDisabled(date)) {
        const displayDate = formatDateForDisplay(date);
        shiftsForRow.push(`${shiftId}-${displayDate}`);
      }
    }

    const allSelected = shiftsForRow.every(key => selectedShifts[key]);
    const newSelectedShifts = { ...selectedShifts };

    // Cập nhật UI ngay lập tức
    for (const key of shiftsForRow) {
      newSelectedShifts[key] = !allSelected;
    }
    setSelectedShifts(newSelectedShifts);

    // Đăng ký từng ca với server
    for (const date of currentWeekDays) {
      if (!isPastDate(date) && !isCellDisabled(date)) {
        registerShiftWithServer(shiftId, date, !allSelected);
      }
    }
  };

  const weekDays = getWeekDays(selectedDate);
  const firstDayOfWeek = getFirstDayOfWeek(selectedDate);

  // Translate day names to Vietnamese
  const getDayName = (day: number): string => {
    const dayNames = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
    return dayNames[day];
  };

  const getAntdDate = (date: Date): dayjs.Dayjs => {
    return dayjs(date);
  };

  return (
    <div className="flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="text-blue-600 mr-2">
            <CalendarOutlined style={{ fontSize: '24px' }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Đăng Ký Ca Làm</h1>
        </div>

        <div className="flex items-center">
          <Button
            onClick={goToPreviousWeek}
            icon={<span>{"<"}</span>}
            disabled={isPastDate(new Date(firstDayOfWeek.getTime() - 86400000))} // Disable if previous week starts in the past
          />

          <DatePicker
            className="mx-2"
            value={getAntdDate(firstDayOfWeek)}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            picker="week"
            locale={locale}
            disabledDate={(current) => {
              return current?.isBefore(getAntdDate(startOfDay(currentDate))) || false;
            }}
          />

          <Button
            onClick={goToNextWeek}
            icon={<span>{">"}</span>}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-10">
          <Spin size="large" tip="Đang tải dữ liệu ca làm..." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-50 text-center font-medium">Ca</th>
                {weekDays.map((date) => (
                  <th
                    key={`header-${formatDateForDisplay(date)}`}
                    className={`border border-gray-300 p-2 bg-gray-50 text-center font-medium ${!isPastDate(date) && !isCellDisabled(date) ? 'cursor-pointer hover:bg-gray-100' : 'opacity-50'}`}
                    onClick={() => !isPastDate(date) && !isCellDisabled(date) && toggleDayShifts(date)}
                    title={isCellDisabled(date) ? "Ngày này không khả dụng" : (!isPastDate(date) ? "Nhấp để chọn/bỏ chọn tất cả ca làm trong ngày này" : "Không thể chọn ngày đã qua")}
                  >
                    <div>{getDayName(date.getDay())}</div>
                    <div className="text-sm text-gray-600">{formatDateForDisplay(date)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift.id}>
                  <td
                    className="border border-gray-300 p-4 text-center font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleShiftRow(shift.id)}
                    title="Nhấp để chọn/bỏ chọn ca làm này cho cả tuần"
                  >
                    {shift.name}
                    <div className="text-xs text-gray-500">{shift.time_start} - {shift.time_end}</div>
                  </td>
                  {weekDays.map((date) => {
                    const shiftKey = `${shift.id}-${formatDateForDisplay(date)}`;
                    const isSelected = selectedShifts[shiftKey];
                    const isDisabled = isPastDate(date) || isCellDisabled(date);
                    const isProcessing = processingShift === shiftKey;

                    return (
                      <td key={`cell-${shiftKey}`} className="border border-gray-300 p-2 text-center">
                        <button
                          disabled={isDisabled || isProcessing}
                          className={`w-10 h-10 rounded
                            ${isSelected ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:border-gray-500'}
                            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}
                            ${isProcessing ? 'animate-pulse' : ''}`
                          }
                          onClick={() => toggleShift(shift.id, date)}
                          aria-label={`Chọn ca ${shift.name} vào ${formatDateForDisplay(date)}`}
                        >
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isProcessing && (
                            <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Đã loại bỏ nút "Lưu Đăng Ký" theo yêu cầu */}
    </div>
  );
}

export default ShiftRegistration;
