import { Button, Image, Modal, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { NetworkManager } from '../../../config/network_manager'
import { toastService } from '../../../services/toast/ToastService'
import APIPathConstants from '../../../constant/ApiPathConstants'
import { MinusOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'

type Service = {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
  quantity: number
  total: number
}

type Room = {
  id: string
  name: string
  description: string
  type: string
  price: number
  roomImage: string
}

type AddServiceOrRoomProps = {
  isAddService: boolean
  isOpen: boolean
  setIsOpen: any
  onSubmit: (data: Service[]) => void
}

const AddServiceOrRoom: React.FC<AddServiceOrRoomProps> = ({ isAddService, isOpen, setIsOpen, onSubmit }) => {
  const [services, setServices] = useState<Service[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  //   const [selectedRoom, setSelectedRoom] = useState<Service[]>([])
  const getUrl = () => {
    return isAddService ? APIPathConstants.GET_ALL_SERVICE_STAFF : APIPathConstants.GET_ALL_ROOM_STAFF
  }
  const fetchData = async () => {
    setIsLoading(true)
    const url = getUrl()
    if (!url) return
    try {
      const response = await NetworkManager.instance.getDataFromServer(url)
      if (isAddService) {
        const services: Service[] = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.url,
          quantity: 0,
          total: 0
        }))
        console.log(services)
        setServices(services)
      } else {
        const rooms: Room[] = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          type: item.type,
          roomImage: item.url
        }))
        console.log(rooms)
        setRooms(rooms)
      }

      setIsLoading(false)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }
  useEffect(() => {
    if (isOpen) {
      console.log('true')

      fetchData()
    }
  }, [isOpen])

  const handleOk = () => {
    const chooseService: any[] = []
    if (isAddService) {
      services.forEach((service) => {
        if (service.quantity > 0) {
          chooseService.push(service)
        }
      })
    } else {
      chooseService.push(selectedRoom)
    }
    console.log(chooseService)

    onSubmit(chooseService)
    setIsOpen(false)
    setServices([])
    setRooms([])
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleQuantityChange = (id: number, change: number) => {
    setServices((prevServices) =>
      prevServices.map((service) => {
        if (service.id === id) {
          const newQuantity = Math.max(0, service.quantity + change)
          return {
            ...service,
            quantity: newQuantity,
            total: newQuantity * service.price
          }
        }
        return service
      })
    )
  }

  return (
    <>
      <Modal
        centered
        title={<h2 className='text-title-sm'> {isAddService ? 'Thêm dịch vụ' : 'Chọn phòng'} </h2>}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width='90%'
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
          <div className='flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-start'>
            {isAddService
              ? services.map((service) => (
                  <div
                    key={service.id}
                    className='flex flex-col h-70 md:h-48 items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] hover:bg-gray-100'
                  >
                    <div className='w-full h-36 md:w-48 md:h-full'>
                      <Image
                        className='rounded-t-lg md:rounded-none md:rounded-s-lg'
                        src={service.imageUrl}
                        alt=''
                        width='100%'
                        height='100%'
                        preview={true}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </div>
                    <div className='flex flex-col justify-between p-4 leading-normal flex-1'>
                      <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-1'>
                        {service.name}
                      </h5>
                      <p className='mb-3 font-normal text-gray-700 text-sm line-clamp-2'>{service.description}</p>
                      <div className='flex gap-1.5 justify-center md:justify-start'>
                        <Button
                          type='primary'
                          shape='circle'
                          icon={<MinusOutlined />}
                          onClick={() => handleQuantityChange(service.id, -1)}
                        />
                        <span className='text-xl'>{service.quantity}</span>
                        <Button
                          type='primary'
                          shape='circle'
                          icon={<PlusOutlined />}
                          onClick={() => handleQuantityChange(service.id, 1)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              : rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`flex flex-col h-70 md:h-48 items-center border rounded-lg shadow-sm md:flex-row w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)] hover:bg-gray-100 cursor-pointer ${
                      selectedRoom?.id === room.id ? 'bg-green-200 border-green-500' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className='w-full h-36 md:w-48 md:h-full'>
                      <Image
                        className='rounded-t-lg md:rounded-none md:rounded-s-lg'
                        src={
                          room.type != null
                            ? room.roomImage
                            : 'https://decoxdesign.com/upload/images/hotel-caitilin-1952m2-phong-ngu-01-decox-design.jpg'
                        }
                        alt=''
                        width='100%'
                        height='100%'
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </div>
                    <div className='flex flex-col justify-between p-4 leading-normal flex-1'>
                      <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-1'>
                        {room.name} - {room.type == '0' ? 'Đơn' : 'Đôi'}
                      </h5>
                      <p className='mb-3 font-normal text-gray-700 text-sm line-clamp-2'>{room.description}</p>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </Modal>
    </>
  )
}

export default AddServiceOrRoom
