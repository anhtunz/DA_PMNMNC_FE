import { NetworkManager } from '../../config/network_manager';
import APIPathConstants from '../../constant/ApiPathConstants';

// Định nghĩa các kiểu dữ liệu
export interface Shift {
  id: string;
  name: string;
  description: string;
  time_start: string;
  time_end: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  status: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  success?: boolean;
}

class considerUserShift {
  // Cache cho thông tin ca làm việc
  private static shiftCache: Record<string, Shift> = {};
  private static _instance: considerUserShift | null = null;
  private network: NetworkManager;

  private constructor() {
    this.network = NetworkManager.instance;
  }

  static get instance(): considerUserShift {
    if (!this._instance) {
      this._instance = new considerUserShift();
    }
    return this._instance;
  }

  // Lấy tất cả ca làm việc
  static async getAllShifts(): Promise<ApiResponse<Shift[]>> {
    try {
      const response = await NetworkManager.instance.getDataFromServer('admin/shifts');

      // Cập nhật cache với thông tin ca làm việc
      if (response.data && Array.isArray(response.data.data)) {
        response.data.data.forEach((shift: Shift) => {
          this.shiftCache[shift.id] = shift;
        });
      }

      return {
        ...response.data,
        success: true
      };
    } catch (error) {
      console.error('Error fetching shifts:', error);
      return {
        message: 'Không thể tải danh sách ca làm việc',
        data: [],
        success: false
      };
    }
  }

