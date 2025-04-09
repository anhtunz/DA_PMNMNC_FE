import React from 'react'
import { Button, Flex } from 'antd'

interface LoadingButtonProps {
  htmlType: 'button' | 'submit' | 'reset' | undefined
  textButton: string
  loading: boolean
}
const LoadingButton: React.FC<LoadingButtonProps> = ({ htmlType, textButton, loading }) => {

  return (
    <>
      <Flex gap='small' vertical>
        <Flex gap='small' wrap>
          <Button type='primary' htmlType={htmlType} loading={loading}>
            {textButton}
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default LoadingButton
