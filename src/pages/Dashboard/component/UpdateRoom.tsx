import { CalendarOutlined, DownloadOutlined, HomeOutlined, PrinterOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Modal, Skeleton, Table, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import type { Breakpoint } from 'antd/es/_util/responsiveObserver'
import { NetworkManager } from '../../../config/network_manager'
import { toastService } from '../../../services/toast/ToastService'
import APIPathConstants from '../../../constant/ApiPathConstants'
const { Title, Text } = Typography

// Define TypeScript interfaces for our data structure
interface Client {
  id: string
  name: string
  phone: string
  CMND: string
}

interface Room {
  roomId: string
  name: string
  description: string
  type: string
  price: number
  timeCheckIn: string
  timeCheckOut: string
  totalPrice: number
}

interface Invoice {
  id: string
  description: string
  totalPrice: number
}

interface Service {
  fnb_id: string
  name: string
  price: number
  description: string
  quantity: number
  totalPrice: number
}

interface InvoiceData {
  client: Client
  room: Room
  invoice: Invoice
  services: Service[]
}

// Sample data from your provided JSON
const sampleData: InvoiceData = {
  client: {
    id: 'f9916c5f-407a-437e-9a60-4f92074bb52c',
    name: 'Trần Anh Tuấn',
    phone: '0886260950',
    CMND: '218731789231'
  },
  room: {
    roomId: '4364d3bc-cbe5-4b8c-b016-81ea213ff930',
    name: 'Phòng 5',
    description: 'p',
    type: '0',
    price: 1000000,
    timeCheckIn: '2025-05-09 23:08:35',
    timeCheckOut: '2025-05-10T16:23:42.773826Z',
    totalPrice: 24250000
  },
  invoice: {
    id: '449a6481-62fc-4278-b277-8da3c1cbc105',
    description: 'Trần Anh Tuấn test',
    totalPrice: 24460000
  },
  services: [
    {
      fnb_id: '6b96e15f-1637-4fe1-bdf3-5fb046ee33e4',
      name: 'Bít tết bò áp',
      price: 200000,
      description: 'Chưa có mô tả',
      quantity: 1,
      totalPrice: 0
    },
    {
      fnb_id: '5d9f3965-1517-43d9-b56f-2b7c901140bf',
      name: 'pate',
      price: 10000,
      description: 'Ngon nhưng hết tiền',
      quantity: 1,
      totalPrice: 0
    }
  ]
}

type AddServiceOrRoomProps = {
  roomID: string
  isOpen: boolean
  setIsOpen: any
  datePayment: String
  onCallback: (data: boolean) => void
}

const UpdateRoom: React.FC<AddServiceOrRoomProps> = ({ roomID, isOpen, setIsOpen, datePayment, onCallback }) => {
  const [invoice, setInvoice] = useState<InvoiceData>(sampleData)
  const [isLoading, setIsLoading] = useState(false)
  const [onAutoClose, setOnAutoClose] = useState(300)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    let timeoutId: ReturnType<typeof setTimeout>
    if (isOpen) {
      setOnAutoClose(300)
      intervalId = setInterval(() => {
        setOnAutoClose((prev) => prev - 1)
      }, 1000)

      timeoutId = setTimeout(
        () => {
          setIsOpen(false)
        },
        5 * 60 * 1000
      )
    }
    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [isOpen])

  const getRoomInvoice = async () => {
    setIsLoading(true)
    try {
      const body = {
        id: roomID,
        datePayment: datePayment
      }
      const response = await NetworkManager.instance.createDataInServer(APIPathConstants.GET_DETAIL_ROOM_USING, body)
      console.log(response)

      const info: InvoiceData = {
        client: response.data.data.client,
        room: response.data.data.room,
        invoice: response.data.data.invoice,
        services: response.data.data.services
      }
      setInvoice(info)

      console.log('dajkhdaksjsda', info)
      setIsLoading(false)
      //   setLoading(false)
      //   setCustomer(newCustomer)
      //   setFieldDisable(true)
      //   setIsAddCustomerButtonOpen(false)
      //   toastService.success('Tạo mới người dùng thành công')
      //   console.log('New customer: ', customer)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }

  useEffect(() => {
    getRoomInvoice()
  }, [isOpen])
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const confirmPayment = async () => {
    console.log('Thanh toans ', datePayment)

    const id = toastService.default('Đang xử lý', {
      autoClose: false,
      closeButton: false,
      isLoading: true
    })
    try {
      const body = {
        invoiceId: invoice.invoice.id,
        datePayment: datePayment
      }
      await NetworkManager.instance.createDataInServer(APIPathConstants.CONFIRM_PAYMENT, body)

      toastService.update(id, {
        render: 'Thanh toán thành công',
        type: 'success',
        autoClose: 2000,
        closeButton: true,
        isLoading: false
      })
      setIsOpen(false)
      onCallback(true)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
      toastService.update(id, {
        render: 'Thanh toán thất bại',
        type: 'error',
        autoClose: 2000,
        closeButton: true,
        isLoading: false
      })
    }
  }

  // Format date string to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }
  const calculateDays = (checkIn: string, checkOut: string) => {
    try {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    } catch (error) {
      return 1
    }
  }

  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text: string) => <div className='max-w-32 md:max-w-full'>{text}</div>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      responsive: ['md' as Breakpoint]
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price)
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      className: 'text-center'
    },
    {
      title: 'Thành tiền',
      key: 'totalPrice',
      render: (record: Service) => formatCurrency(record.price * record.quantity)
    }
  ]

  const handleCancel = () => {
    setIsOpen(false)
  }

  const serviceTotal = invoice.services?.reduce((sum: any, service: any) => sum + service.price * service.quantity, 0)

  const days = calculateDays(invoice.room.timeCheckIn, invoice.room.timeCheckOut)

  return (
    <>
      <Modal
        centered
        title={
          <h2 className='text-title-sm'>
            {' '}
            Thông tin hóa đơn <span className='text-red-500'>({onAutoClose}s)</span>{' '}
          </h2>
        }
        open={isOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width='50%'
        footer={null}
        styles={{
          header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          },
          body: {
            height: '80vh',
            overflowY: 'auto',
            padding: '10px',
            marginTop: '10px'
          },
          content: {
            borderRadius: '0px'
          }
        }}
        className='md:w-[80%] md:max-w-[1000px]'
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className='w-full max-w-4xl mx-auto p-2 sm:p-4 bg-gray-50'>
            <Card className='shadow-lg overflow-hidden'>
              {/* Header */}
              <div className='flex flex-col items-center mb-4 sm:mb-6'>
                <Title level={2} className='mb-0 text-blue-700 text-xl sm:text-2xl md:text-3xl text-center'>
                  HÓA ĐƠN THANH TOÁN
                </Title>

                <Text type='secondary' className='text-xs sm:text-sm'>
                  Mã hóa đơn: {invoice.invoice.id}
                </Text>
                <Text type='secondary' className='text-xs sm:text-sm'>
                  Ngày: {formatDate(new Date().toISOString())}
                </Text>
              </div>

              {/* Client Information */}
              <Card className='mb-4 sm:mb-6 bg-blue-50 p-2 sm:p-4'>
                <div className='flex items-center mb-2'>
                  <UserOutlined className='mr-2 text-blue-600' />
                  <Title level={4} className='mb-0 text-base sm:text-lg md:text-xl'>
                    Thông tin khách hàng
                  </Title>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base'>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Họ và tên:
                    </Text>{' '}
                    {invoice.client.name}
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Số điện thoại:
                    </Text>{' '}
                    {invoice.client.phone}
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      CMND/CCCD:
                    </Text>{' '}
                    {invoice.client.CMND}
                  </div>
                  <div className='break-words overflow-hidden text-ellipsis'>
                    <Text strong className='inline-block mr-1'>
                      Mã khách hàng:
                    </Text>
                    <span className='whitespace-nowrap overflow-hidden text-ellipsis'>{invoice.client.id}</span>
                  </div>
                </div>
              </Card>

              {/* Room Information */}
              <Card className='mb-4 sm:mb-6 bg-green-50 p-2 sm:p-4'>
                <div className='flex items-center mb-2'>
                  <HomeOutlined className='mr-2 text-green-600' />
                  <Title level={4} className='mb-0 text-base sm:text-lg md:text-xl'>
                    Thông tin phòng
                  </Title>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base'>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Tên phòng:
                    </Text>{' '}
                    {invoice.room.name}
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Mô tả:
                    </Text>{' '}
                    {invoice.room.description}
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Giá phòng:
                    </Text>{' '}
                    {formatCurrency(invoice.room.price)}
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Loại phòng:
                    </Text>
                    <Tag color={'green'} className='ml-1 text-xs sm:text-sm'>
                      {invoice.room.type === '0' ? 'Phòng đơn' : 'Phòng đôi'}
                    </Tag>
                  </div>
                </div>
              </Card>

              {/* Check-in/Check-out */}
              <Card className='mb-4 sm:mb-6 bg-yellow-50 p-2 sm:p-4'>
                <div className='flex items-center mb-2'>
                  <CalendarOutlined className='mr-2 text-yellow-600' />
                  <Title level={4} className='mb-0 text-base sm:text-lg md:text-xl'>
                    Thời gian lưu trú
                  </Title>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base'>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Nhận phòng:
                    </Text>
                    <span className='whitespace-normal'>{formatDate(invoice.room.timeCheckIn)}</span>
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Trả phòng:
                    </Text>
                    <span className='whitespace-normal'>{formatDate(invoice.room.timeCheckOut)}</span>
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Số ngày:
                    </Text>{' '}
                    {days} ngày
                  </div>
                  <div className='break-words'>
                    <Text strong className='inline-block mr-1'>
                      Tổng tiền phòng:
                    </Text>{' '}
                    {formatCurrency(invoice.room.totalPrice)}
                  </div>
                </div>
              </Card>

              {/* Services */}
              <Card className='mb-4 sm:mb-6 bg-purple-50 p-2 sm:p-4'>
                <Title level={4} className='text-base sm:text-lg md:text-xl'>
                  Dịch vụ đã sử dụng
                </Title>
                <div className='overflow-x-auto -mx-2 sm:mx-0'>
                  <Table
                    dataSource={invoice.services}
                    columns={columns}
                    pagination={false}
                    rowKey='fnb_id'
                    size='small'
                    className='text-xs sm:text-sm'
                    scroll={{ x: 'max-content' }}
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={4} className='text-right font-bold'>
                            Tổng tiền dịch vụ:
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className='font-bold'>
                            {formatCurrency(serviceTotal)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </div>
              </Card>

              {/* Total */}
              <Card className='mb-4 sm:mb-6 bg-red-50 p-2 sm:p-4'>
                <div className='flex flex-col sm:flex-row justify-between items-center'>
                  <Title level={3} className='mb-2 sm:mb-0 text-lg sm:text-xl md:text-2xl'>
                    Tổng thanh toán:
                  </Title>
                  <Title level={2} className='text-red-600 text-xl sm:text-2xl md:text-3xl'>
                    {formatCurrency(invoice.invoice.totalPrice)}
                  </Title>
                </div>
                <Text type='secondary' className='italic text-sm sm:text-base mt-2 text-center sm:text-left'>
                  {invoice.invoice.description}
                </Text>
              </Card>

              <Divider className='my-4 sm:my-6' />

              {/* Actions */}
              <div className='flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4'>
                <Button
                  onClick={() => confirmPayment()}
                  type='primary'
                  icon={<PrinterOutlined />}
                  size='middle'
                  className='w-full sm:w-auto'
                >
                  Thanh Toán
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </>
  )
}

export default UpdateRoom
