import { NetworkManager } from '../../config/network_manager'
import APIPathConstants from '../../constant/ApiPathConstants'

const getUserShiftHistory = (startDate: string | null, endDate: string | null) => {
  const data = {
    startDate,
    endDate
  }
  try {
    const response = NetworkManager.instance.createDataInServer(APIPathConstants.GET_USER_SHIFT_HISTORY, data)
    return response
  } catch (error) {
    console.log(error)
  }
}
export default getUserShiftHistory