  // Lấy thông tin chi tiết ca làm việc theo ID
  // Sử dụng cache để tránh gọi API lặp lại
  static async getShiftById(shiftId: string): Promise<Shift | null> {
    try {
      // Kiểm tra xem thông tin đã có trong cache chưa
      if (this.shiftCache[shiftId]) {
        console.log('Lấy thông tin ca làm việc từ cache:', shiftId);
        return this.shiftCache[shiftId];
      }

      // Nếu không có trong cache, lấy từ danh sách ca
      // Thay vì gọi API riêng biệt, lấy tất cả ca làm việc
      const allShiftsResponse = await this.getAllShifts();
      if (allShiftsResponse.success && Array.isArray(allShiftsResponse.data)) {
        const shift = allShiftsResponse.data.find(s => s.id === shiftId);
        if (shift) {
          this.shiftCache[shiftId] = shift;
          return shift;
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching shift details:', error);
      return null;
    }
  }

  // Kiểm tra xem ca làm việc có đủ điều kiện đăng ký không (trước ít nhất 1 giờ)
  static async checkShiftRegistrationEligibility(shiftId: string, dateRegister: string): Promise<{isEligible: boolean, message?: string}> {
    try {
      // Lấy thông tin ca làm việc
      const shift = await this.getShiftById(shiftId);

      if (!shift) {
        return { isEligible: false, message: 'Không tìm thấy thông tin ca làm việc' };
      }

      // Nếu không có time_start, không thể kiểm tra
      if (!shift.time_start) {
        console.warn('Ca làm việc không có thông tin thời gian bắt đầu:', shift);
        return { isEligible: true }; // Mặc định cho phép đăng ký
      }

      // Tách thời gian bắt đầu ca làm việc từ shift.time_start (định dạng: HH:MM:SS)
      const timeParts = shift.time_start.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      // Tạo đối tượng Date cho thời điểm bắt đầu ca làm việc
      const shiftDate = new Date(dateRegister);
      shiftDate.setHours(hours, minutes, 0, 0);

      // Thời điểm hiện tại
      const now = new Date();

      // Tính khoảng cách thời gian (milliseconds)
      const timeDiff = shiftDate.getTime() - now.getTime();
      const hourDiff = timeDiff / (1000 * 60 * 60);

      console.log(`Kiểm tra điều kiện đăng ký ca: ID=${shiftId}, Thời gian bắt đầu=${shiftDate.toLocaleString()}, Khoảng cách=${hourDiff.toFixed(2)} giờ`);

      // Kiểm tra xem khoảng cách có lớn hơn 1 giờ không
      if (hourDiff < 1) {
        return {
          isEligible: false,
          message: 'Phải đăng ký ca sớm ít nhất 1 giờ'
        };
      }

      return { isEligible: true };
    } catch (error) {
      console.error('Error checking shift eligibility:', error);
      return { isEligible: false, message: 'Lỗi khi kiểm tra điều kiện đăng ký ca làm việc' };
    }
  }

  // Thiết lập cache thủ công - hữu ích khi bạn đã có dữ liệu từ getAllShifts
  static setShiftsToCache(shifts: Shift[]) {
    shifts.forEach(shift => {
      this.shiftCache[shift.id] = shift;
    });
  }

  // Đăng ký ca làm việc
  static async registerShift(shiftId: string, dateRegister: string): Promise<ApiResponse<any>> {
    try {
      // Thiết lập time-out để đảm bảo promise không treo
      const timeoutPromise = new Promise<ApiResponse<any>>((_, reject) => {
        setTimeout(() => {
          reject(new Error('API request timed out'));
        }, 10000); // 10 giây time-out
      });

      // Thực hiện kiểm tra điều kiện
      const eligibilityCheckPromise = this.checkShiftRegistrationEligibility(shiftId, dateRegister);
      const eligibilityCheck = await Promise.race([eligibilityCheckPromise, timeoutPromise]);

      if (!('isEligible' in eligibilityCheck)) {
        throw new Error('Invalid response format from eligibility check');
      }

      if (!eligibilityCheck.isEligible) {
        // Trả về lỗi với cùng định dạng như API trả về
        return {
          message: eligibilityCheck.message || 'Không đủ điều kiện đăng ký ca làm việc',
          data: null,
          success: false
        };
      }

      const body = {
        shiftId,
        dateRegister
      };
      console.log('Gửi giữ liệu đăng ký lên api:', JSON.stringify(body,null,2));

      // Thực hiện gọi API với time-out
      const apiPromise = NetworkManager.instance.createDataInServer(
        'user-register-shift/subscribe-or-unsubscribe-shift',
        body
      );

      const response = await Promise.race([apiPromise, timeoutPromise]);
      console.log('Phản hồi từ api:', response.data);

      return {
        ...response.data,
        success: true
      };
    } catch (error) {
      console.error('Error registering shift:', error);
      let errorMessage = 'Lỗi khi đăng ký ca làm việc';

      // Kiểm tra xem lỗi có phải từ time-out hay không
      if (error instanceof Error && error.message === 'API request timed out') {
        errorMessage = 'Yêu cầu đăng ký ca tốn quá nhiều thời gian, vui lòng thử lại sau';
      }

      return {
        message: errorMessage,
        data: null,
        success: false
      };
    }
  }

  // Hàm chuẩn hóa định dạng ngày tháng cho API
  private formatDateForAPI(dateStr: string): string {
    if (!dateStr) return '';

    try {
      // Loại bỏ phần thời gian nếu có
      let formattedDate = dateStr;

      // Nếu chuỗi có chứa dấu cách (có thể là có thời gian), chỉ lấy phần ngày
      if (formattedDate.includes(' ')) {
        formattedDate = formattedDate.split(' ')[0];
      }

      // Nếu ngày có dạng YYYY/MM/DD, chuyển thành YYYY-MM-DD
      formattedDate = formattedDate.replace(/\//g, '-');

      // Đảm bảo định dạng YYYY-MM-DD không có phần GMT
      if (formattedDate.includes('GMT')) {
        const match = formattedDate.match(/(\d{4}-\d{2}-\d{2})/);
        if (match) {
          return match[1];
        }
      }

      // Kiểm tra xem có phải định dạng YYYY-MM-DD không
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(formattedDate)) {
        return formattedDate;
      }

      // Nếu không phải định dạng chuẩn, thử chuyển đổi qua Date object
      const date = new Date(formattedDate);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      console.warn('Không thể chuyển đổi chuỗi ngày tháng:', dateStr);
      return formattedDate;
    } catch (error) {
      console.error('Lỗi khi xử lý định dạng ngày tháng:', error);
      return dateStr;
    }
  }

  /**
   * Get all user shift registrations with filters
   * @param params The filter parameters
   * @returns The API response
   */
  async getAllUserShifts(params: Record<string, any>) {
    try {
      // Cấu trúc yêu cầu của API: userIds là mảng chuỗi, có thể rỗng
      const userIds = params.userIds ?
        params.userIds.split(',').map((id: string) => id.trim()) :
        [];

      // Đảm bảo định dạng ngày tháng đúng YYYY-MM-DD
      let startDate = params.startDate || "";
      let endDate = params.endDate || "";

      // Chuẩn hóa định dạng ngày tháng
      startDate = this.formatDateForAPI(startDate);
      endDate = this.formatDateForAPI(endDate);

      // Thêm thời gian nếu cần
      if (startDate && !startDate.includes(' ')) {
        startDate = `${startDate} 00:00:00`;
      }

      if (endDate && !endDate.includes(' ')) {
        endDate = `${endDate} 23:59:59`;
      }

      const requestBody = {
        startDate: startDate,
        endDate: endDate,
        onlySending: true,
        userIds: userIds
      };

      console.log('Request payload for getAllUserShifts:', JSON.stringify(requestBody, null, 2));
      return this.network.createDataInServer(APIPathConstants.GET_ALL_USER_SHIFTS, requestBody);
    } catch (error) {
      console.error('Lỗi khi tạo request payload:', error);
      // Trả về lỗi để component xử lý
      return {
        status: 500,
        data: {
          message: 'Lỗi khi tạo request payload',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Accept a user shift registration
   * @param userShiftId The ID of the user shift
   * @returns The API response
   */
  async acceptUserShift(userShiftId: string) {
    console.log(`Sending accept request for user shift ID: ${userShiftId}`);
    const endpoint = `${APIPathConstants.ACCEPT_USER_SHIFT}/${userShiftId}`;
    console.log(`API endpoint: ${endpoint}`);
    return this.network.createDataInServer(endpoint, {});
  }

  /**
   * Deny a user shift registration
   * @param userShiftId The ID of the user shift
   * @returns The API response
   */
  async denyUserShift(userShiftId: string) {
    console.log(`Sending deny request for user shift ID: ${userShiftId}`);
    const endpoint = `${APIPathConstants.DENY_USER_SHIFT}/${userShiftId}`;
    console.log(`API endpoint: ${endpoint}`);
    return this.network.createDataInServer(endpoint, {});
  }
}

export { considerUserShift };
