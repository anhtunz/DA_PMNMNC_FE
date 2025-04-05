import { Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { ReactNode } from 'react'

interface TableComponentProps<T> {
  columns: TableColumnsType<T>
  dataSource: T[]
  pageSizeCustom: number
  actions?: (record: T) => ReactNode
}

const TableComponent = <T extends { key: string }>({
  columns,
  dataSource,
  pageSizeCustom,
  actions
}: TableComponentProps<T>) => {
  const enhancedColumns = actions
    ? [
      ...columns,
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right' as const,
        width: 150,
        render: (_: any, record: T) => <>{actions(record)}</>
      }
    ]
    : columns

  return (
    <Table<T> bordered columns={enhancedColumns} dataSource={dataSource} pagination={{ pageSize: pageSizeCustom }} />
  )
}

export default TableComponent
