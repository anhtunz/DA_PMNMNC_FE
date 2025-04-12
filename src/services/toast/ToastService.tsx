import { toast, ToastOptions, UpdateOptions, Id, TypeOptions, Flip, Zoom, Bounce } from 'react-toastify'

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Toast notification position
 */
export enum ToastPosition {
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top-center',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_RIGHT = 'bottom-right'
}

export class ToastService {
  private static instance: ToastService

  // Default options cho toast
  private defaultOptions: ToastOptions = {
    position: ToastPosition.TOP_RIGHT,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Zoom
  }

  private constructor() {
    // Private constructor để thực hiện singleton pattern
  }

  /**
   * Lấy instance của ToastService (Singleton pattern)
   */
  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService()
    }
    return ToastService.instance
  }

  /**
   * Cập nhật default options
   */
  public setDefaultOptions(options: ToastOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options }
  }

  /**
   * Success toast
   */
  public success(message: string, options?: ToastOptions): Id {
    return toast.success(message, { ...this.defaultOptions, ...options })
  }

  /**
   * Error toast
   */
  public error(message: string, options?: ToastOptions): Id {
    return toast.error(message, { ...this.defaultOptions, ...options })
  }

  /**
   * Info toast
   */
  public info(message: string, options?: ToastOptions): Id {
    return toast.info(message, { ...this.defaultOptions, ...options })
  }

  /**
   * Warning toast
   */
  public warning(message: string, options?: ToastOptions): Id {
    return toast.warning(message, { ...this.defaultOptions, ...options })
  }

  /**
   * Default toast
   */
  public default(message: string, options?: ToastOptions): Id {
    return toast(message, { ...this.defaultOptions, ...options })
  }

  /**
   * Custom toast với type tùy chọn
   */
  public show(message: string, type: TypeOptions, options?: ToastOptions): Id {
    return toast(message, { ...this.defaultOptions, ...options, type })
  }

  /**
   * Update toast theo ID
   */
  public update(toastId: Id, options: UpdateOptions): void {
    toast.update(toastId, options)
  }

  /**
   * Đóng toast theo ID
   */
  public dismiss(toastId?: Id): void {
    toast.dismiss(toastId)
  }

  /**
   * Đóng tất cả toast
   */
  public dismissAll(): void {
    toast.dismiss()
  }

  /**
   * Kiểm tra toast có đang hiển thị không
   */
  public isActive(toastId: Id): boolean {
    return toast.isActive(toastId)
  }
}

// Export singleton instance
export const toastService = ToastService.getInstance()
