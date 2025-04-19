import { useState, useEffect } from 'react'
import { Button, Popover, Tag, message, Modal, Spin } from 'antd'
import { FilterOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import SelectOption from '../../components/common/SelectOption'
import RangeCalendarComponent from '../../components/common/RangeCalendar'
import { formatDateByYMD, formatDateByDMY } from '../../components/helpers/formatNowDate'
import { optionStaff, fetchStaffOptions, StaffOption } from '../../assets/dataset/optionStaff'
import { useSelectOption } from '../../hooks/useSelectOption'
import { getCurrentWeek, getCurrentMonth } from '../../components/helpers/dateRange'
import { timeFilterOption } from '../../assets/dataset/timeFilerOption'
import TableComponent from '../../components/common/TableComponent'
import { considerUserShift } from '../../services/shift/considerUserShift'
import { NetworkManager } from '../../config/network_manager'
import APIPathConstants from '../../constant/ApiPathConstants'

interface UserShift {
  key: string;
  id: string;
  userId: string;
  email: string;
  staff_name: string;
  shift_name: string;
  time_start: string;
  time_end: string;
  work_day: string; // Add work_day field
  status: string;
}

// Interface for user data
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  isBlock?: boolean;
}

// Interface for shift data
interface Shift {
  id: string;
  name: string;
  description: string;
  time_start: string;
  time_end: string;
  created_at: string;
  updated_at: string | null;
  created_by: string;
  updated_by: string | null;
  status: number;
}

