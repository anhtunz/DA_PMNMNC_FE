import axios, { AxiosRequestConfig } from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  timeout: 5000,
  withCredentials: true
})
const handleAxiosError = (error: unknown) => {
  return {
    data: null,
    status: axios.isAxiosError(error) ? error.response?.status : 500,
    errors: axios.isAxiosError(error) ? error.response?.data : String(error)
  }
}

export const createAbortController = () => new AbortController()
export const get = async (path: string, option?: AxiosRequestConfig, controller?: AbortController) => {
  try {
    await request.get('/sanctum/csrf-cookie')
    const response = await request.get(path, {
      ...option,
      signal: controller?.signal
    })
    return response.data
  } catch (error) {
    return handleAxiosError(error)
  }
}
export const post = async (path: string, data: object, option?: AxiosRequestConfig, controller?: AbortController) => {
  try {
    const response = await request.post(path, data, {
      ...option,
      signal: controller?.signal
    })
    return {
      data: response.data,
      status: response.status
    }
  } catch (error) {
    return handleAxiosError(error)
  }
}
export const put = async (path: string, data: object, option?: AxiosRequestConfig, controller?: AbortController) => {
  try {
    const response = await request.put(path, data, {
      ...option,
      signal: controller?.signal
    })
    return {
      status: response.status,
      data: response.data
    }
  } catch (error) {
    return handleAxiosError(error)
  }
}
export const del = async (path: string, option?: AxiosRequestConfig, controller?: AbortController) => {
  try {
    const response = await request.delete(path, {
      ...option,
      signal: controller?.signal
    })
    return {
      status: response.status,
      data: response.data
    }
  } catch (error) {
    return handleAxiosError(error)
  }
}
