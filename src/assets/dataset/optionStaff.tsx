import { useState, useEffect } from 'react';
import { NetworkManager } from '../../config/network_manager';
import APIPathConstants from '../../constant/ApiPathConstants';

// Interface cho dữ liệu nhân viên
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  isBlock?: boolean;
}

// Interface cho option staff
export interface StaffOption {
  value: string;
  label: string;
}

// Hàm lấy dữ liệu nhân viên từ API
export const fetchStaffOptions = async (): Promise<StaffOption[]> => {
  try {
    const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.ADMIN_GET_ALL_USERS);

    if (response && response.status === 200 && response.data && response.data.data) {
      const users: User[] = response.data.data;

      // Chuyển đổi dữ liệu nhân viên sang định dạng options
      return users.map(user => ({
        value: user.id, // Sử dụng userId làm value
        label: `${user.name} (${user.email})` // Hiển thị tên + email
      }));
    } else {
      console.error('Failed to fetch user data:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching staff options:', error);
    return [];
  }
};

// Dữ liệu mặc định khi không có dữ liệu từ API
export const optionStaff: StaffOption[] = [
  {
    value: 'nv1',
    label: 'Nhân viên A'
  },
  {
    value: 'nv2',
    label: 'Nhân viên B'
  },
  {
    value: 'nv3',
    label: 'Nhân viên C'
  },
  {
    value: 'nv4',
    label: 'Nhân viên D'
  },
  {
    value: 'nv5',
    label: 'Nhân viên E'
  },
  {
    value: 'nv6',
    label: 'Nhân viên F'
  },
  {
    value: 'nv7',
    label: 'Nhân viên G'
  },
  {
    value: 'nv8',
    label: 'Nhân viên H'
  },
  {
    value: 'nv9',
    label: 'Nhân viên I'
  },
  {
    value: 'nv10',
    label: 'Nhân viên K'
  },
  {
    value: 'nv11',
    label: 'Nhân viên L'
  }
];

