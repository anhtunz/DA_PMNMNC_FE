import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Input, Space, Image, Checkbox, notification, Form, Alert, Upload } from 'antd'
import { InboxOutlined, SearchOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/es/table'
import { getAllServices, createOrUpdateService } from '../../services/service/serviceService'
import { uploadImage } from '../../services/uploadImage/uploadImageService'
import { toastService } from '../../services/toast/ToastService'

interface Service {
  id: string
  name: string
  price: number
  description: string
  url: string
  isActive: boolean
}

interface ServiceFormData {
  id?: string
  name: string
  price: number
  description: string
  url: string
  isActive: boolean
}

interface ValidationErrors {
  name?: string
  price?: string
  description?: string
  url?: string
}

const ServiceManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    price: 0,
    description: '',
    url: '',
    isActive: true
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [previewKey, setPreviewKey] = useState(0) // Thêm key để force update
  const [form] = Form.useForm()

  const { Dragger } = Upload

  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: async (options: any) => {
      const { file, onSuccess, onError } = options
      try {
        const formData = new FormData()

        formData.append('image', file)

        // Debug: Kiểm tra FormData trước khi gửi
        console.log('File to upload:', file)
        for (let [key, value] of formData.entries()) {
          console.log(key, value)
        }

        const response = await uploadImage(formData)

        if (response?.data?.data?.url) {
          onSuccess(
            {
              url: response.data.data.url
            },
            file
          )

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
      ]

      // Tìm lỗi đầu tiên
      const error = validations.find((v) => v.condition)
      if (error) {
        toastService.error(error.message)
        return error.returnValue
      }

      return true
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const response = await getAllServices()
      const servicesArray = response?.data?.data || []
      setServices(servicesArray)
    } catch (error) {
      console.error('Error fetching services:', error)
      alert('Không thể tải dịch vụ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked
    }))
  }

  const handleAddService = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      url: '',
      isActive: true
    })
    setErrors({})
    setErrorMessage(null)
    setEditingServiceId(null)
    form.resetFields()
    setPreviewUrl('')
    setIsModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setFormData({ ...service })
    setErrors({})
    setErrorMessage(null)
    setEditingServiceId(service.id)
    form.setFieldsValue(service)
    setPreviewUrl(service.url || '')
    setIsModalOpen(true)
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Tên dịch vụ không được để trống.'
      isValid = false
    } else if (/[!@#$%^&*()_+]/.test(formData.name)) {
      newErrors.name = 'Tên dịch vụ chỉ được chứa chữ, số, khoảng trắng và dấu - _.'
      isValid = false
    } else if (
      services.some(
        (service) => service.name.toLowerCase() === formData.name.toLowerCase() && service.id !== editingServiceId
      )
    ) {
      newErrors.name = 'Tên dịch vụ đã tồn tại.'
      isValid = false
    }

    // Validate description
    if (formData.description) {
      if (formData.description.length > 255) {
        newErrors.description = 'Mô tả không được vượt quá 255 ký tự.'
        isValid = false
      } else if (/<[^>]*>/.test(formData.description)) {
        newErrors.description = 'Mô tả không được chứa các thẻ HTML hoặc script.'
        isValid = false
      }
    }

    // // Validate url
    // if (!formData.url.trim()) {
    //   newErrors.url = "Link ảnh không được để trống.";
    //   isValid = false;
    // } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(formData.url)) {
    //   newErrors.url = "Link ảnh không hợp lệ. Vui lòng nhập URL hình ảnh đúng định dạng (.jpg, .jpeg, .png, .gif).";
    //   isValid = false;
    // }

    // Validate price
    if (formData.price <= 0) {
      newErrors.price = 'Giá phải là số dương.'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Validate form before submitting
    if (!validateForm()) {
      return
    }

    const payload = editingServiceId ? { ...formData, id: editingServiceId, url: form.getFieldValue('url') } : formData

    try {
      setIsLoading(true)
      console.log('Submitting payload:', payload)
      await createOrUpdateService(payload)
      setIsModalOpen(false)
      fetchServices()
      toastService.success(editingServiceId ? 'Cập nhật dịch vụ thành công' : 'Thêm dịch vụ mới thành công')
    } catch (error: any) {
      console.error('Error saving service:', error)
      setErrorMessage(error.response?.data?.message || 'Không thể lưu dịch vụ. Vui lòng thử lại sau.')
      toastService.error('Không thể lưu dịch vụ. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setErrors({})
    setErrorMessage(null)
  }

  const columns: ColumnType<Service>[] = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Ảnh',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <Image
          width={50}
          height={50}
          src={url || 'https://via.placeholder.com/50'}
          alt='service'
          style={{ objectFit: 'cover', borderRadius: 8 }}
        />
      )
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className='p-2'>
          <Input
            placeholder='Tìm tên'
            value={selectedKeys[0] as string}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type='primary'
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size='small'
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button onClick={() => clearFilters?.()} size='small'>
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.name.toLowerCase().includes((value as string).toLowerCase())
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `${price.toLocaleString()} VND`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Đang hoạt động', value: true },
        { text: 'Ngừng hoạt động', value: false }
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean) => (
        <Space>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isActive ? 'green' : 'red',
              animation: 'pulse 1.5s infinite'
            }}
          />
          <span>{isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Service) => <Button onClick={() => handleEditService(record)}>Sửa</Button>
    }
  ]

  return (
    <div className='min-h-screen bg-gray-100 py-10 px-4'>
      <div className='container mx-auto p-4 bg-white shadow-md rounded-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-4xl font-bold'>Quản lý dịch vụ</h1>
          <Button type='primary' onClick={handleAddService}>
            + Thêm dịch vụ
          </Button>
        </div>

        <Table columns={columns} dataSource={services} loading={isLoading} rowKey='id' pagination={{ pageSize: 5 }} />

        {isModalOpen && (
          <Modal
            title={editingServiceId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
            open={isModalOpen}
            onCancel={closeModal}
            onOk={() => handleSubmit()}
            okText='Lưu'
            cancelText='Hủy'
            confirmLoading={isLoading}
          >
            {errorMessage && (
              <Alert
                message='Lỗi'
                description={errorMessage}
                type='error'
                showIcon
                className='mb-4'
                closable
                onClose={() => setErrorMessage(null)}
              />
            )}

            <Form form={form} layout='vertical' onFinish={handleSubmit}>
              <Form.Item
                label={
                  <span>
                    Tên dịch vụ <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name}
              >
                <Input
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Nhập tên dịch vụ'
                  status={errors.name ? 'error' : ''}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Giá <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                validateStatus={errors.price ? 'error' : ''}
                help={errors.price}
              >
                <Input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder='Nhập giá dịch vụ'
                  addonAfter='VND'
                  status={errors.price ? 'error' : ''}
                />
              </Form.Item>

              <Form.Item label='Mô tả' validateStatus={errors.description ? 'error' : ''} help={errors.description}>
                <Input.TextArea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Nhập mô tả dịch vụ (không bắt buộc)'
                  status={errors.description ? 'error' : ''}
                  showCount
                  maxLength={255}
                />
              </Form.Item>

              {/* <Form.Item
                label={<span>Link ảnh <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={errors.url ? 'error' : ''}
                help={errors.url}
              >
                <Input
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="Nhập URL hình ảnh (.jpg, .jpeg, .png, .gif)"
                  status={errors.url ? 'error' : ''}
                />
              </Form.Item> */}

              <Form.Item
                name='url'
                label='Hình ảnh'
                rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
              >
                <Dragger {...uploadProps}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>Kéo thả ảnh vào đây hoặc click để chọn</p>
                  <p className='ant-upload-hint'>Hỗ trợ tải lên 1 ảnh duy nhất. Dung lượng tối đa 5MB</p>
                </Dragger>

                {(previewUrl || form.getFieldValue('url')) && (
                  <div style={{ marginTop: 16 }}>
                    <Image
                      key={`preview-${previewKey}`} // Thêm key để force reload
                      width={200}
                      src={`${previewUrl || form.getFieldValue('url')}?${previewKey}`} // Thêm query string để chống cache
                      alt='Preview'
                      style={{
                        objectFit: 'cover',
                        borderRadius: 6,
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
                    <Button
                      type='link'
                      onClick={() => setPreviewKey((prev) => prev + 1)}
                      style={{ marginTop: 8, marginLeft: 8 }}
                    >
                      Tải lại ảnh
                    </Button>
                  </div>
                )}
              </Form.Item>

              <Form.Item>
                <Checkbox checked={formData.isActive} onChange={(e) => handleCheckboxChange(e.target.checked)}>
                  Đang hoạt động
                </Checkbox>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default ServiceManager
