import React, { useState } from "react";
import { Form, Input, TimePicker, FormProps, Button, message } from 'antd';
import dayjs, { Dayjs } from "dayjs";
import { NetworkManager } from "../../config/network_manager";
import StatusCodeConstants from "../../constant/StatusCodeConstants";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

type FieldType = {
    name?: string;
    description?: string;
    time_start?: Dayjs;
    time_end?: Dayjs;
}

const AddShiftPage: React.FC = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
       
        if (values.time_start?.isAfter(values.time_end)) {
            message.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc", 2)
            return;
        }

        const start = values.time_start?.format('HH:mm:ss') ?? '';
        const end = values.time_end?.format('HH:mm:ss') ?? '';

        if (values.name && values.description && values.time_start && values.time_end) {
            callApi({
                name: values.name,
                description: values.description,
                time_start: start,
                time_end: end
            })
        }   
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // handle call api
    const callApi = async (values: {
            name: string;
            description: string;
            time_start: string;
            time_end: string
        }) => {
        
        try {
            setLoading(true); //Dang mac dinh la false
            const response = await NetworkManager.instance.createDataInServer('admin/shifts/create', values)
            if (!response) {
                console.error('Response is undefined')
                return
            }
            
            if (response.status === StatusCodeConstants.OK) {
                navigate('/list-of-shifts')
            } else {
                message.error(response?.data?.message, 2)
            }
            setLoading(false);

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Thêm ca làm</h2>

            <Form
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    time_start: dayjs().startOf("day"),
                    time_end: dayjs().startOf("day"),
                }}
            >
                <Form.Item
                    label={<span className="font-medium text-gray-700">Tên</span>}
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" },
                            {
                                pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/,
                                message: "Không được chứa ký tự đặc biệt!",
                            },
                        ]}
                >
                    <Input placeholder="Nhập tên" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium text-gray-700">Mô tả</span>}
                    name="description"
                    rules={[
                        { required: true, message: "Vui lòng nhập mô tả!" },
                        { max: 100, message: "Mô tả không được quá 100 ký tự!" },
                        {
                            pattern: /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/,
                            message: "Không được chứa ký tự đặc biệt!",
                        },
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

                <div className="flex flex-col md:flex-row gap-4">
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Thời gian bắt đầu</span>}
                        name="time_start"
                        className="w-full md:w-1/2"
                        rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu!" }]}
                    >
                        <TimePicker format="HH:mm:ss" className="w-full rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-medium text-gray-700">Thời gian kết thúc</span>}
                        name="time_end"
                        className="w-full md:w-1/2"
                        rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc!" }]}
                    >
                        <TimePicker format="HH:mm:ss" className="w-full rounded-lg" />
                    </Form.Item>
                </div>
                
                <Form.Item>
                    <Button
                            type="primary"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            htmlType="submit"
                            loading={loading}   
                    >
                        Gửi
                    </Button>
                </Form.Item>
                
            </Form>
        </div>
    )
}
export default AddShiftPage