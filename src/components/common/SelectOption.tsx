import { Select } from 'antd'

interface OptionItem {
  value: string
  label: string
}

interface InitialProps {
  optionData: OptionItem[]
  isMultiSelect: boolean
  placeholder: string
  customWidth?: string
  onChange: (value: string | string[]) => void
  value?: string | string[]
}
const SelectOption = ({ optionData, isMultiSelect, placeholder, customWidth, onChange }: InitialProps) => {
  
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
