import { Select } from 'antd'
import { useState } from 'react'

interface OptionItem {
  value: string
  label: string
}

interface InitialProps {
  optionData: OptionItem[]
  isMultiSelect: boolean
  placeholder: string
  customWidth?: string
}
const SelectOption = ({ optionData, isMultiSelect, placeholder, customWidth }: InitialProps) => {
  const [selected, setSelected] = useState('')

  const onChange = (value: string) => {
    setSelected(value)
  }
  return (
    <Select
      showSearch
      mode={isMultiSelect ? 'multiple' : undefined}
      allowClear
      placeholder={placeholder}
      style={{ width: `${customWidth}` }}
      optionFilterProp='label'
      onChange={onChange}
      options={optionData}
    />
  )
}
export default SelectOption
