import { NetworkManager } from '../../config/network_manager';
import APIPathConstants from '../../constant/ApiPathConstants';

export const getAllCategories = async () => {
  return await NetworkManager.instance.getDataFromServer(APIPathConstants.CATEGORY_LIST);
};

export const createCategory = async (payload: { name: string; description: string }) => {
  return await NetworkManager.instance.createDataInServer(APIPathConstants.ADMIN_CREATE_CATEGORY, payload);
};

export const updateCategory = async (categoryId: string, payload: { name: string; description: string }) => {
  return await NetworkManager.instance.updateDataInServer(
    `${APIPathConstants.ADMIN_UPDATE_CATEGORY}/${categoryId}`,
    payload
  );
};

export const deleteCategory = async (categoryId: string) => {
  return await NetworkManager.instance.deleteDataInServer(
    `${APIPathConstants.ADMIN_DELETE_CATEGORY}/${categoryId}`
  );
};
