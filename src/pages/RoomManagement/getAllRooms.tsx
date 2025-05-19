import { Button, Card, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Tag, Image, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { toastService } from '../../services/toast/ToastService'
import TableComponent from '../../components/common/TableComponent'
import { InboxOutlined } from '@ant-design/icons'
import { createOrUpdateRoom, getAllRooms } from '../../services/room/roomService'
import { uploadImage } from '../../services/uploadImage/uploadImageService'
import { useTitle } from '../../hooks/useTitle'

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

  const { Dragger } = Upload

  // Thêm props upload cho Dragger
  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: async (options: any) => {
      const { file, onSuccess, onError } = options
      try {
        // setLoading(true)
        const formData = new FormData()

        formData.append('image', file)

        // Debug: Kiểm tra FormData trước khi gửi
        console.log('File to upload:', file)
        for (let [key, value] of formData.entries()) {
          console.log(key, value)
        }

        const response = await uploadImage(formData)

        if (response?.data?.data?.url) {
          onSuccess({
            url: response.data.data.url
          }, file)

          // Cập nhật form và preview
          form.setFieldsValue({ url: response.data.data.url })
          setPreviewUrl(response.data.data.url)
          toastService.success('Tải lên ảnh thành công')
        } else {
          throw new Error('Không nhận được URL từ API')
        }

      } catch (error: any) {
        console.error('Upload error:', error)
        onError(error)
        toastService.error('Tải lên ảnh thất bại: ' + (error.response?.data?.message || error.message))
      }
    },
    beforeUpload: (file: File) => {
      // Danh sách loại file cho phép
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
      // Kích thước tối đa cho phép (5MB)
      const MAX_SIZE_MB = 5
      const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024 // 5MB

      // Kiểm tra theo thứ tự ưu tiên
      const validations = [
        {
          condition: !(file instanceof File),
          message: 'Dữ liệu upload không hợp lệ',
          returnValue: false
        },
        {
          condition: !file.type.startsWith('image/'),
          message: 'Chỉ được tải lên file ảnh!',
          returnValue: Upload.LIST_IGNORE
        },
        {
          condition: file.size > MAX_SIZE,
          message: `Ảnh phải nhỏ hơn ${MAX_SIZE_MB}MB!`,
          returnValue: Upload.LIST_IGNORE
        },
        {
          condition: !ALLOWED_TYPES.includes(file.type),
          message: 'Chỉ chấp nhận ảnh JPG/PNG/WEBP',
          returnValue: Upload.LIST_IGNORE
        }
      ];

      // Tìm lỗi đầu tiên
      const error = validations.find(v => v.condition)
      if (error) {
        toastService.error(error.message)
        return error.returnValue
      }

      return true
    },
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Hàm gọi API để lấy dữ liệu
  const fetchData = async (search = '') => {
    setIsModalOpen(false)
    setLoading(true)
    try {
      const response = await getAllRooms({ searchName: search })
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
        id: editingRoom ? editingRoom?.id : null,
        isActive: editingRoom ? values.isActive : true
      }
      const response = await createOrUpdateRoom(body)
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

  // Cấu hình các cột cho bảng
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

  useTitle('Quản lý phòng')
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
        onCancel={() => { setIsModalOpen(false); form.resetFields() }}
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

          {/* Trường tải lên hình ảnh */}
          <Form.Item
            name="url"
            label="Hình ảnh"
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc click để chọn</p>
              <p className="ant-upload-hint">
                Hỗ trợ tải lên 1 ảnh duy nhất. Dung lượng tối đa 5MB
              </p>
            </Dragger>

            {(previewUrl || form.getFieldValue('url')) && (
              <div style={{ marginTop: 16 }}>
                <Image
                  key={`preview-${previewKey}`} // Thêm key để force reload
                  width={200}
                  src={`${previewUrl || form.getFieldValue('url')}?${previewKey}`} // Thêm query string để chống cache
                  alt="Preview"
                  style={{
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid #d9d9d9'
                  }}
                  placeholder={
                    <div style={{
                      width: 200,
                      height: 150,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0'
                    }}>
                      Đang tải ảnh...
                    </div>
                  }
                  fallback="https://via.placeholder.com/200x150?text=Không+thể+tải+ảnh"
                />
                <Button
                  type="link"
                  onClick={() => setPreviewKey(prev => prev + 1)}
                  style={{ marginTop: 8, marginLeft: 8 }}
                >
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
              {
                pattern: /^[^<>"']+$/,
                message: 'Không được chứa các ký tự: < > " \' '
              },
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
