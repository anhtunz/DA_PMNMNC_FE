import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const TestPage = () => {
  const navigate = useNavigate()
  const handleButtonClick = () => {
    navigate('/')
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-5xl font-bold text-blue-600 mb-6'>This is TestPage</h1>
      <Button type='default' onClick={handleButtonClick} danger>
        Go to Home Page
      </Button>
    </div>
  )
}

export default TestPage
