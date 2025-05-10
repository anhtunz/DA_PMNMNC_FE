import { Button, Card, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Tag, Image } from 'antd'
import React, { useEffect, useState } from 'react'
import { NetworkManager } from '../../config/network_manager'
import { toastService } from '../../services/toast/ToastService'
import TableComponent from '../../components/common/TableComponent'
// import TableComponent from '../../components/common/TableComponent'
// import axios from "axios"

// const url = "http://127.0.0.1:8000/api/room-management/get-all"

interface Room {
  id?: string
  name: string
  description: string
  type: string
  price: number
  isActive: boolean
  url?: string
}

const GetAllRoomsPage: React.FC = () => {
  const [data, setData] = useState<Room[]>([])
  const [nameSearch, setNameSearch] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewKey, setPreviewKey] = useState(0) // Thêm key để force update
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  // Xử lý khi URL thay đổi
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    form.setFieldsValue({ url: newUrl }) // Cập nhật giá trị trong form
    setPreviewUrl(newUrl)
    setPreviewKey((prev) => prev + 1)
  }

  // Hàm gọi API để lấy dữ liệu
  const fetchData = async (search = '') => {
    setIsModalOpen(false)
    setLoading(true)
    try {
      const response = await NetworkManager.instance.createDataInServer('/room-management/get-all', {
        nameSearch: search
      })
      if (response) setData(response.data.data)
    } catch (error: any) {
      toastService.error(error.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    fetchData(nameSearch.trim())
  }

  // Hàm xử lý khi nhấn nút "Thêm phòng"
  const handleCreate = () => {
    setEditingRoom(null)
    form.resetFields()
    form.setFieldsValue({
      isActive: false
    })
    setPreviewUrl('')
    setIsModalOpen(true)
  }

  // Hàm xử lý khi nhấn nút "Sửa"
  const handleEdit = (record: any) => {
    setEditingRoom(record)
    form.setFieldsValue({
      ...record,
      url: record.url
    })
    setPreviewUrl(record.url || '')
    setIsModalOpen(true)
  }

  // Hàm xử lý khi nhấn nút "Cập nhật" trong modal
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const body = {
        ...values,
        id: editingRoom ? editingRoom?.id : null
      }
      const response = await NetworkManager.instance.createDataInServer('/room-management/create-or-update-room', body)
      if (!response) {
        console.error('Response is undefined')
        return
      }
      toastService.success(editingRoom ? 'Cập nhật phòng thành công' : 'Tạo phòng thành công')
      form.resetFields()
      setIsModalOpen(false)
      fetchData()
    } catch (error: any) {
      toastService.error(error.data?.message || 'Có lỗi xảy ra')
      console.error(error)
    }
  }

  /*
   * Các cột trong bảng
   */
  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'ascend' as const,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name)
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'url',
      key: 'url',
      render: (text: any) => (
        <img src={text} alt='Room' style={{ width: '75px', height: '75px', borderRadius: '8px' }} />
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      sorter: (a: any, b: any) => a.description.localeCompare(b.description)
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      render: (text: any) => (
        <span style={{ color: text === '0' ? 'blue' : 'orange' }}>{text === '0' ? 'Phòng đơn' : 'Phòng đôi'}</span>
      ),
      filters: [
        { text: 'Phòng đơn', value: '0' },
        { text: 'Phòng đôi', value: '1' }
      ],
      onFilter: (value: any, record: any) => record.type.toString() === value
    },
    {
      title: 'Giá phòng (VND)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: any, b: any) => a.price - b.price,
      render: (text: any) => <span>{text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? 'lightgreen' : 'darkred'}
          style={{ color: isActive ? 'brown' : 'white', fontWeight: 'bold' }}
          className='rounded-lg'
        >
          {isActive ? 'Đang hoạt động' : 'Đã dừng'}
        </Tag>
      ),
      filters: [
        { text: 'Đang hoạt động', value: 'true' },
        { text: 'Đã dừng', value: 'false' }
      ],
      onFilter: (value: any, record: any) => record.isActive.toString() === value
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size='large'>
          <Button type='link' onClick={() => handleEdit(record)}>
            Sửa
          </Button>
        </Space>
      )
    }
  ]

  return (
    <>
      <Card
        title='Thông tin phòng'
        loading={loading}
        extra={
          <div className='flex justify-end mb-4 mt-4'>
            <Button type='primary' onClick={handleCreate}>
              Thêm phòng
            </Button>
          </div>
        }
      >
        <div>
          <Space.Compact style={{ width: '50%', alignItems: 'center', marginBottom: '20px' }}>
            <Input
              placeholder='Nhập tên phòng để tìm kiếm'
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
            <Button type='primary' onClick={handleSearch}>
              Tìm
            </Button>
            <Button
              onClick={() => {
                setNameSearch('')
                fetchData()
              }}
              className='rounded-lg'
            >
              Đặt lại
            </Button>
          </Space.Compact>
        </div>
        <TableComponent columns={columns} dataSource={data} pageSizeCustom={5} />
      </Card>

      <Modal
        title={editingRoom ? 'Cập nhật phòng' : 'Tạo phòng'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        cancelText='Hủy'
        okText='Cập nhật'
      >
        <Form form={form} layout='vertical'>
          {/* Trường nhập tên */}
          <Form.Item
            name='name'
            label='Tên phòng'
            rules={[
              { required: true, message: 'Vui lòng nhập tên phòng!' },
              { pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/, message: 'Không được chứa ký tự đặc biệt!' }
            ]}
          >
            <Input placeholder='Nhập tên phòng' className='rounded-lg' />
          </Form.Item>

          {/* Trường nhập đường dẫn hình ảnh */}
          <Form.Item
            name='url'
            label='Hình ảnh'
            rules={[
              { required: true, message: 'Vui lòng nhập đường dẫn hình ảnh!' },
              { type: 'url', message: 'Đường dẫn không hợp lệ!' }
            ]}
          >
            <Input placeholder='Nhập đường dẫn hình ảnh' onChange={handleUrlChange} />
            {/* Hiển thị ảnh xem trước */}
            {(previewUrl || form.getFieldValue('url')) && (
              <div style={{ marginTop: 16 }}>
                <Image
                  key={`preview-${previewKey}`} // Sử dụng key để force reload ảnh
                  width={200}
                  height={150}
                  src={`${previewUrl || form.getFieldValue('url')}?${previewKey}`} // Thêm query string để tránh cache
                  alt='Preview'
                  style={{
                    objectFit: 'cover',
                    borderRadius: 4,
                    border: '1px solid #d9d9d9'
                  }}
                  placeholder={
                    <div
                      style={{
                        width: 200,
                        height: 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0'
                      }}
                    >
                      Đang tải ảnh...
                    </div>
                  }
                  fallback='https://via.placeholder.com/200x150?text=Không+thể+tải+ảnh'
                />
                <Button type='link' onClick={() => setPreviewKey((prev) => prev + 1)} style={{ marginTop: 8 }}>
                  Tải lại ảnh
                </Button>
              </div>
            )}
          </Form.Item>

          {/* Trường nhập mô tả */}
          <Form.Item
            name='description'
            label='Mô tả'
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' },
              { pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/, message: 'Không được chứa ký tự đặc biệt!' },
              { max: 100, message: 'Mô tả không được quá 100 ký tự!' }
            ]}
          >
            <Input.TextArea placeholder='Nhập mô tả' rows={4} showCount maxLength={100} className='rounded-lg' />
          </Form.Item>

          {/* Trường chọn loại phòng */}
          <Form.Item name='type' label='Loại phòng' rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}>
            <Select placeholder='Chọn loại phòng' className='rounded-lg'>
              <Select.Option value={'0'}>Phòng đơn</Select.Option>
              <Select.Option value={'1'}>Phòng đôi</Select.Option>
            </Select>
          </Form.Item>

          {/* Trường nhập giá phòng */}
          <Form.Item
            name='price'
            label='Giá phòng (VND)'
            rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>

          {/* Trường trạng thái (chỉ hiển thị khi sửa thông tin phòng) */}
          {editingRoom && (
            <Form.Item name='isActive' label='Trạng thái' valuePropName='checked'>
              <Checkbox>Đang hoạt động</Checkbox>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default GetAllRoomsPage
