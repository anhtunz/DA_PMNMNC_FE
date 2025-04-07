import { Button, Modal } from 'antd'

interface InitialComponent {
  type: 'default' | 'link' | 'text' | 'primary' | 'dashed' | undefined
  variant: 'link' | 'text' | 'dashed' | 'outlined' | 'solid' | 'filled' | undefined
  color:
  | 'default'
  | 'primary'
  | 'danger'
  | 'blue'
  | 'purple'
  | 'cyan'
  | 'green'
  | 'magenta'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'volcano'
  | 'geekblue'
  | 'lime'
  | 'gold'
  | undefined
  confirmContent: string
  handleOk: () => void
  btnText: string
}
const ConfirmModal = ({ type, variant, color, confirmContent, handleOk, btnText }: InitialComponent) => {
  const handleCancel = () => {
    console.log('Clicked cancel button')
  }
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      onClick={() => {
        Modal.confirm({
          title: 'Confirm',
          content: `${confirmContent}`,
          onOk: handleOk,
          onCancel: handleCancel,
          footer: (_, { OkBtn, CancelBtn }) => (
            <>
              <CancelBtn />
              <OkBtn />
            </>
          )
        })
      }}
    >
      {btnText}
    </Button>
  )
}
export default ConfirmModal
