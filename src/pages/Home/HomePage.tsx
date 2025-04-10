import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {
  const navigate = useNavigate()
  const handleButtonClick = () => {
    navigate('/test')
  }
  return (
    <div>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-gray-'></div>
        <h1 className='text-5xl font-bold text-blue-600 mb-6'>This is HomePage</h1>
        <Button type='primary' onClick={handleButtonClick} danger>
          Go to test Page
        </Button>
      </div>
    </div>
  )
}

export default HomePage
