import { NetworkManager } from "../../config/network_manager"
import APIPathConstants from "../../constant/ApiPathConstants"

export const getAllUser = async () => {
  try {
    const reponse = await NetworkManager.instance.getDataFromServer(APIPathConstants.ADMIN_GET_ALL_USERS)
    return reponse.data
  } catch (error) {
    throw error
  }
}