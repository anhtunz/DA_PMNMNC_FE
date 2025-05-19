import React, { useEffect, useState } from 'react'
import APIPathConstants from '../../../constant/ApiPathConstants'
import { NetworkManager } from '../../../config/network_manager'
import { toastService } from '../../../services/toast/ToastService'
import { Button, Modal, Skeleton, Image, Radio } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'

type Service = {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
  quantity: number
  total: number
}

type UpdateServicesProps = {
  invoiceId: any
  initialServices: any
  isOpen: boolean
  setIsOpen: any
}

const UpdateServices: React.FC<UpdateServicesProps> = ({ invoiceId, initialServices, isOpen, setIsOpen }) => {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_ALL_SERVICE_STAFF)

      const services: Service[] = response.data.data.map((item: any) => {
        const matchedInitial = initialServices.find((initialItem: any) => initialItem.fnb_id === item.id)

        const quantity = matchedInitial ? matchedInitial.quantity : 0
        const total = quantity * item.price

        return {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.url,
          quantity,
          total
        }
      })

      console.log(services)
      setServices(services)

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

  const handleOk = async () => {
    try {
      const selectedServices = services.filter((service) => service.quantity > 0)
      const servicesUpdate = selectedServices.map((service: any) => ({
        serviceId: service.id,
        quantity: service.quantity
      }))
      const body = {
        invoiceId: invoiceId,
        services: servicesUpdate
      }
      console.log('Seleected ', selectedServices)
      console.log('InvoiceID ', invoiceId)
      console.log('Body: ', body)

      const response = await NetworkManager.instance.createDataInServer(APIPathConstants.UPDATE_SERVICES_INVOICE, body)
      toastService.success('Thêm dịch vụ thành công')
      console.log(response)
      setIsOpen(false)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.warning('Thêm dịch vụ thất bại')
      toastService.error(err)
      setIsOpen(false)
    }
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
        title={<h2 className='text-title-sm'> Thêm dịch vụ </h2>}
        open={isOpen}
        okText='Xác nhận'
        cancelText='Hủy'
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
            {services.map((service) => (
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
                  <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900 line-clamp-1'>{service.name}</h5>
                  <p className='mb-3 font-normal text-gray-700 text-sm line-clamp-2'>{service.description}</p>
                  <div className='flex gap-1.5 justify-center md:justify-start'>
                    <Radio.Group onChange={(e) => console.log(e.target.value)}>
                      <Radio.Button value='minus' onClick={() => handleQuantityChange(service.id, -1)}>
                        <MinusOutlined />
                      </Radio.Button>
                      <Radio.Button disabled value='quanntity'>
                        <span className='!text-base !font-medium'>{service.quantity}</span>
                      </Radio.Button>
                      <Radio.Button value='plus' onClick={() => handleQuantityChange(service.id, 1)}>
                        <PlusOutlined />
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}

export default UpdateServices
