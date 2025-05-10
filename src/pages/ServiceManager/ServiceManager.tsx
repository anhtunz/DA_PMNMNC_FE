import React, { useEffect, useState } from 'react';
import { getAllServices, createOrUpdateService } from '../../services/service/serviceService';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  url: string;
  isActive: boolean;
}

interface ServiceFormData {
  id?: string;
  name: string;
  price: number;
  description: string;
  url: string;
  isActive: boolean;
}

const ServiceManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    price: 0,
    description: '',
    url: '',
    isActive: true
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await getAllServices();
      const servicesArray = response?.data?.data || [];
      setServices(servicesArray);
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Không thể tải dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddService = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      url: '',
      isActive: true
    });
    setEditingServiceId(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setFormData({ ...service });
    setEditingServiceId(service.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editingServiceId
      ? { ...formData, id: editingServiceId }
      : formData;

    try {
      setIsLoading(true);
      await createOrUpdateService(payload);
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Không thể lưu dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Quản lý dịch vụ</h1>
        <button
          onClick={handleAddService}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          + Thêm dịch vụ
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">STT</th>
              <th className="px-6 py-3">Ảnh</th>
              <th className="px-6 py-3">Tên</th>
              <th className="px-6 py-3">Mô tả</th>
              <th className="px-6 py-3">Giá</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service, index) => (
                <tr key={service.id} className="text-center align-middle">
                  <td className="px-6 py-4">{index + 1}</td>

                  <td className="px-6 py-4">
                    <img
                      src={service.url || "data:image/png;base64,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"} // Replace with your fallback image URL
                      alt={service.name}
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  </td>

                  <td className="px-6 py-4">{service.name}</td>

                  <td className="px-6 py-4">{service.description}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.price.toLocaleString()} VND
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full animate-pulse ${service.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                      ></span>
                      <span>{service.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditService(service)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  {isLoading ? 'Đang tải...' : 'Không có dịch vụ nào'}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div
            className="bg-white rounded-lg w-full max-w-md p-6 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingServiceId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tên dịch vụ"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Giá"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="Link ảnh"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                />
                <span>Đang hoạt động</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
