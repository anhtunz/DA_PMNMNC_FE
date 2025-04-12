import { Button } from 'antd'
import { toastService } from '../../services/toast/ToastService'

const DashBoardPage = () => {
  const showSuccessToast = () => {
    toastService.success('Thao tác thành công!')
  }

  // Hiển thị toast error
  const showErrorToast = () => {
    toastService.error('Đã xảy ra lỗi!', {
      autoClose: 5000 // Ghi đè thời gian đóng mặc định
    })
  }

  // Hiển thị toast warning
  const showWarningToast = () => {
    toastService.warning('Cảnh báo: Dữ liệu chưa được lưu!')
  }

  // Hiển thị toast info
  const showInfoToast = () => {
    toastService.info('Thông tin: Bạn có thông báo mới.')
  }

  // Hiển thị toast tùy chỉnh
  const showCustomToast = () => {
    const id = toastService.default('Đang tải...', {
      autoClose: false, // Toast không tự đóng
      closeButton: false
    })

    // Cập nhật toast sau 3 giây
    setTimeout(() => {
      toastService.update(id, {
        render: 'Tải xong!',
        type: 'success',
        autoClose: 3000,
        closeButton: true
      })
    }, 3000)
  }


  return (
    <div className='toast-example'>
      <h2>React Toastify Examples</h2>
      <div className='buttons'>
        <Button onClick={showSuccessToast}>Success Toast</Button>
        <Button onClick={showErrorToast}>Error Toast</Button>
        <Button onClick={showWarningToast}>Warning Toast</Button>
        <Button onClick={showInfoToast}>Info Toast</Button>
        <Button onClick={showCustomToast}>Custom Toast</Button>
        <Button onClick={() => toastService.dismissAll()}>Close All</Button>
      </div>
    </div>
  )
}
export default DashBoardPage
