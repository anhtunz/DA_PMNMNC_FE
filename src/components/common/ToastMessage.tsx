import { Bounce, toast } from 'react-toastify';
interface ToastMessageProps {
  msg: string
  position: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
  type: 'info' | 'success' | 'warning' | 'error'
}
export default function ToastMessage({ msg, position, type }: ToastMessageProps) {
  toast(`${msg}`, {
    position: `${position}`,
    type: `${type}`,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    transition: Bounce,
    theme: "light",
  });
}
