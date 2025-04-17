// import React, { useState } from 'react'
// import { Upload, Button, message } from 'antd'
// import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
// import type { UploadChangeParam } from 'antd/es/upload'
// import type { RcFile, UploadFile } from 'antd/es/upload/interface'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '../../stores'
// import { updateAvatar } from '../../services/userProfile/userProfile'
// import { updateAvatarSuccess } from '../../stores/slice/user/userProfileSlice'
// import { UserOutlined } from '@ant-design/icons';



// const AvatarUpload: React.FC = () => {
//     const [loading, setLoading] = useState(false)
//     const dispatch = useDispatch()
//     const profile = useSelector((state: RootState) => state.profile)
//     const [messageApi, contextHolder] = message.useMessage()
//     // const [imageUrl, setImageUrl] = useState<string | null>(null) //+
//     const beforeUpload = (file: RcFile) => {
//         const isImage = file.type.startsWith('image/')
//         if (!isImage) {
//             messageApi.error('Bạn chỉ có thể tải lên các tệp hình ảnh!')
//         }

//         const isLt2M = file.size / 1024 / 1024 < 2
//         if (!isLt2M) {
//             messageApi.error('Hình ảnh phải nhỏ hơn 2MB!')
//         }

//         // Return false to stop antd's default upload behavior
//         return false
//     }

//     const handleChange = async (info: UploadChangeParam<UploadFile>) => {
//         if (info.file) {
//             setLoading(true)

//             try {
//                 const response = await updateAvatar(info.file as RcFile)

//                 if (response && response.data && response.data.data) {
//                     // If the backend returns the new avatar URL
//                     const newAvatarUrl = response.data.data.avatarUrl
//                     dispatch(updateAvatarSuccess(newAvatarUrl))
//                     messageApi.success('Cập nhật ảnh đại diện thành công')
//                 } else {
//                     messageApi.error('Không thể cập nhật ảnh đại diện')
//                 }
//             } catch (error) {
//                 messageApi.error('Đã xảy ra lỗi khi tải lên ảnh đại diện')
//             } finally {
//                 setLoading(false)
//             }
//         }
//     }

//     return (
//         <div>
//             {contextHolder}

//             <div className="mb-6">
//                 <div className="flex justify-center mb-4">
//                     <div className="w-32 h-32 flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 bg-gray-100">
//                         {profile.avatar ? (
//                             <img
//                                 src={profile.avatar}
//                                 alt="Ảnh đại diện hiện tại"
//                                 className="w-full h-full object-cover"
//                             />
//                         ) : (
//                             <UserOutlined style={{ fontSize: '64px', color: '#999' }} />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className="text-center mb-4">
//                 <p className="text-sm text-gray-500">
//                     Định dạng được hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 2MB
//                 </p>
//             </div>

//             <div className="flex justify-center">
//                 <Upload
//                     name="avatar"
//                     listType="picture"
//                     className="avatar-uploader"
//                     showUploadList={false}
//                     beforeUpload={beforeUpload}
//                     onChange={handleChange}
//                     customRequest={({ onSuccess }) => {
//                         // Prevent default upload behavior
//                         setTimeout(() => {
//                             onSuccess && onSuccess('ok')
//                         }, 0)
//                     }}
//                 >
//                     <Button
//                         icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
//                         loading={loading}
//                         type="primary"
//                         className="bg-blue-500"
//                     >
//                         Cập nhật ảnh đại diện
//                     </Button>
//                 </Upload>
//             </div>
//         </div>


//     )
// }

// export default AvatarUpload
// import React, { useState } from 'react'
// import { Button, message, Upload } from 'antd'
// import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
// import type { UploadChangeParam } from 'antd/es/upload'
// import type { RcFile, UploadFile } from 'antd/es/upload/interface'
// import useUserStore from '../../stores/userStore'
// import { NetworkManager } from '../../config/network_manager'
// import APIPathConstants from '../../constant/ApiPathConstants'

// const AvatarUpload: React.FC = () => {
//   const [loading, setLoading] = useState(false)
//   const [previewImage, setPreviewImage] = useState<string>('')
//   const [messageApi, contextHolder] = message.useMessage()
//   const { user, updateAvatar } = useUserStore()

//   const beforeUpload = (file: RcFile) => {
//     const isImage = file.type.startsWith('image/')
//     if (!isImage) {
//       messageApi.error('Bạn chỉ có thể tải lên các tệp hình ảnh!')
//     }

//     const isLt2M = file.size / 1024 / 1024 < 2
//     if (!isLt2M) {
//       messageApi.error('Hình ảnh phải nhỏ hơn 2MB!')
//     }

