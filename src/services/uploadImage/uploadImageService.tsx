import { NetworkManager } from "../../config/network_manager";
import APIPathConstants from "../../constant/ApiPathConstants";

export const uploadImage = async (payload: FormData) => {
  return await NetworkManager.instance.createDataInServer(
    APIPathConstants.UPLOAD_IMAGE,
    payload
  );
}