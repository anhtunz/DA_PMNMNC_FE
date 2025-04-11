import { Bounce, toast, ToastOptions, TypeOptions } from 'react-toastify'

const baseOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Bounce,
}

const showToast = (msg: string, type: TypeOptions = 'default') => {
  toast(msg, { ...baseOptions, type })
}

export const ToastDefault = (msg: string) => showToast(msg, 'default')
export const ToastSuccess = (msg: string) => showToast(msg, 'success')
export const ToastError = (msg: string) => showToast(msg, 'error')
export const ToastWarning = (msg: string) => showToast(msg, 'warning')
export const ToastInfo = (msg: string) => showToast(msg, 'info')
