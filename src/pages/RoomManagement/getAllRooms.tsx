import { Button, Card, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Tag, Image } from "antd"
import React, { useEffect, useState } from "react"
import { NetworkManager } from "../../config/network_manager"
import { toastService } from "../../services/toast/ToastService"
import TableComponent from "../../components/common/TableComponent";
// import TableComponent from '../../components/common/TableComponent';
// import axios from "axios"

// const url = "http://127.0.0.1:8000/api/room-management/get-all"

interface Room {
    id?: string;
    name: string;
    description: string;
    type: string;
    price: number;
    isActive: boolean;
    url: string;
}

const GetAllRoomsPage: React.FC = () => {
    const [data, setData] = useState<Room[]>([])
    const [nameSearch, setNameSearch] = useState('')
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const fetchData = async (search = '') => {
        setIsModalOpen(false)
        setLoading(true)
        try {
            const response = await NetworkManager.instance.createDataInServer('/room-management/get-all', {nameSearch: search})
            if (response) setData(response.data.data)
        } catch (error: any) {
            toastService.error(error.data?.message || 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
    }, []);

    const handleSearch = () => {
        fetchData(nameSearch.trim())
    }

    const handleCreate = () => {
        setEditingRoom(null)
        form.resetFields()
        form.setFieldsValue({
            isActive: false
        })
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
            const body = {
                ...values,
                id: editingRoom ? editingRoom?.id : null,
            };
            const response = await NetworkManager.instance.createDataInServer('/room-management/create-or-update-room', body)
            if (!response) {
                console.error('Response is undefined')
                return
            }

            console.log(response);
            
            toastService.success(editingRoom ? 'Cập nhật phòng thành công' : 'Tạo phòng thành công')
            setIsModalOpen(false)
            fetchData()
        } catch (error: any) {
            toastService.error(error.data?.message || 'Có lỗi xảy ra')
            console.error(error)
        }
    };

    // const handleDelete = async (record: any) => {
    //     const modal = Modal.confirm({
    //         title: 'Xóa phòng',
    //         content: `Bạn có chắc chắn muốn xóa phòng '${record.name}' không?`,
    //         okText: 'Xóa',
    //         cancelText: 'Hủy',
    //         okButtonProps: { disabled: true },
    //         onCancel: () => modal.destroy(),
    //         onOk: async () => {
    //             try {
    //                 await NetworkManager.instance.deleteDataInServer(`admin/rooms/${record.id}`)
    //                 toastService.success('Xóa phòng thành công')
    //                 fetchData()
    //             } catch (error: any) {
    //                 toastService.error(error.data?.message || 'Có lỗi xảy ra')
    //             }
    //         },
    //     })
    //     setTimeout(() => modal.update({ okButtonProps: { disabled: false } }), 1000)
    // };

    const columns = [
        {
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
            defaultSortOrder: 'ascend' as const,
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'url',
            key: 'url',
            render: (text: any) => (
                <img src={text} alt="Room" style={{ width: '75px', height: '75px', borderRadius: '8px' }} />
            ),
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
            render : (text: any) => (
                <span style={{ color: text === '0' ? 'blue' : 'orange' }}>
                    {text === '0' ? 'Phòng đơn' : 'Phòng đôi'}
                </span>
            ),
            filters: [
                { text: 'Phòng đơn', value: '0' },
                { text: 'Phòng đôi', value: '1' },
            ],
            onFilter: (value: any, record: any) => record.type.toString() === value,
        },
        {
            title: 'Giá phòng (VND)',
            dataIndex: 'price',
            key: 'price',
            sorter: (a: any, b: any) => a.price - b.price,
            render: (text: any) => <span>{text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag 
                    color={isActive ? 'darkred' : 'lightgreen'}
                    style={{ color: isActive ? 'white' : 'brown', fontWeight: 'bold' }}
                    className="rounded-lg"
                >
                  {isActive ? 'Đã đặt' : 'Có sẵn'}
                </Tag>
            ),
            filters: [
                { text: 'Có sẵn', value: 'false' },
                { text: 'Đã đặt', value: 'true' },
            ],
            onFilter: (value: any, record: any) => record.isActive.toString() === value,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="large">
                    <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
                    {/* <Button type="link" danger onClick={() => handleDelete(record)}>Xóa</Button> */}
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card title="Thông tin phòng" loading={loading} extra={
                <div className="flex justify-end mb-4 mt-4">
                    <Button type="primary" onClick={handleCreate}>Thêm phòng</Button>
                </div>
            }>
                <div>
                <Space.Compact style={{ width: '50%', alignItems: 'center', marginBottom: '20px' }}>
                    <Input 
                        placeholder="Nhập tên phòng để tìm kiếm"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                    />
                    <Button type="primary" onClick={handleSearch}>Tìm</Button>
                    <Button onClick={() => { setNameSearch(''); fetchData(); }} className="rounded-lg">Đặt lại</Button>
                </Space.Compact>
                </div>
                {/* <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    loading={loading}
                /> */}
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
                        name="url"
                        label="Hình ảnh"
                        rules={[
                            { required: true, message: 'Vui lòng nhập đường dẫn hình ảnh!' },
                            { type: 'url', message: 'Đường dẫn không hợp lệ!' },
                            // {
                            //     validator: (_, value) => {
                            //         if (!value || value.match(/\.(jpeg|jpg|gif|png)$/)) {
                            //             return Promise.resolve();
                            //         }
                            //         return Promise.reject(new Error('URL phải là hình ảnh (jpeg, jpg, gif, png)'));
                            //     }
                            // }
                        ]}
                    >
                        <Input
                            placeholder="Nhập đường dẫn hình ảnh" 
                            // className="rounded-lg"
                        />
                        {form.getFieldValue('url') && (
                            <div style={{ marginTop: 16 }}>
                            <Image
                                width={200}
                                height={150}
                                src={form.getFieldValue('url')}
                                alt="Preview"
                                style={{ 
                                    objectFit: 'cover',
                                    borderRadius: 4,
                                    border: '1px solid #d9d9d9'
                                }}
                                placeholder={
                                    <div style={{ 
                                        width: 200, 
                                        height: 150, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        backgroundColor: '#f0f0f0'
                                    }}>
                                        Đang tải ảnh...
                                    </div>
                                }
                            />
                            </div>
                        )}
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
                        <Select placeholder="Chọn loại phòng" className="rounded-lg">
                            <Select.Option value={"0"}>Phòng đơn</Select.Option>
                            <Select.Option value={"1"}>Phòng đôi</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Giá phòng (VND)"
                        rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value: any)  => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
                            min={0}
                        />
                    </Form.Item>

                    {/* {!editingRoom && ( */}
                    <Form.Item
                        name="isActive"
                        label="Trạng thái"
                        valuePropName="checked"
                    >
                        <Checkbox>
                            Đã đặt
                        </Checkbox>
                    </Form.Item>
                    {/* )}*/}
                </Form>
            </Modal>
        </>
    );
};

export default GetAllRoomsPage