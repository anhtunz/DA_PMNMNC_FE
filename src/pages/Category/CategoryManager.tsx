import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/category/categoryService';

interface Category {
    id: string;
    name: string;
    description: string;
}

interface CategoryFormData {
    name: string;
    description: string;
}

const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: ''
    });
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCategories();
            const categoriesArray = response?.data?.data || [];
            setCategories(categoriesArray);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = () => {
        setFormData({ name: '', description: '' });
        setEditingCategoryId(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setFormData({
            name: category.name,
            description: category.description
        });
        setEditingCategoryId(category.id);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                setIsLoading(true);
                await deleteCategory(categoryId);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            setIsLoading(true);
            if (editingCategoryId) {
                await updateCategory(editingCategoryId, formData);
            } else {
                await createCategory(formData);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
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
                <h1 className="text-4xl font-bold">Quản lý danh mục</h1>
                <button
                    onClick={handleAddCategory}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
                >
                    <span className="mr-1 text-2xl">+</span> Thêm danh mục
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-900">STT</th>
                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-900">Tên danh mục</th>
                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-900">Mô tả</th>
                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-900">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 text-lg text-gray-900">{category.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditCategory(category)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-lg text-gray-500">
                                    {isLoading ? 'Đang tải...' : 'Không có danh mục nào'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md p-6 z-10 relative shadow-2xl transform scale-105"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                {editingCategoryId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                    Tên danh mục
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập tên danh mục"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mô tả danh mục"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
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

export default CategoryManager;
