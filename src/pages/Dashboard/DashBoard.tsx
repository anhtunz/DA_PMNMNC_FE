import { useEffect, useState } from 'react'
import { Button, Image, Skeleton, Tag } from 'antd'
import { NetworkManager } from '../../config/network_manager'
import APIPathConstants from '../../constant/ApiPathConstants'
import { toastService } from '../../services/toast/ToastService'
import UpdateRoom from './component/UpdateRoom'
import { CreditCardOutlined, PlusOutlined } from '@ant-design/icons'
import UpdateServices from './component/UpdateServices'
import { useTitle } from '../../hooks/useTitle'
type Room = {
  id: string
  name: string
  description: string
  type: string
  price: number
  roomImage: string
  isAvailable: boolean
}
const DashBoardPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmPaymentlOpen, setIsConfirmPaymentlOpen] = useState(false)

  const [isUpdateServicesModalOpen, setIsUpdateServicesModalOpen] = useState(false)
  const [isServicesInRoom, setIsServicesInRoom] = useState([])
  const [isServicesInRoomInvoiceID, setIsServicesInRoomInvoiceID] = useState()
  const [selectedRoomID, setSelectedRoomID] = useState<string | null>(null)
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_ALL_ROOM)
      const rooms: Room[] = response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        type: item.type,
        roomImage: item.url,
        isAvailable: item.isAvailable
      }))
      console.log(rooms)
      setRooms(rooms)

      setIsLoading(false)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleCallback = async (data: boolean) => {
    if (data == true) {
      fetchData()
    }
  }

  const formatDateTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  const handleOnClickRom = (room: Room) => {
    console.log(room.id)
    console.log(formatDateTime(new Date()))

    setSelectedRoomID(room.id)
    setIsConfirmPaymentlOpen(true)
  }

  const handleUpdateServiceInRoomClick = async (roomID: string) => {
    try {
      const body = {
        id: roomID,
        datePayment: formatDateTime(new Date())
      }
      const response = await NetworkManager.instance.createDataInServer(APIPathConstants.GET_DETAIL_ROOM_USING, body)
      console.log(response)
      setIsServicesInRoom(response.data.data.services)
      setIsServicesInRoomInvoiceID(response.data.data.invoice.id)
      setIsUpdateServicesModalOpen(true)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }
  useTitle('Trang chủ')
  return isLoading ? (
    <Skeleton />
  ) : (
    <div className='flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-start'>
      {rooms.map((room) => (
        <div

          key={room.id}
          className={`flex flex-col h-auto md:h-48 items-center border rounded-lg shadow-sm md:flex-row w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] hover:shadow-md transition-shadow duration-200 ${room.isAvailable ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className='w-full h-36 md:w-48 md:h-full'>
            <Image
              className='rounded-t-lg md:rounded-none md:rounded-s-lg'
              src={
                room.type == '0'
                  ? 'https://decoxdesign.com/upload/images/hotel-caitilin-1952m2-phong-ngu-01-decox-design.jpg'
                  : 'https://kientruchoanmy.vn/wp-content/uploads/2022/06/thiet-ke-khach-san-mini-1.jpg'
              }
              alt=''
              width='100%'
              height='100%'
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>

          <div className='flex flex-col justify-between p-4 leading-normal flex-1 h-full'>
            <div className='flex-1'>
              <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-1'>
                {room.name} - {room.type == '0' ? 'Đơn' : 'Đôi'}
              </h5>
              <p className='mb-3 font-normal text-gray-700 text-sm line-clamp-2'>{room.description}</p>
              <Tag color={room.isAvailable ? 'green' : 'red'} className='mb-2'>
                {room.isAvailable ? 'Đang hoạt động' : 'Đã được đặt'}
              </Tag>
            </div>

            {/* Action Buttons - Vertical layout */}
            {!room.isAvailable && (
              <div className='flex flex-col gap-2 mt-2 w-full'>
                <Button
                  type='default'
                  size='small'
                  icon={<PlusOutlined />}
                  className='w-full'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUpdateServiceInRoomClick(room.id)
                    console.log('Add service for room:', room.id)
                  }}
                >
                  Thêm dịch vụ
                </Button>

                <Button
                  type='primary'
                  size='small'
                  icon={<CreditCardOutlined />}
                  className='w-full'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOnClickRom(room)
                    console.log('Payment for room:', room.id)
                  }}
                >
                  Thanh toán
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      {selectedRoomID && (
        <UpdateRoom
          roomID={selectedRoomID}
          isOpen={isConfirmPaymentlOpen}
          setIsOpen={setIsConfirmPaymentlOpen}
          datePayment={formatDateTime(new Date())}
          onCallback={handleCallback}
        />
      )}
      {isServicesInRoom && (
        <UpdateServices
          initialServices={isServicesInRoom}
          isOpen={isUpdateServicesModalOpen}
          setIsOpen={setIsUpdateServicesModalOpen} invoiceId={isServicesInRoomInvoiceID} />
      )}
    </div>
  )
}
export default DashBoardPage
