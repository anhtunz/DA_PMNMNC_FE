import {
  Avatar,
  Button,
  Dropdown,
  Form,
  GetProp,
  Image,
  Input,
  message,
  Modal,
  Space,
  Table,
  TableProps,
  Tag,
  Upload,
  UploadProps
} from 'antd'
import { useEffect, useState } from 'react'
import { NetworkManager } from '../../../config/network_manager'
import { toastService } from '../../../services/toast/ToastService'
import APIPathConstants from '../../../constant/ApiPathConstants'
import { EllipsisOutlined, LoadingOutlined, PlusOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import useUserStore from '../../../stores/userStore'
import { useTitle } from '../../../hooks/useTitle'

const UsersManager = () => {
  const [users, setUsers] = useState([])
  const [filterusers, setFilterUsers] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isSearchButtonLoading, setIsSearchButtonLoading] = useState(false)
  const [isCreateUSer, setIsCreateUser] = useState(false)
  const { user } = useUserStore()

  useEffect(() => {
    const checkRole = () => {
      if (user != null) {
        if (user.roles.includes('SUPERADMIN')) {
          setIsSuperAdmin(true)
        } else {
          setIsSuperAdmin(false)
        }
      }
    }
    checkRole()
  }, [user])

  const fetchUser = async () => {
    try {
      const response = await NetworkManager.instance.getDataFromServer(APIPathConstants.ADMIN_GET_ALL_USERS)
      console.log(response.data)

      setFilterUsers(response.data.data)
      setUsers(response.data.data)
      setIsTableLoading(false)
    } catch (err: any) {
      console.error('Error fetching user:', err)
      toastService.error(err)
    }
  }

  const searchUserWithParam = async ({ searchKey }: { searchKey: string }) => {
    setIsSearchButtonLoading(true)
    setIsTableLoading(true)
    const params = { search: searchKey }
    try {
      const response = await NetworkManager.instance.getDataFromServerWithParams(
        APIPathConstants.ADMIN_GET_ALL_USERS,
        params
      )
      setFilterUsers(response.data.data)
      setIsSearchButtonLoading(false)
      setIsTableLoading(false)
    } catch (err: any) {
      console.error('Error fetching user:', err)
      toastService.error(err)
      setIsSearchButtonLoading(true)
      setIsTableLoading(true)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])
  const getUserActive = () => {
    let check = 0
    for (const user in users) {
      if (!user.isBlock) {
        check = check + 1
      }
    }
    return check
  }

  interface DataType {
    id: string
    name: string
    email: string
    avatar: string
    isAdmin: boolean
    isBlock: boolean
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',

      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            height={50}
            width={50}
            src={
              record.avatar != null
                ? record.avatar
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s'
            }
            style={{
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <a className='ml-4 text-base'>{text}</a>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Vai trò',
      sorter: (a, b) => Number(a.isAdmin) - Number(b.isAdmin),
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (_, { isAdmin }) => (
        <>
          {isAdmin ? (
            <Tag style={{ borderRadius: 40 }} color='orange'>
              ADMIN
            </Tag>
          ) : (
            <Tag style={{ borderRadius: 40 }} color='blue'>
              USER
            </Tag>
          )}
        </>
      )
    },
    {
      title: 'Tình trạng',
      key: 'isBlock',
      dataIndex: 'isBlock',
      sorter: (a, b) => Number(a.isBlock) - Number(b.isBlock),
      render: (_, { isBlock }) => (
        <>
          {!isBlock ? (
            <Tag style={{ borderRadius: 40 }} color='green'>
              Đang hoạt động
            </Tag>
          ) : (
            <Tag style={{ borderRadius: 40 }} color='red'>
              Bị cấm
            </Tag>
          )}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size='middle'>
          <Dropdown menu={{ items: getMenuItems(record) }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <EllipsisOutlined />
              </Space>
            </a>
          </Dropdown>
        </Space>
      )
    }
  ]

  const blockOrUnBlockUser = async ({ record }: { record: any }) => {
    if (!isWaiting) {
      setIsWaiting(true)
      const path = `${APIPathConstants.ADMIN_BLOCK_OR_UNBLOCK_USER}/${record.id}`
      const id = toastService.default(record.isBlock ? 'Đang bỏ chặn người dùng' : 'Đang chặn người dùng', {
        autoClose: false,
        closeButton: false,
        isLoading: true
      })
      try {
        await NetworkManager.instance.createDataInServer(path, {})
        await fetchUser()
        toastService.update(id, {
          render: record.isBlock ? 'Bỏ chặn người dùng thành công' : 'Chặn người dùng thành công',
          type: 'success',
          autoClose: 2000,
          closeButton: true,
          isLoading: false
        })
        setIsWaiting(false)
      } catch (err: any) {
        console.log('Error: ', err)
        toastService.error(err.data.message)
      }
    } else {
      toastService.warning('Thao tác quá nhanh')
    }
  }

  const addOrRemoveAdminRole = async ({ record }: { record: any }) => {
    if (!isWaiting) {
      setIsWaiting(true)
      const path = `${APIPathConstants.SUPERADMIN_SET_OR_REMOVE_ROLE}/${record.id}`
      const id = toastService.default('Đang xử lý', {
        autoClose: false,
        closeButton: false,
        isLoading: true
      })
      try {
        await NetworkManager.instance.createDataInServer(path, {})
        await fetchUser()
        toastService.update(id, {
          render: record.isAdmin ? 'Hạ quyền người dùng thành công' : 'Nâng quyền người dùng thành công',
          type: 'success',
          autoClose: 2000,
          closeButton: true,
          isLoading: false
        })
        setIsWaiting(false)
      } catch (err: any) {
        console.log('Error: ', err)
        toastService.error(err.data.message)
      }
    } else {
      toastService.warning('Thao tác quá nhanh')
    }
  }

  const resetPassword = async ({ record }: { record: any }) => {
    if (!isWaiting) {
      const body = {
        uid: record.id
      }
      setIsWaiting(true)
      const path = `${APIPathConstants.ADMIN_RESET_PASSWORD}`
      const id = toastService.default('Đang xử lý', {
        autoClose: false,
        closeButton: false,
        isLoading: true
      })
      try {
        await NetworkManager.instance.createDataInServer(path, body)
        await fetchUser()
        toastService.update(id, {
          render: 'Đặt lại mật khẩu thành công',
          type: 'success',
          autoClose: 2000,
          closeButton: true,
          isLoading: false
        })
        setIsWaiting(false)
      } catch (err: any) {
        console.log('Error: ', err)
        toastService.error(err.data.message)
      }
    } else {
      toastService.warning('Thao tác quá nhanh')
    }
  }

  const handleActionTable = async ({ record, key }: { record: any; key: string }) => {
    toastService.dismissAll()
    if (key == '0') {
      addOrRemoveAdminRole({ record: record })
    } else if (key == '1') {
      confirmBockOrUnblockUser({ record: record })
    } else if (key == '2') {
      resetPassword({ record: record })
    }
  }

  const getMenuItems = (record: any) => [
    isSuperAdmin
      ? {
        label: (
          <span onClick={() => handleActionTable({ record, key: '0' })}>
            {record.isAdmin ? 'Hạ quyền' : 'Nâng quyền'}
          </span>
        ),
        key: '0'
      }
      : null,
    {
      label: (
        <span
          onClick={() => {
            handleActionTable({ record, key: '2' })
          }}
        >
          Đặt lại mật khẩu
        </span>
      ),
      key: '2'
    },
    {
      label: (
        <span onClick={() => handleActionTable({ record, key: '1' })} className={!record.state ? 'text-red-400' : ''}>
          {!record.isBlock ? 'Chặn' : 'Bỏ chặn'}
        </span>
      ),
      key: '1'
    }
  ]

  const dataSource = (filterusers as DataType[]).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isAdmin: user.isAdmin,
    isBlock: user.isBlock
  }))

  const { Search } = Input

  const confirmBockOrUnblockUser = ({ record }: { record: any }) => {
    Modal.confirm({
      title: 'Xác nhận',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      centered: true,
      content: !record.isBlock ? 'Bạn chắc chắn muốn chặn người dùng này' : 'Bỏ chặn người dùng này',
      closable: true,
      onOk: () => {
        blockOrUnBlockUser({ record: record })
      },
      maskClosable: true
    })
  }
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }
  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Ảnh đại diện</div>
    </button>
  )

  const handleChange: UploadProps['onChange'] = (info) => {
    const file = info.file.originFileObj as FileType
    if (file) {
      setAvatar(file)
      setLoading(true)
      getBase64(file, (url) => {
        setLoading(false)
        // setImageUrl(url)
        setPreviewImage(url)
      })
    }
  }

  const [form] = Form.useForm()

  const validateMessages = {
    required: '${label} không được để trống!',
    types: {
      email: 'Không phải là email hợp lệ!'
    }
  }

  const onFinish = async (values: any) => {
    console.log('avatar: ', avatar)
    console.log(values.user)
    addNewUser({ user: values.user })
  }

  const addNewUser = async ({ user }: { user: any }) => {
    const body = {
      email: user.email,
      password: '123456',
      name: user.name
    }

    console.log('Avatar: ', avatar)

    const id = toastService.default('Đang thêm mới người dùng', {
      autoClose: false,
      closeButton: false,
      isLoading: true
    })
    setIsCreateUser(false)
    setPreviewImage('')
    form.resetFields()
    try {
      const user = await NetworkManager.instance.createDataInServer(APIPathConstants.ADMIN_CREATE_USER, body)
      if (user && avatar != null) {
        const file = avatar
        const formData = new FormData()
        formData.append('image', file)
        formData.append('uid', user.data.data.user.id)
        try {
          const response = await NetworkManager.instance.createFormDataInServer(
            APIPathConstants.UPDATE_AVATAR,
            formData
          )
          toastService.update(id, {
            render: 'Thêm người dùng thành công',
            type: 'success',
            autoClose: 2000,
            closeButton: true,
            isLoading: false
          })
          fetchUser()
          return response
        } catch (error) {
          toastService.update(id, {
            render: 'Thêm ảnh thất bại',
            type: 'error',
            autoClose: 2000,
            closeButton: true,
            isLoading: false
          })
          console.error('Error uploading avatar:', error)
          return null
        }
      }
    } catch (err: any) {
      toastService.update(id, {
        render: 'Thêm người dùng thất bại',
        type: 'error',
        autoClose: 2000,
        closeButton: true,
        isLoading: false
      })
      console.log('Error: ', err)
      toastService.error(err.data.message)
    }
  }

  useTitle('Quản lý người dùng')
  return (
    <div className='block'>
      <div className='h-auto grid grid-cols-4 gap-4 items-center justify-center'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6'>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col justify-between'>
              <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl'>
                <UserOutlined style={{ fontSize: 20 }} />
              </div>
              <div className='mt-5 md:w-max'>
                <span className='text-sm text-gray-500 dark:text-gray-400'>Tổng số người dùng</span>
              </div>
            </div>
            <div className='flex items-start justify-end'>
              <h4 className='font-bold text-gray-800 text-title-sm'>{users.length}</h4>
            </div>
          </div>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6'>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col justify-between'>
              <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl'>
                <span className='relative flex '>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                  <span className='relative inline-flex size-3 rounded-full bg-green-400'></span>
                </span>
              </div>
              <div className='mt-5 md:w-max'>
                <span className='text-sm text-gray-500 dark:text-gray-400'>Đang hoạt động</span>
              </div>
            </div>
            <div className='flex items-start justify-end'>
              <h4 className='font-bold text-green-500 text-title-sm'>{getUserActive()}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-5'>
        <Table<DataType>
          loading={isTableLoading}
          columns={columns}
          dataSource={dataSource}
          title={() => (
            <div className='flex relative items-center justify-center'>
              <div className='w-1/2'>
                <Search
                  classNames={{
                    input: 'my-input'
                  }}
                  placeholder='Tìm kiếm theo tên, email...'
                  prefix={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                      />
                    </svg>
                  }
                  size='large'
                  enterButton='Tìm kiếm'
                  loading={isSearchButtonLoading}
                  allowClear
                  onPressEnter={(value) => {
                    searchUserWithParam({ searchKey: value.currentTarget.value })
                  }}
                  onSearch={(value) => searchUserWithParam({ searchKey: value })}
                  variant='filled'
                  styles={{
                    input: {
                      fontSize: 15,
                      paddingLeft: 16
                    }
                  }}
                ></Search>
              </div>
              <div className='absolute right-0'>
                <Button
                  icon={<UserAddOutlined />}
                  type='primary'
                  size='large'
                  shape='round'
                  onClick={() => {
                    setIsCreateUser(true)
                  }}
                >
                  Thêm mới
                </Button>
              </div>
            </div>
          )}
          locale={{
            emptyText: 'Không có dữ liệu'
          }}
          pagination={{ pageSize: 5 }}
        />
      </div>
      <Modal
        open={isCreateUSer}
        title={
          <div className='flex items-center justify-center'>
            <h1>Thêm người dùng</h1>
          </div>
        }
        onCancel={() => {
          setIsCreateUser(false)
          setPreviewImage('')
          form.resetFields()
        }}
        footer={null}
      >
        <div className='block'>
          <div className='flex items-center justify-center'>
            <Upload
              name='avatar'
              listType='picture-circle'
              className='avatar-uploader'
              showUploadList={false}
              // action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {previewImage != '' ? <img src={previewImage} alt='avatar' style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </div>
          <div>
            <Form
              form={form}
              name='nest-messages'
              onFinish={onFinish}
              style={{ maxWidth: 600, marginTop: 10 }}
              validateMessages={validateMessages}
              layout='vertical'
            >
              <Form.Item name={['user', 'name']} label='Tên người dùng:' rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['user', 'email']} label='Email:' rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
              <Form.Item label={null} wrapperCol={{ span: 24 }}>
                <div className='w-full'>
                  <Button type='primary' htmlType='submit' block>
                    Thêm
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UsersManager
