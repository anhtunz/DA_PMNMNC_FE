import { Select } from 'antd'
import { useState } from 'react'
interface OptionItem {
  value: string
  label: string
}

interface InitialProps {
  optionData: OptionItem[]
}
const SelectOption = ({ optionData }: InitialProps) => {
  const [selected, setSelected] = useState('')

  const onChange = (value: string) => {
    setSelected(value)
  }
  console.log(selected)
  return (
    <Select
      showSearch
      style={{ minWidth: 120 }}
      defaultValue={optionData.length > 0 ? optionData[0].value : ''}
      optionFilterProp='label'
      onChange={onChange}
      options={optionData}
    />
  )
}
export default SelectOption