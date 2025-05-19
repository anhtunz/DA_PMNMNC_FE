import React, { useEffect } from 'react'
import { Card, Tabs, message } from 'antd'
import type { TabsProps } from 'antd'
import { useDispatch } from 'react-redux'
import { getUserInfo } from '../../services/userProfile/userProfile'
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess } from '../../stores/slice/user/userProfileSlice'
import PersonalInfoForm from './PersonalInfoForm'
import ChangePasswordForm from './ChangePasswordForm'
import AvatarUpload from './AvatarUpload'
import { useTitle } from '../../hooks/useTitle'


const ProfilePage: React.FC = () => {
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const fetchUserProfile = async () => {
      dispatch(fetchProfileStart())
      try {
        const response = await getUserInfo()
        if (response && response.data && response.data.data) {
          dispatch(fetchProfileSuccess(response.data.data))
        } else {
          dispatch(fetchProfileFailure('Failed to fetch profile data'))
          messageApi.error('Không thể tải thông tin hồ sơ')
        }
      } catch (error) {
        dispatch(fetchProfileFailure('An error occurred while fetching profile'))
        messageApi.error('Đã xảy ra lỗi khi tải thông tin hồ sơ')
      }
    }

    fetchUserProfile()
  }, [dispatch])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin cá nhân',
      children: <PersonalInfoForm />
    },
    {
      key: '2',
      label: 'Cập nhật ảnh đại diện',
      children: <AvatarUpload />
    },
    {
      key: '3',
      label: 'Đổi mật khẩu',
      children: <ChangePasswordForm />
    }
  ]

  useTitle('Thông tin cá nhân')
  return (
    <div className="profile-page px-4 py-6">
      {contextHolder}

      <Card className="w-full">
        <Tabs
          defaultActiveKey="1"
          items={items}
          tabPosition="top"
          className="profile-tabs"
          type="card"
        />
      </Card>
    </div>
  )
}

export default ProfilePage