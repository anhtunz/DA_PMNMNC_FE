import { Button, Card, Form, Input, Modal, Select, Space } from "antd"
import React, { useEffect, useState } from "react"
import { NetworkManager } from "../../config/network_manager"
import TableComponent from "../../components/common/TableComponent"
import { toastService } from "../../services/toast/ToastService"

const GetAllRoomsPage: React.FC = () => {
    const [data, setData] = useState([])
    const [editingRoom, setEditingRoom] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const [roomTypeOptions, setRoomTypeOptions] = useState<{ value: string; label: string }[]>([])

    const fetchOptions = async () => {
        try {
            const response = await NetworkManager.instance.getDataFromServer('admin/rooms')
            if (response) {
                const uniqueTypes = [...new Set((response.data as { type: string }[]).map((room) => room.type))]
                setRoomTypeOptions(uniqueTypes.map((type: string) => ({
                    value: type,
                    label: type.charAt(0).toUpperCase() + type.slice(1),
                })))
            }
        } catch (error: any) {
            toastService.error(error.response?.data?.message || 'Có lỗi xảy ra')
        }
    };

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await NetworkManager.instance.getDataFromServer('admin/rooms')
            if (response) setData(response.data.data)
        } catch (error: any) {
            toastService.error(error.response?.data?.message || 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
        fetchOptions()
    }, []);

    const handleCreate = () => {
        setEditingRoom(null)
        form.resetFields()
        setIsModalOpen(true)
    };

    const handleEdit = (record: any) => {
        setEditingRoom(record)
        form.setFieldsValue(record)
        setIsModalOpen(true)
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const body = { ...values }
            if (editingRoom) {
                await NetworkManager.instance.updateDataInServer(`admin/rooms/${(editingRoom as any).id}`, body)
                toastService.success('Cập nhật phòng thành công')
            } else {
                await NetworkManager.instance.createDataInServer('admin/rooms/create', body)
                toastService.success('Tạo phòng thành công')
            }
            fetchData()
            setIsModalOpen(false)
        } catch (error: any) {
            toastService.error(error.response?.data?.message || 'Có lỗi xảy ra')
        }
    };

    const handleDelete = async (record: any) => {
        const modal = Modal.confirm({
            title: 'Xóa phòng',
            content: `Bạn có chắc chắn muốn xóa phòng '${record.name}' không?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { disabled: true },
            onCancel: () => modal.destroy(),
            onOk: async () => {
                try {
                    await NetworkManager.instance.deleteDataInServer(`admin/rooms/${record.id}`)
                    toastService.success('Xóa phòng thành công')
                    fetchData()
                } catch (error: any) {
                    toastService.error(error.response?.data?.message || 'Có lỗi xảy ra')
                }
            },
        })
        setTimeout(() => modal.update({ okButtonProps: { disabled: false } }), 1000)
    };

    const columns = [
        {
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            sorter: (a: any, b: any) => a.description.localeCompare(b.description),
        },
        {
            title: 'Loại phòng',
            dataIndex: 'type',
            key: 'type',
            sorter: (a: any, b: any) => a.type.localeCompare(b.type),
        },
        {
            title: 'Giá thuê',
            dataIndex: 'price',
            key: 'price',
            sorter: (a: any, b: any) => a.price - b.price,
            render: (text: any) => <span>{text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card title="Thông tin phòng" loading={loading}>
                <div className="flex justify-end mb-4">
                    <Button type="primary" onClick={handleCreate}>Thêm phòng</Button>
                </div>
                <TableComponent columns={columns} dataSource={data} pageSizeCustom={5} />
            </Card>

            <Modal
                title={editingRoom ? 'Cập nhật phòng' : 'Tạo phòng'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                cancelText="Hủy"
                okText="Cập nhật"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên phòng"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên phòng!' },
                            { pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/, message: "Không được chứa ký tự đặc biệt!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên phòng" className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mô tả!' },
                            { pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/, message: "Không được chứa ký tự đặc biệt!" },
                            { max: 100, message: 'Mô tả không được quá 100 ký tự!' },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả" rows={4} showCount maxLength={100} className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại phòng"
                        rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                    >
                        <Select placeholder="Select room type" style={{ width: 200 }} allowClear>
                            {roomTypeOptions.map((option, index) => (
                                <Select.Option key={index} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Giá thuê"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá thuê!' },
                            { type: 'number', min: 0, message: 'Giá thuê phải lớn hơn hoặc bằng 0!' },
                            { pattern: /^[0-9]*$/, message: "Giá thuê không được chứa ký tự đặc biệt!" },
                        ]}
                    >
                        <Input placeholder="Nhập giá thuê" type="number" min={0} step={10000} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default GetAllRoomsPage