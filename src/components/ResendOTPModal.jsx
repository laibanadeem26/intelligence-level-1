import { Button, Input, Modal } from "antd";

const ResendOTPModal = ({
  title,
  confirmButtonName,
  editNumber,
  open,
  handleCancel,
  mobileNumber,
  handleConfirm,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      cancelButtonProps={{ style: { display: 'none' } }}
      footer={[
        <Button onClick={handleCancel} type="primary">
          {editNumber}
        </Button>,
        <Button onClick={handleConfirm} type="primary">
          {confirmButtonName && confirmButtonName.charAt(0).toUpperCase() + confirmButtonName.slice(1)}
        </Button>,
      ]}
    >
      <Input size="large" disabled value={mobileNumber} />
    </Modal>
  );
};

export default ResendOTPModal;
