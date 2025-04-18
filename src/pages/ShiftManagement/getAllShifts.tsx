import React, { useEffect, useState } from "react" 
import { Button, Card, Input, Modal, Space, TimePicker, Form, message } from "antd" 
import { NetworkManager } from "../../config/network_manager" 
import TableComponent from "../../components/common/TableComponent" 
import StatusCodeConstants from "../../constant/StatusCodeConstants" 
import dayjs from 'dayjs' 
import TextArea from "antd/es/input/TextArea"


const GetAllShiftsPage: React.FC = () => {
  const [data, setData] = useState([])
  const [editingShift, setEditingShift] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    setIsModalOpen(false)
    try {
        // Gọi API Get All
        const response = await NetworkManager.instance.getDataFromServer('admin/shifts')
        if (!response) {
            console.error('Response is undefined')
            return
        }
        if (response.status === StatusCodeConstants.OK) {
            setData(response.data.data)
        }
        console.log(response)
        
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = async (record: any) => {
    setEditingShift(record)
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      time_start: dayjs(record.time_start, 'HH:mm:ss').isValid() ? dayjs(record.time_start, 'HH:mm:ss') : null,
      time_end: dayjs(record.time_end, 'HH:mm:ss').isValid() ? dayjs(record.time_end, 'HH:mm:ss') : null,
    })
    setIsModalOpen(true)
  } 

  const handleUpdate = async() => {
    try {
      const values = await form.validateFields() 
      const payload = {
        ...values,
        time_start: values.time_start.format('HH:mm:ss'),
        time_end: values.time_end.format('HH:mm:ss'),
      } 
      // Gọi API Update
      if (!editingShift) {
        console.error('Editing shift is undefined')
        return
      }
      const response = await NetworkManager.instance.updateDataInServer(`admin/shifts/${(editingShift as any).id}`,payload)
      
      if (!response) {
        console.error('Response is undefined')
        return
      }
      if (response === StatusCodeConstants.OK) /* Nếu response trả về HTTP 200 */ {
        message.success('Cập nhật ca làm thành công')
        setIsModalOpen(false) // Đóng modal
        fetchData() // Làm mới danh sách
      } else {
        message.error('Cập nhật ca làm thất bại')
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = (record: any) => {
    let timeoutId: NodeJS.Timeout;
  
    const modal = Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa ca làm "${record.name}" không?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: {
        disabled: true, // bắt đầu disabled
      },
      onOk: async () => {
        try {
          const response = await NetworkManager.instance.deleteDataInServer(`admin/shifts/${record.id}`);
          if (!response) {
            console.error('Response is undefined')
            return
          }
          if (response !== StatusCodeConstants.OK) {
            message.error('Lỗi khi xóa ca làm')
            return
          }
          message.success('Xóa thành công');
          fetchData(); // làm mới danh sách
        } catch (err) {
          message.error('Xóa thất bại' + err);
        }
      },
      onCancel: () => clearTimeout(timeoutId),
    });

    timeoutId = setTimeout(() => {
      modal.update({
        okButtonProps: { disabled: false }
      });
    }, 2000); // 2 giây sau mới cho phép nhấn nút Xóa
  }
  
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
    },
    {
      title: "Bắt đầu",
      dataIndex: "time_start",
      key: "time_start",
      sorter: (a: any, b: any) => a.time_start.localeCompare(b.time_start),
    },
    {
      title: "Kết thúc",
      dataIndex: "time_end",
      key: "time_end",
      sorter: (a: any, b: any) => a.time_end.localeCompare(b.time_end),
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
    <Card title="Thông tin các ca làm" loading={loading}>
      <TableComponent columns={columns} dataSource={data} pageSizeCustom={5} />
    </Card>
    
      <Modal
        title="Chỉnh sửa ca làm"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
        cancelText="Hủy"
        okText="Cập nhật"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
          name="name" 
          label={<span className="font-medium text-gray-700">Tên ca làm</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên!" },
                  {
                    pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/,
                    message: "Không được chứa ký tự đặc biệt!",
                  },
                ]}
          >
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item 
          name="description" 
          label={<span className="font-medium text-gray-700">Mô tả</span>}
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" },
                  {
                    pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/,
                    message: "Không được chứa ký tự đặc biệt!",
                  },
                  { max: 100, message: "Mô tả không được quá 100 ký tự!" }
                ]}
          >
            <TextArea
              placeholder="Nhập mô tả"
              maxLength={100}
              showCount
              rows={4}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            shouldUpdate
            noStyle
          >
          
          <div className="flex flex-col md:flex-row gap-4">
            <Form.Item
                label={<span className="font-medium text-gray-700">Thời gian bắt đầu</span>}
                name="time_start"
                dependencies={['time_end']}
                className="w-full md:w-1/2"
                rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const end = getFieldValue('time_end');
                      if (!end || !value) return Promise.resolve();
                      if (end.isAfter(value)) return Promise.resolve();
                      return Promise.reject('Thời gian bắt đầu phải trước thời gian kết thúc');
                    }
                  })
                ]}
            >
                <TimePicker format="HH:mm:ss" className="w-full rounded-lg" />
            </Form.Item>
          
            <Form.Item
                label={<span className="font-medium text-gray-700">Thời gian kết thúc</span>}
                name="time_end"
                dependencies={['time_start']}
                className="w-full md:w-1/2"
                rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue('time_start');
                      if (!start || !value) return Promise.resolve();
                      if (start.isBefore(value)) return Promise.resolve();
                      return Promise.reject('Thời gian kết thúc phải sau thời gian bắt đầu');
                    }
                  })
                ]}
            >
                <TimePicker format="HH:mm:ss" className="w-full rounded-lg" />
            </Form.Item>
            </div>
            
          </Form.Item>
        </Form>
      </Modal>
  </>
  ) 
} 

export default GetAllShiftsPage 