//     return isImage && isLt2M
//   }

//   const getBase64 = (img: RcFile, callback: (url: string) => void) => {
//     const reader = new FileReader()
//     reader.addEventListener('load', () => callback(reader.result as string))
//     reader.readAsDataURL(img)
//   }

//   const handleChange = async (info: UploadChangeParam<UploadFile>) => {
//     const file = info.file.originFileObj as RcFile
//     if (!file || !beforeUpload(file)) return

//     setLoading(true)

//     getBase64(file, (url) => {
//       setPreviewImage(url)
//     })

//     const formData = new FormData()
//     formData.append('image', file)
//     formData.append('uid', user?.id || '') // đảm bảo user có id

//     try {
//       const response = await NetworkManager.instance.createFormDataInServer(
//         APIPathConstants.UPDATE_AVATAR,
//         formData
//       )

//       if (response?.data?.data?.avatar) {
//         const newAvatarUrl = response.data.data.avatar
//         updateAvatar(newAvatarUrl)
//         messageApi.success('Cập nhật ảnh đại diện thành công!')
//       } else {
//         messageApi.error('Cập nhật ảnh thất bại!')
//       }
//     } catch (error) {
//       console.error('Lỗi cập nhật avatar:', error)
//       messageApi.error('Lỗi khi tải lên ảnh đại diện!')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const uploadButton = (
//     <div>
//       {loading ? <LoadingOutlined /> : <PlusOutlined />}
//       <div style={{ marginTop: 8 }}>Tải ảnh</div>
//     </div>
//   )

//   return (
//     <div className="text-center">
//       {contextHolder}
//       <div className="mb-4">
//         <Upload
//           name="avatar"
//           listType="picture-circle"
//           className="avatar-uploader"
//           showUploadList={false}
//           beforeUpload={beforeUpload}
//           onChange={handleChange}
//         >
//           {previewImage ? (
//             <img src={previewImage} alt="avatar" style={{ width: '100%' }} />
//           ) : user?.avatar ? (
//             <img src={user.avatar} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} />
//           ) : (
//             uploadButton
//           )}
//         </Upload>
//       </div>
//       <p className="text-sm text-gray-500">Chỉ chấp nhận ảnh JPG, PNG. Dung lượng ≤ 2MB</p>
//     </div>
//   )
// }

// export default AvatarUpload
import React, { useState, useRef } from 'react'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, message, Spin } from 'antd'
import useUserStore from '../../stores/userStore'
import { NetworkManager } from '../../config/network_manager'
import APIPathConstants from '../../constant/ApiPathConstants'

const AvatarUpload: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { user } = useUserStore()
  const [messageApi, contextHolder] = message.useMessage()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
      messageApi.error('Chỉ hỗ trợ tệp hình ảnh!')
      return
    }

    if (!isLt2M) {
      messageApi.error('Ảnh phải nhỏ hơn 2MB!')
      return
    }

    // Hiển thị ảnh preview trước
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('uid', user?.id || '')

    setLoading(true)
    try {
      const res = await NetworkManager.instance.createFormDataInServer(
        APIPathConstants.UPDATE_AVATAR,
        formData
      )

      console.log('Kết quả upload avatar:', res)


      messageApi.success('Cập nhật ảnh đại diện thành công!')
    } catch (err) {
      console.error('Lỗi khi tải ảnh:', err)
      messageApi.error('Lỗi khi tải ảnh!')
    } finally {
      setLoading(false)
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {contextHolder}

      {/* Avatar hiển thị */}
      <div className="relative">
        <div className="rounded-full border-2 border-blue-500 w-32 h-32 flex items-center justify-center overflow-hidden bg-white">
          {loading ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
          ) : (
            <img
              src={previewImage || user?.avatar || '/default-avatar.png'}
              alt="avatar"
              className="object-cover w-full h-full"
              onError={(e) => ((e.target as HTMLImageElement).src = '/default-avatar.png')}
            />
          )}
        </div>
      </div>

      {/* Mô tả định dạng */}
      <p className="text-sm text-gray-500 text-center max-w-xs">
        Định dạng được hỗ trợ: <strong>JPG, PNG, GIF</strong>. Kích thước tối đa: <strong>2MB</strong>
      </p>

      {/* Input file ẩn */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Nút tải ảnh riêng biệt */}
      <Button
        icon={<UploadOutlined />}
        type="primary"
        onClick={handleClickUpload}
        loading={loading}
      >
        Cập nhật ảnh đại diện
      </Button>
    </div>
  )
}

export default AvatarUpload
