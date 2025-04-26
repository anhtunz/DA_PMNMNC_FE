import { Button, Card, Form, Input, Modal, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { NetworkManager } from "../../config/network_manager" 
import TableComponent from "../../components/common/TableComponent";
import { toastService } from "../../services/toast/ToastService";

const GetAllRoomsPage: React.FC = () => {
    // This is a placeholder component for the "Get All Rooms" page.
    const [data, setData] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const fetchData = async () => {
        setLoading(true)
        setIsModalOpen(false)
        try {
            const response = await NetworkManager.instance.getDataFromServer('admin/rooms')
            if (!response) {
                console.error('Response is undefined')
                return
            }
            setData(response.data.data)
            setLoading(false)
        }
        catch (error: any) {
            toastService.error(error.response.data.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreate = () => {
        setEditingRoom(null) // không có phòng => tạo mới
        form.resetFields()    // reset form
        setIsModalOpen(true)  // mở modal
    }

    const handleEdit = async (record: any) => {
        setEditingRoom(record)
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            type: record.type,
            price: record.price,
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const body = {
                name: values.name,
                description: values.description,
                type: values.type,
                price: values.price,
            }
            if (editingRoom) {
                // Update existing room
                await NetworkManager.instance.updateDataInServer(`admin/rooms/${(editingRoom as any).id}`, body)
                toastService.success('Cập nhật phòng thành công')
                setEditingRoom(null)
            } else {
                // Create new room
                await NetworkManager.instance.createDataInServer('admin/rooms/create', body)
                toastService.success('Tạo phòng thành công')
            }
            fetchData()
            setIsModalOpen(false) 
        } catch (error: any) {
            toastService.error(error.response.data.message)
        }
    }

    const handleDelete = async (record: any) => {
        let timeoutId: NodeJS.Timeout;
        const modal = Modal.confirm({
            title: 'Xóa phòng',
            content: `Bạn có chắc chắn muốn xóa phòng '${record.name}' không?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { disabled: true },
            onOk: async () => {
                modal.update({ okButtonProps: { loading: true } })
                try {
                    const response = await NetworkManager.instance.deleteDataInServer(`admin/rooms/${record.id}`)
                    if (!response) {
                        console.error('Response is undefined')
                        return
                    }
                    toastService.success('Xóa phòng thành công')
                    fetchData()
                } catch (error: any) {
                    toastService.error(error.response.data.message)
                }
            },
            onCancel: () => clearTimeout(timeoutId),
        })

        timeoutId = setTimeout(() => {
            modal.update({
              okButtonProps: { disabled: false }
            })
          }, 1000) // 1 giây sau mới cho phép nhấn nút Xóa
    }
    

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
            render: (type: string) => {
                switch (type) {
                    case 'single':
                        return 'Phòng đơn'
                    case 'double':
                        return 'Phòng đôi'
                    case 'suite':
                        return 'Phòng suite'
                    default:
                        return type
                }
            },
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
        }
    ]

  return (
    <>
    <Card title="Thông tin phòng" loading={loading}>
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={handleCreate}>
          Thêm phòng
        </Button>
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
                rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' },
                        {
                            pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/,
                            message: "Không được chứa ký tự đặc biệt!",
                        },
                ]}
            >
                <Input placeholder="Nhập tên phòng" />
            </Form.Item>

            <Form.Item 
                name="description" 
                label="Mô tả" 
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' },
                        {
                            pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/,
                            message: "Không được chứa ký tự đặc biệt!",
                        },
                        { max: 100, message: 'Mô tả không được quá 100 ký tự!' }
                ]}
            >
                <Input.TextArea placeholder="Nhập mô tả" rows={4} />
            </Form.Item>

            <Form.Item 
                name="type" 
                label="Loại phòng" 
                rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' },
                        {
                            pattern: /^(single|double|suite)$/,
                            message: "Loại phòng không hợp lệ!",
                        },
                ]}
            >
                <Select placeholder="Chọn loại phòng">
                    <Select.Option value="single">Phòng đơn</Select.Option>
                    <Select.Option value="double">Phòng đôi</Select.Option>
                    <Select.Option value="suite">Phòng suite</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item 
                name="price" 
                label="Giá thuê" 
                rules={[{ required: true, message: 'Vui lòng nhập giá thuê!' }]}
            >
                <Input placeholder="Nhập giá thuê" type="number" min={0} step={0.01} />
            </Form.Item>
        </Form>
    </Modal>
    </>
  )
}

export default GetAllRoomsPage