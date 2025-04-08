import { useState } from 'react'

const useSelectOption = (isMulti = false) => {
  const [selected, setSelected] = useState<string | string[]>(isMulti ? [] : '')
  const handleSelect = (value: string | string[]) => {
    setSelected(value)
  }
  return { selected, handleSelect }
}
export { useSelectOption }
