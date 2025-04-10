import { post } from '../../config/axios'
import { NetworkManager } from '../../config/network_manager'
import APIPathConstants from '../../constant/ApiPathConstants'

// Get user information
export const getUserInfo = async () => {
  try {
    const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.GET_USER_INFO)
    return response
  } catch (error) {
    console.error('Error getting user info:', error)
    return null
  }
}

// Update user information
export const updateUserInfo = async (data: {
  name: string
  gender: number
  address: string | null
  dateOfBirth: string | null
}) => {
  try {
    const response = await NetworkManager.instance.createDataInServer(
      APIPathConstants.UPDATE_USER_INFO,
      data
    )
    return response
  } catch (error) {
    console.error('Error updating user info:', error)
    return null
  }
}

// Update user avatar
export const updateAvatar = async (imageFile: File) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    const token = localStorage.getItem('auth_token') //+
    // Use regular axios config for file uploads
    const response = await post(APIPathConstants.UPDATE_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` //+
      }
    })
    console.log('Avatar upload response:', response)//+
    return response
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return null
  }
}

// Change password
export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  try {
    const response = await NetworkManager.instance.createDataInServer(
      APIPathConstants.CHANGE_PASSWORD,
      data
    )
    return response
  } catch (error) {
    console.error('Error changing password:', error)
    return null
  }
}
