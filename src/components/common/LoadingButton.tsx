import React from 'react'
import { Button, Flex } from 'antd'

interface LoadingButtonProps {
  children: React.ReactNode
  loading: boolean
  htmlType: 'submit' | 'reset' | 'button' | undefined
  type: 'link' | 'text' | 'default' | 'primary' | 'dashed' | undefined
  styleCss: string
}
const LoadingButton: React.FC<LoadingButtonProps> = ({ children, loading, htmlType, styleCss }) => {
  return (
    <div className={`${styleCss}`}>
      <Flex gap='small' vertical>
        <Flex gap='small' wrap>
          <Button htmlType={htmlType} type='link' style={{ color: 'black' }} loading={loading}>
            {children}
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}

export default LoadingButton
