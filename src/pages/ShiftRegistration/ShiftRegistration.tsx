import { useState, useEffect } from 'react';
import { DatePicker, Button, message, Spin } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import ShiftService, { Shift } from '../../services/shift/shiftService';
import 'antd/dist/reset.css';
import { useTitle } from '../../hooks/useTitle';

type DatePickerValue = dayjs.Dayjs;

function ShiftRegistration() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingShift, setProcessingShift] = useState<string | null>(null);
  const [selectedShifts, setSelectedShifts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await ShiftService.getAllShifts();
      setShifts(response.data);
    } catch {
      message.error('Không thể tải dữ liệu ca làm');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatDateForAPI = (date: Date, useStartOfDay = true) => {
    // Tạo bản sao để không ảnh hưởng đến biến gốc
    const d = new Date(date);

    // Nếu useStartOfDay = true, đặt thời gian về 00:00:00
    if (useStartOfDay) {
      d.setHours(0, 0, 0, 0);
    }

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const startOfDay = (date: Date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const isPastDate = (date: Date) => {
    const today = startOfDay(currentDate);
    const compareDate = startOfDay(date);
    return compareDate < today;
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    if (newDate >= startOfDay(currentDate)) {
      setSelectedDate(newDate);
    }
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleDateChange = (date: DatePickerValue | null) => {
    if (date) {
      const jsDate = date.toDate();
      if (jsDate >= startOfDay(currentDate)) {
        setSelectedDate(jsDate);
      }
    }
  };

  const isShiftRegistrationLocked = (shift: Shift, date: Date) => {
    if (isPastDate(date)) return true;
    if (!shift.timeStart) return false;
    const [h, m, s] = shift.timeStart.split(":").map(Number);
    const lockDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s);
    lockDate.setHours(lockDate.getHours() - 1);
    return new Date() >= lockDate;
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const monday = new Date(date);
    const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0); // RESET giờ về 0

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      d.setHours(0, 0, 0, 0); // RESET luôn từng ngày
      days.push(d);
    }
    return days;
  };


  const getFirstDayOfWeek = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1));
    return d;
  };

  const toggleShift = (shiftId: string, date: Date) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift || isShiftRegistrationLocked(shift, date)) return;

    const displayDate = formatDateForDisplay(date);
    const shiftKey = `${shiftId}-${displayDate}`;
    const isCurrentlySelected = selectedShifts[shiftKey];

    setSelectedShifts(prev => ({
      ...prev,
      [shiftKey]: !prev[shiftKey]
    }));

    registerShiftWithServer(shiftId, date, !isCurrentlySelected);
  };

  const toggleDayShifts = (date: Date) => {
    if (isPastDate(date)) return;
    const displayDate = formatDateForDisplay(date);
    const shiftsForDay = shifts.map(shift => `${shift.id}-${displayDate}`);
    const allSelected = shiftsForDay.every(key => selectedShifts[key]);
    const updates: Record<string, boolean> = {};

    shifts.forEach(shift => {
      updates[`${shift.id}-${displayDate}`] = !allSelected;
      registerShiftWithServer(shift.id, date, !allSelected);
    });

    setSelectedShifts(prev => ({ ...prev, ...updates }));
  };

  const toggleShiftRow = (shiftId: string) => {
    const weekDays = getWeekDays(selectedDate);
    const shiftsForRow = weekDays
      .filter(date => {
        const shift = shifts.find(s => s.id === shiftId);
        return shift && !isShiftRegistrationLocked(shift, date);
      })
      .map(date => `${shiftId}-${formatDateForDisplay(date)}`);
    const allSelected = shiftsForRow.every(key => selectedShifts[key]);

    shiftsForRow.forEach(key => {
      const [shiftId, dateString] = key.split("-");
      const [day, month, year] = dateString.split("/");
      const date = new Date(+year, +month - 1, +day);
      registerShiftWithServer(shiftId, date, !allSelected);
    });

    const updates: Record<string, boolean> = {};
    shiftsForRow.forEach(key => updates[key] = !allSelected);
    setSelectedShifts(prev => ({ ...prev, ...updates }));
  };

  const getWeekRange = (date: Date) => {
    const monday = new Date(date);
    const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 0); // Đặt cuối ngày cho Sunday

    // Format yyyy-MM-dd HH:mm:ss
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const seconds = d.getSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return {
      startDate: formatDate(monday), // Sẽ là "yyyy-MM-dd 00:00:00"
      endDate: formatDate(sunday)    // Sẽ là "yyyy-MM-dd 23:59:59"
    };
  };

  const fetchRegisteredShifts = async (date: Date) => {
    const { startDate, endDate } = getWeekRange(date);
    console.log('fetchRegisteredShifts - Range:', { startDate, endDate });
    try {
      const res = await ShiftService.getAllUserRegisteredShifts(startDate, endDate);
      console.log('fetchRegisteredShifts - API Response:', res);
      if (res.success) {
        const reg: Record<string, boolean> = {};
        console.log('fetchRegisteredShifts - Raw data items:', res.data);

        // Xử lý tất cả dữ liệu từ API
        for (const item of res.data) {
          // Chuyển yyyy-MM-dd => dd/MM/yyyy
          const [yyyy, mm, dd] = item.date.split('-');
          const displayDate = `${dd}/${mm}/${yyyy}`;
          const shiftKey = `${item.shift_id}-${displayDate}`;
          console.log('fetchRegisteredShifts - Processing item:', {
            original: item,
            formattedDate: displayDate,
            shiftKey: shiftKey,
            isRegistered: item.isRegistered
          });

          // Chỉ đánh dấu true nếu isRegistered là true
          reg[shiftKey] = item.isRegistered === true;
        }

        // Ghi đè state hiện tại với dữ liệu mới
        setSelectedShifts(reg);
      }
    } catch (error) {
      console.error('Error fetching registered shifts:', error);
    }
  };

  const isCellDisabled = (date: Date): boolean => {
    return isPastDate(date);
  };

  const registerShiftWithServer = async (shiftId: string, date: Date, isSelected: boolean) => {
    try {
      const apiDate = formatDateForAPI(date, true); // Sử dụng 00:00:00
      const displayDate = formatDateForDisplay(date);
      const shiftKey = `${shiftId}-${displayDate}`;
      setProcessingShift(shiftKey);
      const result = await ShiftService.registerShift(shiftId, apiDate);
      if (result.success) {
        await fetchRegisteredShifts(selectedDate);
        message.success(`${isSelected ? 'Đăng ký' : 'Hủy đăng ký'} ca làm thành công`);
      } else {
        setSelectedShifts(prev => ({ ...prev, [shiftKey]: !isSelected }));
        message.error(`Lỗi: ${result.message}`);
      }
    } catch {
      const displayDate = formatDateForDisplay(date);
      const shiftKey = `${shiftId}-${displayDate}`;
      setSelectedShifts(prev => ({ ...prev, [shiftKey]: !isSelected }));
      message.error('Đăng ký ca làm thất bại');
    } finally {
      setProcessingShift(null);
    }
  };
  useEffect(() => {
    fetchShifts();
    fetchRegisteredShifts(selectedDate);  // Thêm vào đây nếu chưa có
  }, []);
  useEffect(() => {
    fetchRegisteredShifts(selectedDate);
  }, [selectedDate]);

  const weekDays = getWeekDays(selectedDate);
  const firstDayOfWeek = getFirstDayOfWeek(selectedDate);

  const getAntdDate = (date: Date) => dayjs(date);

  const getDayName = (day: number) => ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];

  useTitle('Đăng ký ca làm')
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
            disabled={isPastDate(new Date(firstDayOfWeek.getTime() - 86400000))}
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
                    <div className="text-xs text-gray-500">{shift.timeStart} - {shift.timeEnd}</div>
                  </td>
                  {weekDays.map((date) => {
                    const shiftKey = `${shift.id}-${formatDateForDisplay(date)}`;
                    const isSelected = selectedShifts[shiftKey];
                    const isDisabled = isShiftRegistrationLocked(shift, date);
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
    </div>
  );
}

export default ShiftRegistration;
