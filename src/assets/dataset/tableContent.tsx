import { TableColumnsType } from "antd"

interface DataType {
  key: string
  name: string
  email: string
  state: string
}
const data = [
  { key: '0', name: 'John Brown', email: 'test@test.com', state: 'Nghỉ tạm thời' },
  { key: '1', name: 'Jim Green', email: 'test@test1.com', state: 'Đang làm' },
  { key: '2', name: 'Joe Black', email: 'test@test.com', state: 'Chim Cook' },
  { key: '3', name: 'Em khac', email: 'test@test.com', state: 'Nghỉ tạm thời' },
  { key: '4', name: 'Anh khac', email: 'test@test1.com', state: 'Đang làm' },
  { key: '5', name: 'Troll troll', email: 'test@test.com', state: 'Let him Cook' },
  { key: '6', name: 'Jim Green', email: 'test@test1.com', state: 'Gần Cook' },
  { key: '7', name: 'Joe Black', email: 'test@test.com', state: 'Chim Cook' },
  { key: '8', name: 'Em khac', email: 'test@test.com', state: 'Nghỉ tạm thời' },
  { key: '9', name: 'Anh khac', email: 'test@test1.com', state: 'Gần Cook' }
]
const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: '20%' },
  { title: 'email', dataIndex: 'email', key: 'email' },
  { title: 'state', dataIndex: 'state', key: 'state' }
]
export {data, columns}