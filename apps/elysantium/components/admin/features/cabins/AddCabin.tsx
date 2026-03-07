'use client';

import Button from '@/components/admin/ui/Button';
import Modal from '@/components/admin/ui/Modal';

import CreateCabinForm from './CreateCabinForm';

//compound component
function AddCabin(): React.ReactElement {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button>ADD NEW CABIN</Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCabin;