const WorkshiftStaffPage = () => {
  const { selected: selectedSingle, handleSelect: handleSelectSingle } = useSelectOption(false)
  const { selected: selectedMulti, handleSelect: handleSelecteMulti } = useSelectOption(true)

  const [open, setOpen] = useState(false)
  const [userShifts, setUserShifts] = useState<UserShift[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentUserShiftId, setCurrentUserShiftId] = useState('')
  const [actionType, setActionType] = useState<'accept' | 'deny'>('accept')
  const [messageApi, contextHolder] = message.useMessage()
  const [users, setUsers] = useState<User[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>(optionStaff)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  /** Xử lí dữ liệu date
   * @param {nowFormatYMD} - là ngày hiện tại theo định dạng YYYY/MM/DD
   * @param {nowFormatDMY} - là ngày hiện tại theo định dạng DD/MM/YYYY
   * @param {rangeDate} - là khoảng thời gian được chọn
   * @param {onChange} - là hàm xử lí khi chọn khoảng thời gian
   */
  const now = new Date()
  const dateFormatYMD = formatDateByYMD(now)
  const dateFormatDMY = formatDateByDMY(now)
  const [rangeDate, setRangeDate] = useState({ startDate: dateFormatYMD, endDate: dateFormatYMD })
  const onChange = (range: { firstDay: string | null; lastDay: string | null }) => {
    setRangeDate({ startDate: range.firstDay ?? dateFormatYMD, endDate: range.lastDay ?? dateFormatYMD })
  }

  // Format date string (YYYY-MM-DD) to DD/MM/YYYY
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '';
    // If the dateStr contains time, extract only the date part
    const datePart = dateStr.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  // Fetch user data from admin/users endpoint
  const fetchUsers = async () => {
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.ADMIN_GET_ALL_USERS)
      console.log('User data:', response.data)

      if (response && response.status === 200 && response.data && response.data.data) {
        setUsers(response.data.data)

        // Lấy và cập nhật options nhân viên
        const options = await fetchStaffOptions();
        if (options.length > 0) {
          setStaffOptions(options);
        }
      } else {
        console.error('Failed to fetch user data:', response)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Fetch all shifts from admin/shifts endpoint
  const fetchShifts = async () => {
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.ADMIN_GET_ALL_SHiFTS)
      console.log('Shifts data:', response.data)

      if (response && response.status === 200 && response.data && response.data.data) {
        setShifts(response.data.data)
      } else {
        console.error('Failed to fetch shifts data:', response)
      }
    } catch (error) {
      console.error('Error fetching shifts data:', error)
    }
  }

  // Get shift name by comparing time_start and time_end
  const getShiftName = (timeStart: string, timeEnd: string): string => {
    const matchingShift = shifts.find(shift =>
      shift.time_start === timeStart && shift.time_end === timeEnd
    )
    return matchingShift ? matchingShift.name : 'Ca không tồn tại'
  }

  // Xử lý lấy dữ liệu và lọc
  const fetchUserShifts = async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = {}

      // Xử lý thời gian lọc
      if (selectedSingle === 'week') {
        const [startWeek, endWeek] = getCurrentWeek(dateFormatYMD)
        params.startDate = `${startWeek} 00:00:00`
        params.endDate = `${endWeek} 23:59:59`
      } else if (selectedSingle === 'month') {
        const [startMonth, endMonth] = getCurrentMonth(dateFormatYMD)
        params.startDate = `${startMonth} 00:00:00`
        params.endDate = `${endMonth} 23:59:59`
      } else {
        // Sử dụng trực tiếp định dạng YYYY-MM-DD
        params.startDate = `${rangeDate.startDate} 00:00:00`
        params.endDate = `${rangeDate.endDate} 23:59:59`
      }

      // Xử lý lọc nhân viên
      if (selectedMulti && selectedMulti.length > 0) {
        params.userIds = Array.isArray(selectedMulti) ? selectedMulti.join(',') : selectedMulti
      }

      console.log('Parameters prepared for API call:', params);

      const response = await considerUserShift.instance.getAllUserShifts(params)
      console.log('API response:', response);

      if (response && response.status === 200 && response.data && response.data.data) {
        const formattedData = response.data.data.map((item: any) => {
          console.log("Item data:", item); // Log dữ liệu từng item để debug

          // Find user by userId from the users array
          const userId = item.userId || ''
          const user = users.find(user => user.id === userId)
          const staffName = user ? user.name : 'Super Admin'

          // Get shift name by comparing timeStart and timeEnd
          const timeStart = item.timeStart || ''
          const timeEnd = item.timeEnd || ''
          const shiftName = getShiftName(timeStart, timeEnd)

          // Format register day for display
          const workDay = formatDateString(item.registerDay || '')

          return {
            key: item.id || String(Math.random()),
            id: item.id || '',
            userId: userId,
            email: item.email || user?.email || 'Không có email',
            staff_name: staffName,
            shift_name: shiftName,
            time_start: timeStart,
            time_end: timeEnd,
            work_day: workDay,
            status: item.status === 0 ? 'Chưa duyệt' : (item.status === 1 ? 'Đã duyệt' : 'Đã từ chối')
          }
        });
        setUserShifts(formattedData)
      } else {
        console.error('Invalid response format:', response)

        // Hiển thị lỗi chi tiết từ API nếu có
        if (response && response.data && response.data.message) {
          messageApi.error(`Lỗi: ${response.data.message}`);
        } else {
          messageApi.error('Không thể tải dữ liệu!');
        }

        // Log chi tiết hơn về lỗi validation nếu có
        if (response && response.data && response.data.errors) {
          console.error('Validation errors:', response.data.errors);
        }
      }
    } catch (error) {
      console.error('Error fetching user shifts:', error)
      messageApi.error('Lỗi khi tải dữ liệu ca làm!')
    } finally {
      setLoading(false)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = () => {
    fetchUserShifts()
    setOpen(false)
  }

  // Xử lý chấp nhận ca làm
  const handleAcceptUserShift = async (userShiftId: string) => {
    try {
      const response = await considerUserShift.instance.acceptUserShift(userShiftId)
      console.log('Accept response:', response);

      if (response && response.status === 200) {
        messageApi.success('Đã duyệt ca làm thành công!')
        fetchUserShifts()
      } else {
        // Hiển thị lỗi chi tiết từ API nếu có
        if (response && response.data && response.data.message) {
          messageApi.error(`Lỗi: ${response.data.message}`);
        } else {
          messageApi.error('Lỗi khi duyệt ca làm!');
        }

        // Log chi tiết hơn về lỗi validation nếu có
        if (response && response.data && response.data.errors) {
          console.error('Validation errors:', response.data.errors);
        }
      }
    } catch (error) {
      console.error('Error accepting user shift:', error)
      messageApi.error('Lỗi khi duyệt ca làm!')
    }
  }

  // Xử lý từ chối ca làm
  const handleDenyUserShift = async (userShiftId: string) => {
    try {
      const response = await considerUserShift.instance.denyUserShift(userShiftId)
      console.log('Deny response:', response);

      if (response && response.status === 200) {
        messageApi.success('Đã từ chối ca làm thành công!')
        fetchUserShifts()
      } else {
        // Hiển thị lỗi chi tiết từ API nếu có
        if (response && response.data && response.data.message) {
          messageApi.error(`Lỗi: ${response.data.message}`);
        } else {
          messageApi.error('Lỗi khi từ chối ca làm!');
        }

        // Log chi tiết hơn về lỗi validation nếu có
        if (response && response.data && response.data.errors) {
          console.error('Validation errors:', response.data.errors);
        }
      }
    } catch (error) {
      console.error('Error denying user shift:', error)
      messageApi.error('Lỗi khi từ chối ca làm!')
    }
  }

  // Xử lý hiển thị modal xác nhận
  const showConfirmModal = (id: string, type: 'accept' | 'deny') => {
    setCurrentUserShiftId(id)
    setActionType(type)
    setModalVisible(true)
  }

  // Xử lý xác nhận hành động
  const handleConfirmAction = () => {
    if (actionType === 'accept') {
      handleAcceptUserShift(currentUserShiftId)
    } else {
      handleDenyUserShift(currentUserShiftId)
    }
    setModalVisible(false)
  }

  // Columns cho bảng
  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'staff_name',
      key: 'staff_name',
    },
    {
      title: 'Email nhân viên',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tên ca làm',
      dataIndex: 'shift_name',
      key: 'shift_name',
    },
    {
      title: 'Ngày làm việc',
      dataIndex: 'work_day',
      key: 'work_day',
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'time_start',
      key: 'time_start',
    },
    {
      title: 'Giờ kết thúc',
      dataIndex: 'time_end',
      key: 'time_end',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default'
        if (status === 'Đã duyệt') {
          color = 'success'
        } else if (status === 'Đã từ chối') {
          color = 'error'
        } else if (status === 'Chưa duyệt') {
          color = 'warning'
        }
        return <Tag color={color}>{status}</Tag>
      }
    },
  ]

  // Hiển thị nút hành động
  const renderActions = (record: UserShift) => {
    if (record.status === 'Chưa duyệt') {
      return (
        <div className="flex space-x-2">
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => showConfirmModal(record.id, 'accept')}
            className="bg-blue-500"
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => showConfirmModal(record.id, 'deny')}
            className="bg-red-50 text-red-500 border-red-500"
          >
            Từ chối
          </Button>
        </div>
      )
    }
    return null
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchUsers()
    fetchShifts()
  }, [])

  // Fetch user shifts when users and shifts data is loaded or filters change
  useEffect(() => {
    if (users.length > 0 && shifts.length > 0) {
      fetchUserShifts()
    }
  }, [users, shifts, selectedSingle, rangeDate, selectedMulti])

  return (
    <div className='flex flex-col shadow-gray-50 bg-white p-6 rounded-2xl'>
      {contextHolder}
      <div className='w-full flex justify-end items-center gap-3 pb-3'>
        <span className='font-bold'>Ngày hôm nay: {`${dateFormatDMY}`}</span>
        <Popover
          content={
            <div className='flex justify-center items-end flex-col p-3 gap-3 sm:w-[400px] max-w-full'>
              <div className='flex flex-col justify-start items-start md:items-start gap-3 w-full'>
                <SelectOption
                  optionData={staffOptions} // Sử dụng options nhân viên từ API
                  isMultiSelect={true}
                  placeholder='Chọn nhân viên'
                  customWidth='100%'
                  onChange={handleSelecteMulti}
                />
                <div className='flex gap-4'>
                  <SelectOption
                    optionData={timeFilterOption}
                    isMultiSelect={false}
                    placeholder='Chọn thời gian'
                    customWidth='50%'
                    onChange={handleSelectSingle}
                  />
                  <RangeCalendarComponent
                    startDate={rangeDate.startDate}
                    endDate={rangeDate.endDate}
                    isDisableFirstDay={true}
                    onChange={onChange}
                  />
                </div>
              </div>
              <Button type='primary' style={{ width: 'fit-content' }} onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          }
          title='Lọc kết quả'
          trigger='click'
          placement='bottomRight'
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Button type='primary'>
            <FilterOutlined />
            Filter
          </Button>
        </Popover>
      </div>

      {/* Bảng hiển thị dữ liệu ca làm */}
      <div className='mt-4'>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <TableComponent
            columns={columns}
            dataSource={userShifts}
            pageSizeCustom={10}
            actions={renderActions}
          />
        )}
      </div>

      {/* Modal xác nhận */}
      <Modal
        title={actionType === 'accept' ? 'Xác nhận duyệt ca làm' : 'Xác nhận từ chối ca làm'}
        open={modalVisible}
        onOk={handleConfirmAction}
        onCancel={() => setModalVisible(false)}
        okText={actionType === 'accept' ? 'Duyệt' : 'Từ chối'}
        cancelText="Hủy"
        okButtonProps={{
          style: {
            backgroundColor: actionType === 'accept' ? '#1890ff' : '#ff4d4f',
            borderColor: actionType === 'accept' ? '#1890ff' : '#ff4d4f'
          }
        }}
      >
        <p>
          {actionType === 'accept'
            ? 'Bạn có chắc chắn muốn duyệt ca làm này không?'
            : 'Bạn có chắc chắn muốn từ chối ca làm này không?'
          }
        </p>
      </Modal>
    </div>
  )
}

export default WorkshiftStaffPage
