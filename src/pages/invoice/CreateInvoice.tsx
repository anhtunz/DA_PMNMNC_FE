import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Card,
  Divider,
  Space,
  Typography,
  Table,
  notification,
  Row,
  Col
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

// Định nghĩa các interface và types
interface RoomDetail {
  key: React.Key
  name: string
  type: string
  price: number
  timeStart: string
  timeEnd: string
  notes: string
}

interface ServiceDetail {
  key: React.Key
  name: string
  price: number
}

const InvoiceCreationForm: React.FC = () => {
  const [form] = Form.useForm()

  // Cột cho bảng phòng
  const roomColumns = [
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => <Input placeholder='Tên phòng' />
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      render: () => (
        <Select placeholder='Chọn loại phòng' style={{ width: '100%' }}>
          <Option value='STANDARD'>Phòng tiêu chuẩn</Option>
          <Option value='VIP'>Phòng VIP</Option>
          <Option value='SUITE'>Phòng Suite</Option>
        </Select>
      )
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: () => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={(value) => parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0}
        />
      )
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'timeStart',
      key: 'timeStart',
      render: () => <DatePicker showTime style={{ width: '100%' }} />
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      render: () => <DatePicker showTime style={{ width: '100%' }} />
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: () => <Input placeholder='Ghi chú' />
    },
    {
      title: '',
      key: 'action',
      render: () => <Button type='text' danger icon={<DeleteOutlined />} />
    }
  ]

  // Cột cho bảng dịch vụ
  const serviceColumns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      render: () => <Input placeholder='Tên dịch vụ' />
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: () => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      )
    },
    {
      title: '',
      key: 'action',
      render: () => <Button type='text' danger icon={<DeleteOutlined />} />
    }
  ]

  return (
    <div className='p-4 lg:p-6'>
      <Form form={form} layout='vertical'>
        <Card className='mb-6 shadow-sm'>
          <div className='flex flex-col md:flex-row justify-center items-center md:items-center'>
            <Title level={1} className='m-0'>
              Tạo hóa đơn mới
            </Title>
          </div>
        </Card>

        {/* Phần 1: Thông tin khách hàng */}
        <Card title={<Title level={4}>Thông tin khách hàng</Title>} className='mb-6 shadow-sm'>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label='Số điện thoại khách hàng'
                name='clientPhone'
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder='Nhập số điện thoại để tìm kiếm' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label=' ' colon={false}>
                <Button type='primary' icon={<SearchOutlined />} style={{ marginTop: '5px' }}>
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label='Họ tên khách hàng'
                name='clientName'
                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
              >
                <Input prefix={<UserOutlined />} placeholder='Họ tên khách hàng' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label='CMND/CCCD' name='clientId'>
                <Input prefix={<IdcardOutlined />} placeholder='Số CMND/CCCD' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label='Số điện thoại'
                name='clientPhone'
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder='Số điện thoại' />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Phần 2: Thông tin hóa đơn */}
        <Card title={<Title level={4}>Thông tin hóa đơn</Title>} className='mb-6 shadow-sm'>
          <Form.Item label='Trạng thái hóa đơn' name='invoiceState' initialValue='DRAFT'>
            <Select style={{ maxWidth: '300px' }}>
              <Option value='DRAFT'>Nháp</Option>
              <Option value='PENDING'>Chờ thanh toán</Option>
              <Option value='PAID'>Đã thanh toán</Option>
              <Option value='CANCELLED'>Đã hủy</Option>
            </Select>
          </Form.Item>

          <Divider orientation='left'>Chi tiết phòng</Divider>

          <div className='mb-4'>
            <Button type='dashed' icon={<PlusOutlined />}>
              Thêm phòng
            </Button>
          </div>

          <Table
            columns={roomColumns}
            dataSource={[]}
            pagination={false}
            className='mb-6'
            locale={{ emptyText: 'Chưa có thông tin phòng. Vui lòng thêm phòng.' }}
            scroll={{ x: true }}
          />

          <Divider orientation='left'>Chi tiết dịch vụ</Divider>

          <div className='mb-4'>
            <Button type='dashed' icon={<PlusOutlined />}>
              Thêm dịch vụ
            </Button>
          </div>

          <Table
            columns={serviceColumns}
            dataSource={[]}
            pagination={false}
            locale={{ emptyText: 'Chưa có thông tin dịch vụ. Vui lòng thêm dịch vụ.' }}
            scroll={{ x: true }}
          />
        </Card>

        {/* Phần 3: Tổng kết */}
        <Card title={<Title level={4}>Tổng kết hóa đơn</Title>} className='mb-6 shadow-sm'>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label='Ghi chú'>
                <TextArea rows={4} placeholder='Nhập ghi chú cho hóa đơn' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <div className='p-4 bg-gray-50 rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                  <Text>Tổng số phòng:</Text>
                  <Text strong>0</Text>
                </div>
                <div className='flex justify-between items-center mb-4'>
                  <Text>Tổng số dịch vụ:</Text>
                  <Text strong>0</Text>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div className='flex justify-between items-center mb-4'>
                  <Title level={4} style={{ margin: 0 }}>
                    Tổng tiền:
                  </Title>
                  <Title level={4} style={{ margin: 0 }}>
                    0 VND
                  </Title>
                </div>
              </div>
            </Col>
          </Row>

          <div className='flex justify-end mt-6'>
            <Space>
              <Button>Hủy</Button>
              <Button type='primary' icon={<SaveOutlined />}>
                Lưu hóa đơn
              </Button>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  )
}

export default InvoiceCreationForm
