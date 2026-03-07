'use client';

import ConfirmDelete from '@/components/admin/ui/ConfirmDelete';
import Menus from '@/components/admin/ui/Menus';
import Modal from '@/components/admin/ui/Modal';
import Table from '@/components/admin/ui/Table';
import { formatCurrency } from '@/lib/utils/helpers';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';

import CreateCabinForm from './CreateCabinForm';
import { useCreateCabin } from './useCreateCabin';
import { useDeleteCabin } from './useDeleteCabin';

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

interface CabinRowProps {
  cabin: Cabin;
}

function CabinRow({ cabin }: CabinRowProps): React.ReactElement {
  const { isDeleting, deleteCabin } = useDeleteCabin();

  const { isCreating, createCabin } = useCreateCabin();

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description
  } = cabin;

  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description
    });
  }

  return (
    <Table.Row>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="block aspect-[3/2] w-16 -translate-x-[7px] scale-150 rounded-tr-[10%] rounded-br-[10%] object-cover object-center"
        src={image}
        alt={name}
      />
      <div className="font-[Sono] text-base font-semibold text-[var(--color-grey-600)]">
        {name}
      </div>
      <div>Fits up to {maxCapacity} guests!</div>
      <div className="font-[Sono] font-semibold">
        {formatCurrency(regularPrice)}
      </div>
      {discount ? (
        <div className="font-[Sono] font-medium text-[var(--color-green-700)]">
          {formatCurrency(discount)}
        </div>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={String(cabinId)} />
            <Menus.List id={String(cabinId)}>
              <Menus.Button
                disabled={isCreating}
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
              >
                Duplicate
              </Menus.Button>

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cabin"
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
