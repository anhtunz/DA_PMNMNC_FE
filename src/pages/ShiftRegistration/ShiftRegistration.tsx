import { useState, useEffect } from 'react';
import { DatePicker, Button } from 'antd';
import { SaveOutlined, CalendarOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

// Định nghĩa một kiểu cho giá trị của DatePicker
type DatePickerValue = dayjs.Dayjs;

function ShiftRegistration() {
 // Trạng thái cho ngày hiện tại và ngày đã chọn
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShifts, setSelectedShifts] = useState<{[key: string]: boolean}>({
    '1-11/04/2025': true,
    '1-12/04/2025': true,
    '2-11/04/2025': true,
    '4-12/04/2025': true,
  });

 // Cập nhật ngày hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
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
    const dateStr = formatDate(date);
  
   
    const day = date.getDay();
    
    if (day >= 1 && day <= 5) { // Monday to Friday
      
      const weekdaysToDisable = [
        '07/04/2025',
        '08/04/2025',
        '09/04/2025',
        '10/04/2025',
        '11/04/2025'
      ];
      
      // Extract only the day/month part for comparison
      const dateParts = dateStr.split('/');
      const dayMonthPart = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
      
      return weekdaysToDisable.some(disabledDate => dayMonthPart.includes(disabledDate));
    }
    
    return false;
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

  const toggleShift = (shiftKey: string, date: Date) => {
    if (isPastDate(date) || isCellDisabled(date)) {
      return;
    }
    
    setSelectedShifts(prev => ({
      ...prev,
      [shiftKey]: !prev[shiftKey]
    }));
  };

  const toggleDayShifts = (date: Date) => {
    if (isPastDate(date) || isCellDisabled(date)) {
      return;
    }
    
    const formattedDate = formatDate(date);
    const shiftsForDay = [1, 2, 3, 4, 5].map(shift => `${shift}-${formattedDate}`);
    
    const allSelected = shiftsForDay.every(key => selectedShifts[key]);
    
    const newSelectedShifts = { ...selectedShifts };
    
    for (const key of shiftsForDay) {
      newSelectedShifts[key] = !allSelected;
    }
    
    setSelectedShifts(newSelectedShifts);
  };
  const toggleShiftRow = (shiftNumber: number) => {
    const currentWeekDays = getWeekDays(selectedDate);
    const shiftsForRow = [];
    for (const date of currentWeekDays) {
      if (!isPastDate(date) && !isCellDisabled(date)) {
        shiftsForRow.push(`${shiftNumber}-${formatDate(date)}`);
      }
    }
    
    const allSelected = shiftsForRow.every(key => selectedShifts[key]);
  
    const newSelectedShifts = { ...selectedShifts };

    for (const key of shiftsForRow) {
      newSelectedShifts[key] = !allSelected;
    }
    
    setSelectedShifts(newSelectedShifts);
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50 text-center font-medium">Ca</th>
              {weekDays.map((date) => (
                <th
                  key={`header-${formatDate(date)}`}
                  className={`border border-gray-300 p-2 bg-gray-50 text-center font-medium ${!isPastDate(date) && !isCellDisabled(date) ? 'cursor-pointer hover:bg-gray-100' : 'opacity-50'}`}
                  onClick={() => !isPastDate(date) && !isCellDisabled(date) && toggleDayShifts(date)}
                  title={isCellDisabled(date) ? "This day is not available" : (!isPastDate(date) ? "Click to select/deselect all shifts for this day" : "Cannot select past dates")}
                >
                  <div>{getDayName(date.getDay())}</div>
                  <div className="text-sm text-gray-600">{formatDate(date)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(shift => (
              <tr key={shift}>
                <td
                  className="border border-gray-300 p-4 text-center font-medium cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleShiftRow(shift)}
                  title="Click to select/deselect this shift for the entire week"
                >
                  {shift}
                </td>
                {weekDays.map((date) => {
                  const shiftKey = `${shift}-${formatDate(date)}`;
                  const isSelected = selectedShifts[shiftKey];
                  const isDisabled = isPastDate(date) || isCellDisabled(date);
                  
                  return (
                    <td key={`cell-${shiftKey}`} className="border border-gray-300 p-2 text-center">
                      <button
                        disabled={isDisabled}
                        className={`w-10 h-10 rounded 
                          ${isSelected ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:border-gray-500'} 
                          ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`
                        }
                        onClick={() => toggleShift(shiftKey, date)}
                        aria-label={`Select shift ${shift} on ${formatDate(date)}`}
                      >
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

      <div className="mt-6 flex justify-end">
        <Button 
          type="primary"
          size="large"
          icon={<SaveOutlined />}
          className="bg-blue-600"
        >
          Lưu Đăng Ký
        </Button>
      </div>
    </div>
  );
}

export default ShiftRegistration;