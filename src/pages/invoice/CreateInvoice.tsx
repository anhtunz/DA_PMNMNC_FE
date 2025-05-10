import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  Divider,
  Space,
  Typography,
  Table,
  Row,
  Col,
  Spin,
  Modal,
  List,
  Avatar,
  Flex
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  UndoOutlined
} from '@ant-design/icons'
import AddServiceOrRoom from './component/AddServiceOrRoom'
import { toastService } from '../../services/toast/ToastService'
import { NetworkManager } from '../../config/network_manager'
import APIPathConstants from '../../constant/ApiPathConstants'

const { Title, Text } = Typography
const { TextArea } = Input

type Customer = {
  id: string
  name: string
  phone: string
  credential: string
}

const InvoiceCreationForm: React.FC = () => {
  const [form] = Form.useForm()
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isServiceSelected, setIsServiceSelected] = useState(false)

  const [servicesSelect, setServicesSelect] = useState<any>([])
  const [roomSelect, setRoomSelect] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [fieldDisable, setFieldDisable] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddCustomerButtonOpen, setIsAddCustomerButtonOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customer, setCustomer] = useState<Customer | null>()

  const handleModalSubmit = (data: any) => {
    if (isServiceSelected) {
      setServicesSelect(data)
    } else {
      // Nếu data là một đối tượng đơn, đặt nó vào trong mảng
      if (!Array.isArray(data)) {
        setRoomSelect([data])
      } else {
        // Nếu data đã là mảng, gán trực tiếp
        setRoomSelect(data)
      }
    }
    console.log('Dữ liệu được chọn:', data)
  }

  // Hàm xóa phòng
  const handleDeleteRoom = () => {
    setRoomSelect([])
  }

  const handleDeleteService = (id: string) => {
    setServicesSelect((prevService: any) => prevService.filter((service: any) => service.id !== id))
  }

  // Hàm chuyển đổi loại phòng
  const getRoomType = (type: string) => {
    switch (type) {
      case '0':
        return 'Phòng Đơn'
      case '1':
        return 'Phòng Đôi'
      default:
        return 'Không xác định'
    }
  }

  // Hàm định dạng giá tiền
  const formatPrice = (price: any) => {
    if (!price) return '0'
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Cột cho bảng phòng
  const roomColumns = [
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getRoomType(type)
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price: any) => formatPrice(price)
    },

    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type='text' danger icon={<DeleteOutlined />} onClick={() => handleDeleteRoom()} />
      )
    }
  ]

  // Cột cho bảng dịch vụ
  const serviceColumns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price: any) => formatPrice(price)
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: any) => formatPrice(total)
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type='text' danger icon={<DeleteOutlined />} onClick={() => handleDeleteService(record.id)} />
      )
    }
  ]

  const calculateTotal = () => {
    const roomTotal = roomSelect.reduce((sum: number, room: any) => sum + (room.price || 0), 0)
    const serviceTotal = servicesSelect.reduce((sum: number, service: any) => sum + (service.price || 0), 0)
    return formatPrice(roomTotal + serviceTotal)
  }

  const getCustomer = async (searchKey: string) => {
    setLoading(true)
    console.log('SearchKey ', searchKey)

    const body = { textSearch: searchKey }
    try {
      const response = await NetworkManager.instance.createDataInServer(APIPathConstants.SEARCH_CUSTOMER, body)

      const customers: Customer[] = response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        credential: item.CMND
      }))

      if (customers.length == 0) {
        setIsAddCustomerButtonOpen(true)
        toastService.warning('Không tìm thấy người dùng')
      } else if (customers.length == 1) {
        setCustomer(customers[0])
        form.setFieldsValue({
          clientName: customers[0].name,
          clientId: customers[0].credential,
          clientPhone: customers[0].phone
        })
        setFieldDisable(true)
        setCustomers([])
      } else {
        setIsModalOpen(true)
      }
      console.log(customers)
      setCustomers(customers)
      setLoading(false)
    } catch (err: any) {
      console.error('Tạo người dùng thất bại:', err)
      toastService.error(err)
    }
  }

  const handleSearchCustomer = async () => {
    try {
      // Chỉ validate trường searchCustomer
      const searchValue = await form.validateFields(['searchCustomer'])

      // Hiển thị loading spinner
      setLoading(true)

      // Nếu validate thành công, tiến hành tìm kiếm
      console.log('Tìm kiếm với giá trị:', searchValue.searchCustomer)
      await getCustomer(searchValue.searchCustomer)
      // Gọi API hoặc thực hiện tìm kiếm ở đây
      // Ví dụ:
      // const response = await searchCustomerAPI(searchValue.searchCustomer);

      // Nếu tìm thấy khách hàng, điền thông tin vào form
      // Ví dụ giả lập:
      // setTimeout(() => {
      //   setLoading(false) // Tắt loading khi hoàn thành
      //   form.setFieldsValue({
      //     clientName: 'Nguyễn Văn A',
      //     clientId: '0123456789',
      //     clientPhone: '0987654321'
      //   })
      //   message.success('Đã tìm thấy thông tin khách hàng!')
      // }, 2000) // Tăng thời gian để thấy rõ hiệu ứng loading
    } catch (error) {
      // Xử lý khi validate lỗi
      toastService.warning('Vui lòng nhập số điện thoại hoặc CCCD để tìm kiếm!')
    }
  }

  const handleCreateCustomerButton = async () => {
    setLoading(true)
    const values = await form.validateFields()
    console.log('Giá trị form:', values)
    console.log('Giá trị CCCD:', values.clientId)
    console.log('Giá trị name:', values.clientName)
    console.log('Giá trị Phone:', values.clientPhone)
    const body = {
      name: values.clientName,
      phone: values.clientPhone,
      CMND: values.clientId
    }
    try {
      const response = await NetworkManager.instance.createDataInServer(APIPathConstants.CREATE_CUSTOMER, body)

      const newCustomer: Customer = {
        id: response.data.data.id,
        name: '',
        phone: '',
        credential: ''
      }
      setLoading(false)
      setCustomer(newCustomer)
      setFieldDisable(true)
      setIsAddCustomerButtonOpen(false)
      toastService.success('Tạo mới người dùng thành công')
      console.log('New customer: ', customer)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }

  // Hàm xử lý lưu hóa đơn - validate tất cả các trường
  const handleSaveInvoice = async () => {
    setLoading(true)
    try {
      // Validate tất cả các trường trong form
      const values = await form.validateFields()

      // Thêm các kiểm tra bổ sung nếu cần
      if (roomSelect.length === 0) {
        toastService.warning('Chọn phòng cần thuê!')
        return
      }

      const services = servicesSelect.map((service: any) => ({
        id: service.id,
        quantity: service.quantity
      }))

      // Xử lý lưu hóa đơn
      console.log('Giá trị form:', values)
      console.log('Giá trị khách hàng:', customer?.id)
      console.log('Danh sách phòng:', roomSelect[0].id)
      console.log('Danh sách dịch vụ:', servicesSelect)

      const body = {
        clientId: customer?.id,
        roomId: roomSelect[0].id,
        description: values.notes || '',
        services: services
      }

      console.log('Body: ', body)
      await NetworkManager.instance.createDataInServer(APIPathConstants.BOOKING_ROOM, body)
      toastService.success('Tạo hóa đơn thành công')
      setLoading(false)
      clearAll()
    } catch (error: any) {
      // Xử lý khi validate lỗi
      console.error('Tạo hóa đơn thất bại:', error)
      toastService.warning(error)
      setLoading(false)
    }
  }

  const clearAll = async () => {
    form.resetFields()
    setServicesSelect([])
    setRoomSelect([])
    setFieldDisable(false)
    setCustomers([])
    setCustomer(null)
  }

  // Hàm xử lý submit form gốc (nếu cần)
  const handleSubmit = (values: any) => {
    console.log('Đã submit form với giá trị:', values)
    // Thường không cần dùng vì đã xử lý riêng cho từng nút
  }

  const handleOnClickItem = (customer: Customer) => {
    setCustomer(customer)
    setCustomers([])
    form.setFieldsValue({
      clientName: customer.name,
      clientId: customer.credential,
      clientPhone: customer.phone
    })
    setIsModalOpen(false)
    setFieldDisable(true)
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='p-4 lg:p-6'>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Card className='shadow-sm'>
          {loading && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999 opacity-80'>
              <Spin size='large' />
            </div>
          )}
          <div className='flex flex-col md:flex-row justify-center items-center md:items-center mb-6'>
            <Title level={1} className='m-0'>
              Tạo hóa đơn mới
            </Title>
          </div>
          {/* Phần 1: Thông tin khách hàng */}
          <div>
            <Title level={4}>Thông tin khách hàng</Title>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label='Nhập số điện thoại hoặc số CCCD'
                  name='searchCustomer'
                  rules={[{ required: true, message: 'Nhập số điện thoại hoặc CCCD để tìm kiếm' }]}
                >
                  <Input prefix={<SearchOutlined />} placeholder='Nhập số điện thoại hoặc CCCD' />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Row>
                  <Form.Item label=' ' colon={false}>
                    <Button
                      disabled={fieldDisable}
                      type='primary'
                      icon={<SearchOutlined />}
                      onClick={handleSearchCustomer}
                    >
                      Tìm kiếm
                    </Button>
                  </Form.Item>
                </Row>
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
                  <Input disabled={fieldDisable} prefix={<UserOutlined />} placeholder='Họ tên khách hàng' />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label='CMND/CCCD'
                  name='clientId'
                  rules={[{ required: true, message: 'Số CCCD không được để trống' }]}
                >
                  <Input disabled={fieldDisable} prefix={<IdcardOutlined />} placeholder='Số CMND/CCCD' />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label='Số điện thoại'
                  name='clientPhone'
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input disabled={fieldDisable} prefix={<PhoneOutlined />} placeholder='Số điện thoại' />
                </Form.Item>
              </Col>
            </Row>
            {isAddCustomerButtonOpen && (
              <Flex justify='flex-end' align='center' style={{ height: '20px', paddingRight: 16 }}>
                <Form.Item label=' ' colon={false} style={{ marginLeft: '10px' }}>
                  <Button color='green' variant='solid' icon={<PlusOutlined />} onClick={handleCreateCustomerButton}>
                    Thêm mới
                  </Button>
                </Form.Item>
              </Flex>
            )}
          </div>

          <Divider />

          {/* Phần 2: Thông tin hóa đơn */}
          <div>
            <div className='flex flex-col md:flex-row justify-center items-center md:items-center mb-6'>
              <Title level={2} className='m-0'>
                Thông tin hóa đơn
              </Title>
            </div>
            {/* <Title level={10}>Thông tin hóa đơn</Title> */}

            <Divider orientation='left'>Chi tiết phòng</Divider>

            <div className='mb-4'>
              <Button
                type='dashed'
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsServiceModalOpen(true)
                  setIsServiceSelected(false)
                }}
                disabled={roomSelect.length > 0}
              >
                Thêm phòng
              </Button>
            </div>

            <Table
              columns={roomColumns}
              dataSource={roomSelect}
              pagination={false}
              className='mb-6'
              locale={{ emptyText: 'Chưa có thông tin phòng. Vui lòng thêm phòng.' }}
              scroll={{ x: true }}
              rowKey='id'
            />

            <Divider orientation='left'>Chi tiết dịch vụ</Divider>

            <div className='mb-4'>
              <Button
                type='dashed'
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsServiceModalOpen(true)
                  setIsServiceSelected(true)
                }}
              >
                Thêm dịch vụ
              </Button>
            </div>

            {/* Placeholder for AddServiceOrRoom component */}
            <AddServiceOrRoom
              isAddService={isServiceSelected}
              isOpen={isServiceModalOpen}
              setIsOpen={setIsServiceModalOpen}
              onSubmit={handleModalSubmit}
            />
            <Modal title='Danh sách người dùng' open={isModalOpen} onCancel={handleModalCancel} footer={null}>
              <List
                itemLayout='horizontal'
                dataSource={customers}
                renderItem={(customer) => (
                  <div
                    className='hover:bg-green-400 hover:cursor-pointer transition-colors'
                    onClick={() => handleOnClickItem(customer)}
                  >
                    <List.Item className='!p-4'>
                      {' '}
                      {/* !p-4 để override padding nếu cần */}
                      <List.Item.Meta
                        avatar={<Avatar shape='square' icon={<UserOutlined />} />}
                        title={<h3>{customer.name}</h3>}
                        description={customer.phone}
                      />
                    </List.Item>
                  </div>
                )}
              />
            </Modal>

            <Table
              columns={serviceColumns}
              dataSource={servicesSelect}
              pagination={false}
              locale={{ emptyText: 'Chưa có thông tin dịch vụ. Vui lòng thêm dịch vụ.' }}
              scroll={{ x: true }}
              rowKey='id'
            />
          </div>

          <Divider />

          {/* Phần 3: Tổng kết */}
          <div>
            <Title level={4}>Tổng kết hóa đơn</Title>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label='Ghi chú' name='notes'>
                  <TextArea rows={4} placeholder='Nhập ghi chú cho hóa đơn' />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <div className='p-4 bg-gray-50 rounded-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <Text>Tổng số phòng:</Text>
                    <Text strong>{roomSelect.length}</Text>
                  </div>
                  <div className='flex justify-between items-center mb-4'>
                    <Text>Tổng số dịch vụ:</Text>
                    <Text strong>{servicesSelect.length}</Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div className='flex justify-between items-center mb-4'>
                    <Title level={4} style={{ margin: 0 }}>
                      Tổng tiền:
                    </Title>
                    <Title level={4} style={{ margin: 0 }}>
                      {calculateTotal()} VND
                    </Title>
                  </div>
                </div>
              </Col>
            </Row>

            <div className='flex justify-end mt-6'>
              <Space>
                <Button color='danger' variant='solid' icon={<UndoOutlined />} onClick={clearAll}>
                  Đặt lại
                </Button>
                <Button type='primary' icon={<SaveOutlined />} onClick={handleSaveInvoice}>
                  Lưu hóa đơn
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </Form>
    </div>
  )
}

export default InvoiceCreationForm
