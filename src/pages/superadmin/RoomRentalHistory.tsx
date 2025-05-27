import { useEffect, useState } from 'react'
import { useTitle } from '../../hooks/useTitle'
import { Select, Table, TableProps, Tag } from 'antd'
import APIPathConstants from '../../constant/ApiPathConstants'
import { NetworkManager } from '../../config/network_manager'
import { toastService } from '../../services/toast/ToastService'

type RoomRentalData = {
  room_id: string
  invoice_id: string
  time_checkin: Date
  time_checkout: string
  status: boolean
  price: number
  type: string
  name: string
}

type Room = {
  id: string
  name: string
  description: string
  type: string
  price: number
  url: string
}

const RoomRentalHistory = () => {
  useTitle('Lịch sử thuê phòng')

  const [rooms, setRooms] = useState<Room[] | null>(null)
  const [roomHistoryRental, setRoomHistoryRental] = useState<RoomRentalData[] | null>(null)
  const [isSelectRoomLoading, setIsSelectRoomLoading] = useState<boolean>(false)
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false)

  const getAllRooms = async () => {
    setIsSelectRoomLoading(true)
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_ALL_ROOM)
      const rooms: Room[] = response.data.data.map((item: Room) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        type: item.type,
        roomImage: item.url
      }))
      console.log(rooms)
      setRooms(rooms)
      setIsSelectRoomLoading(false)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
      setIsSelectRoomLoading(false)
    }
  }

  useEffect(() => {
    getAllRooms()
  }, [])

  const onChange = async (value: string) => {
    console.log(`selected ${value}`)
    await getRoomRentalHistory({ roomID: value })
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  const getRoomRentalHistory = async ({ roomID }: { roomID: string }) => {
    setIsTableLoading(true)
    try {
      const response = await NetworkManager.instance.getDataFromServer(
        `${APIPathConstants.GET_ROOMS_RENTAL_HISTORY}/${roomID}`
      )
      const rooms: RoomRentalData[] = response.data.data.map((item: RoomRentalData) => ({
        room_id: item.room_id,
        name: item.name,
        price: item.price,
        time_checkin: item.time_checkin,
        time_checkout: item.time_checkout,
        type: item.type,
        invoice_id: item.invoice_id,
        status: item.status
      }))
      console.log(rooms)
      setRoomHistoryRental(rooms)
      setIsTableLoading(false)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
      setIsTableLoading(false)
    }
  }

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

  const roomColumns: TableProps<RoomRentalData>['columns'] = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'invoice_id',
      key: 'invoice_id'
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
      render: (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(price)
      }
    },
    {
      title: 'Bắt đầu thuê',
      dataIndex: 'time_checkin',
      key: 'time_checkin'
    },
    {
      title: 'Kết thúc thuê',
      dataIndex: 'time_checkout',
      key: 'time_checkout'
    },
    {
      title: 'Trang thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => {
        return status ? <Tag color='success'>Đã thanh toán</Tag> : <Tag color='processing'>Chưa hoàn thành</Tag>
      }
    }
  ]

  return (
    <div className='w-full  mx-auto p-4 lg:p-8 space-y-8 bg-white min-h-screen'>
      <div className='text-center space-y-6'>
        <div>
          <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>Lịch sử thuê phòng</h1>
        </div>

        <div className='flex justify-center'>
          <div className='w-full max-w-md'>
            <Select
              showSearch
              allowClear
              loading={isSelectRoomLoading}
              placeholder='Chọn phòng để xem lịch sử'
              optionFilterProp='label'
              onChange={onChange}
              onSearch={onSearch}
              className='w-full border-1 border-black rounded-lg shadow-sm '
              size='large'
              style={{
                height: '40px'
              }}
              options={
                rooms?.map((room) => ({
                  value: room.id,
                  label: room.name
                })) || []
              }
            />
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
        <div className='px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-center'>
          <h3 className='text-lg font-semibold text-gray-900'>Danh sách lịch sử thuê</h3>
        </div>

        <div className='overflow-x-auto'>
          <Table
            columns={roomColumns}
            dataSource={roomHistoryRental || []}
            loading={isTableLoading}
            pagination={{
              // defaultPageSize: 1,
              position: ['bottomCenter']
            }}
            className='w-full'
            locale={{
              emptyText: (
                <div className='py-16 text-center'>
                  <div className='mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
                    <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                      />
                    </svg>
                  </div>
                  <h4 className='text-gray-900 text-lg font-medium mb-2'>Chưa có lịch sử thuê phòng</h4>
                  <p className='text-gray-500 text-base'>Vui lòng chọn phòng ở trên để xem lịch sử thuê</p>
                </div>
              )
            }}
            scroll={{ x: true }}
            rowKey='id'
            size='middle'
          />
        </div>
      </div>
    </div>
  )
}

export default RoomRentalHistory
