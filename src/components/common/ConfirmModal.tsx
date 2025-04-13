import { Modal } from 'antd'

interface InitialComponent {
  confirmContent: string
  handleOk: () => void
}
const ConfirmModal = ({ confirmContent, handleOk }: InitialComponent) => {
  const handleCancel = () => {
    console.log('Clicked cancel button')
  }
  return (
    Modal.confirm({
      title: 'Confirm!',
      content: `${confirmContent}`,
      onOk: handleOk,
      onCancel: handleCancel,
      maskClosable: true,
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )
    })
  )
}
export default ConfirmModal
