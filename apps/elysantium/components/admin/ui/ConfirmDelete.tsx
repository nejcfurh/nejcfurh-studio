'use client';

import Button from '@/components/admin/ui/Button';
import Heading from '@/components/admin/ui/Heading';

interface ConfirmDeleteProps {
  resourceName: string;
  onConfirm: () => void;
  disabled?: boolean;
  onCloseModal?: () => void;
}

function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal
}: ConfirmDeleteProps) {
  return (
    <div className="flex w-[40rem] flex-col gap-3">
      <Heading as="h3">Delete {resourceName}</Heading>
      <span>
        <p className="mb-3 text-[var(--color-grey-500)]">
          Are you sure you want to delete this {resourceName}?
        </p>
        <p className="mb-3 text-[var(--color-grey-500)]">
          This action cannot be undone.
        </p>
      </span>
      <div className="flex justify-end gap-3">
        <Button
          $variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button $variation="danger" disabled={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
