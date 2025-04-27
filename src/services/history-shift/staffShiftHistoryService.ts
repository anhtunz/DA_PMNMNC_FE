import { NetworkManager } from "../../config/network_manager"
import APIPathConstants from "../../constant/ApiPathConstants"

const getAllHistoryWorkshift = async (body: any) => {
  try {
    const response = await NetworkManager.instance.createDataInServer(APIPathConstants.GET_ALL_STAFF_SHIFT_HISTORY, body);
    return response.data.data
  } catch (error) {
    throw error
  }
}
export default getAllHistoryWorkshift;