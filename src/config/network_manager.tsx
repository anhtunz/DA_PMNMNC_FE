import axios, { AxiosInstance } from 'axios'
import ApplicationConstants from '../constant/ApplicationConstant'
import cookieStorage from '../components/helpers/cookieHandler'

class NetworkManager {
  private static _instance: NetworkManager | null = null
  private axiosInstance: AxiosInstance

  private constructor() {
    const token = cookieStorage.getItem(ApplicationConstants.TOKEN)
    this.axiosInstance = axios.create({
      baseURL: `${ApplicationConstants.DOMAIN}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'false',
        'Access-Control-Allow-Headers':
          'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        ...(token && token !== '' ? { Authorization: `Bearer ${token}` } : {})
      }
    })
  }

  static get instance(): NetworkManager {
    if (!this._instance) {
      this._instance = new NetworkManager()
    }
    return this._instance
  }

  /**
   * Retrieves data from the server using a GET request.
   *
   * @param path The endpoint for the request
   * @returns The response body as a string if successful, or an empty string if the request fails
   */
  async getDataFromServer(path: string): Promise<any> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] GET url: ${ApplicationConstants.DOMAIN}/${path}`)
      const response = await this.axiosInstance.get(path, {
        validateStatus: (status) => status === 200
      })
      return response
    } catch (error: any) {
      return error.response
    }
  }

  /**
   * Sends a GET request to the server with the specified parameters.
   *
   * @param path The endpoint on the server
   * @param params A map containing query parameters for the request
   * @returns A string containing the server response body
   */
  async getDataFromServerWithParams(path: string, params: Record<string, any>): Promise<any> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] GET Params url: ${ApplicationConstants.DOMAIN}/${path}`)
      const response = await this.axiosInstance.get(path, {
        validateStatus: (status) => status === 200,
        params
      })
      return response
    } catch (error: any) {
      return error.response
    }
  }

  /**
   * Creates new data on the server using a POST request.
   *
   * @param path The endpoint for the request
   * @param body Contains the data to be sent
   * @returns The HTTP status code of the response
   */
  async createDataInServer(path: string, body: Record<string, any>): Promise<any> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] POST url: ${ApplicationConstants.DOMAIN}/${path}`)
      const response = await this.axiosInstance.post(path, body, {
        validateStatus: (status) => status === 200
      })
      return response
    } catch (error: any) {
      throw error.response
    }
  }

  async createFormDataInServer(path: string, body: FormData): Promise<any> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] POST url: ${ApplicationConstants.DOMAIN}/${path}`)

      const response = await this.axiosInstance.post(path, body, {
        validateStatus: (status) => status === 200,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return response
    } catch (error: any) {
      throw error.response
    }
  }
  /**
   * Updates existing data on the server using a PUT request.
   *
   * @param path The endpoint for the request
   * @param body Contains the data to be updated
   * @returns The HTTP status code of the response
   */
  async updateDataInServer(path: string, body: Record<string, any>): Promise<any> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] PUT url: ${ApplicationConstants.DOMAIN}/${path}`)
      const response = await this.axiosInstance.put(path, body, {
        validateStatus: (status) =>   status === 200
      })
      return response.status
    } catch (error: any) {
      throw error.response
      // return error.response
    }
  }

  /**
   * Deletes data from the server using a DELETE request.
   *
   * @param path The endpoint for the request
   * @returns The HTTP status code of the response
   */
  async deleteDataInServer(path: string): Promise<any> {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] DELETE url: ${ApplicationConstants.DOMAIN}/${path}`)
      const response = await this.axiosInstance.delete(path, {
        validateStatus: (status) => status === 200
      })
      return response.status
    } catch (error: any) {
      throw error.response
    }
  }
}
export { NetworkManager }
