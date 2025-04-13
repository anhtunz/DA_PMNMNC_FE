import { Button, Dropdown, Input, Modal, Space, Table, TableProps, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { NetworkManager } from '../../../config/network_manager'
import { toastService } from '../../../services/toast/ToastService'
import APIPathConstants from '../../../constant/ApiPathConstants'
import { EllipsisOutlined, UserOutlined } from '@ant-design/icons'
import useUserStore from '../../../stores/userStore'

const UsersManager = () => {
  const [users, setUsers] = useState([])
  const [filterusers, setFilterUsers] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isSearchButtonLoading, setIsSearchButtonLoading] = useState(false)
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
    isAdmin: boolean
    isBlock: boolean
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>
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
      render: (record) =>
        isSuperAdmin ? (
          <Space size='middle'>
            <Dropdown menu={{ items: getMenuItems(record) }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <EllipsisOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        ) : (
          <Button
            danger
            type={!record.isBlock ? 'primary' : 'dashed'}
            // color={record.isBlock ? 'blue' : 'danger'}
            onClick={() => success({ record: record })}
          >
            {!record.isBlock ? 'Chặn' : 'Bỏ chặn'}
          </Button>
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

  const handleActionTable = async ({ record, key }: { record: any; key: string }) => {
    toastService.dismissAll()
    if (key == '0') {
      toastService.info(`${record.id}`)
    } else if (key == '1') {
      await blockOrUnBlockUser({ record: record })
    }
  }

  const getMenuItems = (record: any) => [
    {
      label: (
        <span onClick={() => handleActionTable({ record, key: '0' })}>
          {record.isAdmin ? 'Hạ quyền' : 'Nâng quyền'}
        </span>
      ),
      key: '0'
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
    isAdmin: user.isAdmin,
    isBlock: user.isBlock
  }))

  const { Search } = Input

  const success = ({ record }: { record: any }) => {
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

  return (
    <div className='block'>
      <div className='h-auto grid grid-cols-4 gap-4 items-center justify-center'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6'>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col justify-between'>
              <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl'>
                <UserOutlined style={{ fontSize: 20 }} />
              </div>
              <div className='mt-5'>
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
              <div className='mt-5'>
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
            <div className='flex items-center justify-center'>
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
            </div>
          )}
          locale={{
            emptyText: 'Không có dữ liệu'
          }}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  )
}

export default UsersManager
