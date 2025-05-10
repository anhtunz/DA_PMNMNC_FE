import { NetworkManager } from "../../config/network_manager";
import APIPathConstants from "../../constant/ApiPathConstants";

export const getAllRooms = async (payload: {searchName?:string}) => {
  return await NetworkManager.instance.createDataInServer(
    APIPathConstants.ADMIN_GET_ALL_ROOM,
    payload
  );
}

export const createOrUpdateRoom = async (payload: {
  id?: string;
  name: string;
  description: string;
  url: string;
  isActive: boolean;
}) => {
  return await NetworkManager.instance.createDataInServer(
    APIPathConstants.ADMIN_CREATE_OR_UPDATE_ROOM,
    payload
  );
}
