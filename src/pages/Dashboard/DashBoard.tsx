import { useEffect, useState } from 'react'
import { Button, Image, Segmented, Skeleton, Tag } from 'antd'
import { NetworkManager } from '../../config/network_manager'
import APIPathConstants from '../../constant/ApiPathConstants'
import { toastService } from '../../services/toast/ToastService'
import UpdateRoom from './component/UpdateRoom'
import { CreditCardOutlined, PlusOutlined } from '@ant-design/icons'
import UpdateServices from './component/UpdateServices'
import { useTitle } from '../../hooks/useTitle'
import useUserStore from '../../stores/userStore'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement, Legend } from 'chart.js'
import LastMonthComparisonFigure from './component/LastMonthComparisonFigure'
import TopFiveServicesOrRoom from './component/TopFiveServicesOrRoom'
import BarChart from './component/BarChart'
import DoughnutChart from './component/Doughnut'
type Room = {
  id: string
  name: string
  description: string
  type: string
  price: number
  roomImage: string
  isAvailable: boolean
}

type LastMonthComparisonFigureData = {
  newClient: number
  oldClient: number
  newMoney: number
  oldMoney: number
  newOccupancyRate: number
  oldOccupancyRate: number
}

type TopFiveDatas = {
  id: string
  name: string
  usage_count: number
}

type MoneyByTime = {
  name: string
  money: number
}

