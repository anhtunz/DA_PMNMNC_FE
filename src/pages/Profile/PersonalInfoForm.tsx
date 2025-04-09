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
        gender: profile.gender,
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
        gender: values.gender,
        address: values.address || null,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
      }

      const response = await updateUserInfo(formattedValues)

      if (response && response.status === 200) {
        dispatch(updateProfileSuccess(formattedValues))
        messageApi.success('Profile updated successfully')
      } else {
        dispatch(updateProfileFailure('Failed to update profile'))
        messageApi.error('Failed to update profile')
      }
    } catch (error) {
      dispatch(updateProfileFailure('An error occurred'))
      messageApi.error('An error occurred while updating profile')
    }
  }

  return (
    <div>
      {contextHolder}
      <h2 className="mb-4 text-lg font-semibold">Update Personal Information</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-md"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender' }]}
        >
          <Select>
            <Option value={0}>Male</Option>
            <Option value={1}>Female</Option>
            <Option value={2}>Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
        >
          <DatePicker format="YYYY-MM-DD" className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={profile.loading}>
            Update Information
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default PersonalInfoForm
