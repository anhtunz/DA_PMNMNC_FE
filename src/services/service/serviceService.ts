import { NetworkManager } from '../../config/network_manager';
import APIPathConstants from '../../constant/ApiPathConstants';

export const getAllServices = async () => {
  return await NetworkManager.instance.getDataFromServer(APIPathConstants.SERVICE_LIST);
};

export const createOrUpdateService = async (payload: {
  id?: string;
  name: string;
  price: number;
  description: string;
  url: string;
  isActive: boolean;
}) => {
  return await NetworkManager.instance.createDataInServer(APIPathConstants.SERVICE_CREATE_OR_UPDATE, payload);
};
