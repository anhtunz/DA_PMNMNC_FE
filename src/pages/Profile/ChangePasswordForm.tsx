import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { changePassword } from '../../services/userProfile/userProfile'

const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      messageApi.error('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }

    setLoading(true)
    
    try {
      const data = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      }
      
      const response = await changePassword(data)
      
      if (response && response.status === 200) {
        messageApi.success('Đổi mật khẩu thành công')
        form.resetFields()
      } else {
        const errorMessage = response?.data?.message || 'Không thể đổi mật khẩu'
        messageApi.error(errorMessage)
      }
    } catch (error) {
      messageApi.error('Đã xảy ra lỗi khi đổi mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {contextHolder}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="oldPassword"
          label="Mật khẩu hiện tại"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Hai mật khẩu không khớp'))
              }
            })
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="bg-blue-500"
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ChangePasswordForm