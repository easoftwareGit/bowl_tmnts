import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const delConfTitle = 'Confirm Delete'

export type modalObjectType = {
  show: boolean,
  title: string,
  message: string,
  id: number
}

export const initModalObj: modalObjectType = {
  show: false,
  title: 'title',
  message: 'message',
  id: 0
}

interface ChildProps {
  show: boolean,
  title: string,
  message: string,
  onConfirm: () => void;
  onCancel?: () => void;
}

const ModalConfirm: React.FC<ChildProps> = ({ 
  show,
  title: heading,
  message,
  onConfirm,
  onCancel
}) => { 

  return (
    <>
      <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button className='me-2' variant="success" onClick={onConfirm}>
            OK
          </Button>
          <Button variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalConfirm;
