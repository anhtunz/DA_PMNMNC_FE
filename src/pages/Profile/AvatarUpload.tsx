import React, { useState } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../stores'
import { updateAvatar } from '../../services/userProfile/userProfile'
import { updateAvatarSuccess } from '../../stores/slice/user/userProfileSlice'
import { UserOutlined } from '@ant-design/icons';


const AvatarUpload: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const profile = useSelector((state: RootState) => state.profile)
    const [messageApi, contextHolder] = message.useMessage()
    // const [imageUrl, setImageUrl] = useState<string | null>(null) //+
    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
            messageApi.error('Bạn chỉ có thể tải lên các tệp hình ảnh!')
        }

        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            messageApi.error('Hình ảnh phải nhỏ hơn 2MB!')
        }

        // Return false to stop antd's default upload behavior
        return false
    }

    const handleChange = async (info: UploadChangeParam<UploadFile>) => {
        if (info.file) {
            setLoading(true)

            try {
                const response = await updateAvatar(info.file as RcFile)

                if (response && response.data && response.data.data) {
                    // If the backend returns the new avatar URL
                    const newAvatarUrl = response.data.data.avatarUrl
                    dispatch(updateAvatarSuccess(newAvatarUrl))
                    messageApi.success('Cập nhật ảnh đại diện thành công')
                } else {
                    messageApi.error('Không thể cập nhật ảnh đại diện')
                }
            } catch (error) {
                messageApi.error('Đã xảy ra lỗi khi tải lên ảnh đại diện')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div>
            {contextHolder}

            <div className="mb-6">
                <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 bg-gray-100">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt="Ảnh đại diện hiện tại"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserOutlined style={{ fontSize: '64px', color: '#999' }} />
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center mb-4">
                <p className="text-sm text-gray-500">
                    Định dạng được hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 2MB
                </p>
            </div>

            <div className="flex justify-center">
                <Upload
                    name="avatar"
                    listType="picture"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={({ onSuccess }) => {
                        // Prevent default upload behavior
                        setTimeout(() => {
                            onSuccess && onSuccess('ok')
                        }, 0)
                    }}
                >
                    <Button
                        icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
                        loading={loading}
                        type="primary"
                        className="bg-blue-500"
                    >
                        Cập nhật ảnh đại diện
                    </Button>
                </Upload>
            </div>
        </div>


    )
}

export default AvatarUpload