type RoomUsingData = {
  totalRoom: number
  totalRoomUsing: number
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement, Legend)
const DashBoardPage = () => {
  const { user } = useUserStore()
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [topFiveRooms, setTopFiveRooms] = useState<TopFiveDatas[]>([])
  const [topFiveServices, setTopFiveServices] = useState<TopFiveDatas[]>([])
  const [lastMonthData, setLastMonthData] = useState<LastMonthComparisonFigureData>()
  const [roomUsingData, setRoomUsingData] = useState<RoomUsingData>()
  const [moneyByTime, setMoneyByTime] = useState<MoneyByTime[]>([])
  const [moneyByTimeType, setMoneyByTimeType] = useState<number>(0)

  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmPaymentlOpen, setIsConfirmPaymentlOpen] = useState(false)
  const [isUpdateServicesModalOpen, setIsUpdateServicesModalOpen] = useState(false)
  const [isServicesInRoom, setIsServicesInRoom] = useState([])
  const [isServicesInRoomInvoiceID, setIsServicesInRoomInvoiceID] = useState()
  const [selectedRoomID, setSelectedRoomID] = useState<string | null>(null)
  useTitle('Trang chủ')

  useEffect(() => {
    checkRole()
  }, [])

  const checkRole = () => {
    console.log('User: ', user)

    if (user != null) {
      if (user.roles.includes('SUPERADMIN')) {
        setIsSuperAdmin(true)
      } else {
        setIsSuperAdmin(false)
      }
    } else {
      checkRole()
    }
  }

  const sortDataByUsage = (datas: TopFiveDatas[]): TopFiveDatas[] => {
    return datas.sort((a, b) => b.usage_count - a.usage_count)
  }

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

  const fetchLastMonthData = async () => {
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_LAST_MONTH_DATA)
      const data: LastMonthComparisonFigureData = {
        newClient: response.data.data.newClient,
        oldClient: response.data.data.oldClient,
        newMoney: response.data.data.newMoney,
        oldMoney: response.data.data.oldMoney,
        newOccupancyRate: response.data.data.newOccupancyRate,
        oldOccupancyRate: response.data.data.oldOccupancyRate
      }
      console.log(data)
      setLastMonthData(data)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }

  const fetchTop5Rooms = async () => {
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_TOP_FIVE_ROOMS)
      const rooms: TopFiveDatas[] = response.data.data.map((item: TopFiveDatas) => ({
        id: item.id,
        name: item.name,
        usage_count: item.usage_count
      }))
      console.log(rooms)
      setTopFiveRooms(sortDataByUsage(rooms))
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }

  const fetchTop5Services = async () => {
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_TOP_FIVE_SERVICES)
      const services: TopFiveDatas[] = response.data.data.map((item: TopFiveDatas) => ({
        id: item.id,
        name: item.name,
        usage_count: item.usage_count
      }))
      console.log(services)
      setTopFiveServices(sortDataByUsage(services))
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }

  const fetchRoomUsing = async () => {
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_ROOMS_USING)
      const data: RoomUsingData = {
        totalRoom: response.data.data.totalRoom,
        totalRoomUsing: response.data.data.totalRoomUsing
      }
      console.log(data)
      setRoomUsingData(data)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }

  const fetchMoneyByTime = async ({ type }: { type: number }) => {
    setMoneyByTimeType(type)
    setMoneyByTime([])
    try {
      const response = await NetworkManager.instance.getDataFromServer(getPathByType(type))
      handleResponse(response, type)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      toastService.error(err)
    }
  }

  const getPathByType = (type: number): string => {
    if (type === 1) {
      return APIPathConstants.GET_MONEY_BY_WEEKS
    } else if (type === 2) {
      return APIPathConstants.GET_MONEY_BY_MONTHS
    } else {
      return APIPathConstants.GET_MONEY_BY_HOURS
    }
  }

  const handleResponse = (response: any, type: number) => {
    // console.log('nanana: ', response)

    let datas: MoneyByTime[] = []
    if (type === 1) {
      datas = response.data.data.map((item: any) => ({
        name: item.date,
        money: item.money
      }))
    } else if (type === 2) {
      datas = response.data.data.map((item: any) => ({
        name: item.day,
        money: item.money
      }))
    } else {
      datas = response.data.data.map((item: any) => ({
        name: item.hour,
        money: item.money
      }))
    }
    console.log('nanana: ', datas)

    setMoneyByTime(datas)
  }

  const fetchDataSuperAdmin = async () => {
    setIsLoading(true)
    await fetchLastMonthData()
    await fetchTop5Rooms()
    await fetchTop5Services()
    await fetchMoneyByTime({ type: 0 })
    await fetchRoomUsing()
    setIsLoading(false)
  }

  useEffect(() => {
    if (isSuperAdmin === true) {
      fetchDataSuperAdmin()
    } else if (isSuperAdmin === false) {
      fetchData()
    } else {
    }
  }, [isSuperAdmin])

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

  const getNameOfType = () => {
    if (moneyByTimeType == 1) {
      return 'tuần này'
    } else if (moneyByTimeType == 2) {
      return 'tháng này'
    } else {
      return 'hôm nay'
    }
  }

  return isLoading ? (
    <Skeleton />
  ) : isSuperAdmin ? (
    <div className='w-full'>
      {/* Số khách mới,số tiền thu được trong tháng này, số phòng được sử dụng */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4'>
        <LastMonthComparisonFigure
          title={'Thu nhập tháng này'}
          newQuantity={lastMonthData?.newMoney ?? 0}
          oldQuantity={lastMonthData?.oldMoney ?? 0}
          type={1}
        />
        <LastMonthComparisonFigure
          title={'Số khách mới'}
          newQuantity={lastMonthData?.newClient ?? 0}
          oldQuantity={lastMonthData?.oldClient ?? 0}
          type={0}
        />
        <LastMonthComparisonFigure
          title={'Tỉ lệ lấp đầy'}
          newQuantity={lastMonthData?.newOccupancyRate ?? 0}
          oldQuantity={lastMonthData?.oldOccupancyRate ?? 0}
          type={2}
        />
      </div>
      {/* Biểu đồ số tiền thu được trong năm tháng tuần ngày */}
      <div className={`bg-white rounded-xl p-4 shadow-sm m-4`}>
        {/* Header section */}
        <div className='flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0'>
          {/* Title and subtitle */}
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Thống kê</h2>
            <p className='text-sm text-gray-500'>Số tiền thu được trong {getNameOfType()}</p>
          </div>

          {/* Time period selector */}
          <div className='overflow-x-auto pb-2 sm:pb-0'>
            <Segmented
              size='large'
              options={[
                { label: 'Hôm nay', value: 0 },
                { label: 'Tuần này', value: 1 },
                { label: 'Tháng này', value: 2 }
              ]}
              onChange={(value) => {
                fetchMoneyByTime({ type: value })
                console.log(value) // string
              }}
            />
          </div>
        </div>

        {/* Chart container */}
        <div className='h-64 sm:h-72 md:h-80 mt-6'>
          {/* <Bar data={chartData} options={chartOptions} /> */}
          <BarChart
            labels={moneyByTime.map((item) => item.name)}
            values={moneyByTime.map((item) => item.money)}
            type={moneyByTimeType}
          />
        </div>
      </div>
      {/* Top 5 phòng, top 5 dịch vụ được sử dụng, chart số phòng đang được sử dụng */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4'>
        {/* Card Top 5 phòng sử dụng */}
        <TopFiveServicesOrRoom title={'Phòng sử dụng nhiều nhất'} name={'Phòng'} datas={topFiveRooms} />

        {/* Placeholder top 5 dịch vụ hay được sử dụng */}
        <TopFiveServicesOrRoom title={'Dịch vụ sử dụng nhiều nhất'} name={'Dịch vụ'} datas={topFiveServices} />

        {/* Chart số phòng đang được sử dụng */}
        <div className='rounded-xl bg-white shadow-sm flex flex-col items-center justify-between p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Tình trạng phòng hiện tại</h3>
          <DoughnutChart
            data={[
              { label: 'Đang trống', value: roomUsingData?.totalRoomUsing ?? 0, color: '#51f542' },
              {
                label: 'Đang được sử dụng',
                value: roomUsingData?.totalRoom! - roomUsingData?.totalRoomUsing!,
                color: '#c3d0d6'
              }
            ]}
          />
          <span></span>
        </div>
      </div>
    </div>
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
          setIsOpen={setIsUpdateServicesModalOpen}
          invoiceId={isServicesInRoomInvoiceID}
        />
      )}
    </div>
  )
}
export default DashBoardPage
