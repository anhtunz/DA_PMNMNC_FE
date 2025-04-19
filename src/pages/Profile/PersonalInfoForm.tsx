import React, { useEffect } from 'react'
import { Form, Input, Button, Select, DatePicker, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../stores'
import { updateUserInfo } from '../../services/userProfile/userProfile'
import { updateProfileFailure, updateProfileStart, updateProfileSuccess } from '../../stores/slice/user/userProfileSlice'
import dayjs from 'dayjs'

const { Option } = Select

const PersonalInfoForm: React.FC = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const profile = useSelector((state: RootState) => state.profile)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    // Set initial form values when profile data is loaded
    if (profile.name) {
      form.setFieldsValue({
        name: profile.name,
        email: profile.email,
        gender: String(profile.gender),
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null
      })
    }
  }, [profile, form])

  const onFinish = async (values: any) => {
    dispatch(updateProfileStart())

    try {
      const formattedValues = {
        name: values.name,
        gender: String(values.gender),
        address: values.address || null,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
      }
      console.log("Dữ liệu gốc:", values)
console.log("formattedValues gửi lên:", formattedValues)

      const response = await updateUserInfo(formattedValues)

      if (response && response.status === 200) {
        dispatch(updateProfileSuccess(formattedValues))
        messageApi.success('Cập nhật thông tin thành công')
      } else {
        dispatch(updateProfileFailure('Câp nhật thông tin thất bại'))
        messageApi.error('Cập nhật thông tin thất bại')
      }
    } catch (error) {
      dispatch(updateProfileFailure('Đã xảy ra lỗi'))
      messageApi.error('Đã xảy ra lỗi khi cập nhật hồ sơ')
    }
  }

  return (
    <div>
      {contextHolder}
      <h2 className="mb-4 text-lg font-semibold">Cập nhật thông tin cá nhân</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-md"
      >
        <Form.Item
          name="email"
          label="Email"
        >
          <Input disabled />
        </Form.Item>
        
        <Form.Item
          name="name"
          label="Tên đầy đủ"
          rules={[{ required: true, message: 'Vui lòng nhập tên của bạn' }]}
        >
          <Input />
        </Form.Item>

        

        <Form.Item
          name="gender"
          label="Giới Tính"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select>
            <Option value="0">Nam</Option>
            <Option value="1">Nữ</Option>
            <Option value="2">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Ngày sinh"
        >
          <DatePicker format="YYYY-MM-DD" className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={profile.loading}>
          Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default PersonalInfoForm
