'use client';

import { useCheckout } from '@/components/admin/features/check-in-out/useCheckout';
import Button from '@/components/admin/ui/Button';
import ButtonGroup from '@/components/admin/ui/ButtonGroup';
import ButtonText from '@/components/admin/ui/ButtonText';
import ConfirmDelete from '@/components/admin/ui/ConfirmDelete';
import Empty from '@/components/admin/ui/Empty';
import Heading from '@/components/admin/ui/Heading';
import Modal from '@/components/admin/ui/Modal';
import Row from '@/components/admin/ui/Row';
import Spinner from '@/components/admin/ui/Spinner';
import Tag from '@/components/admin/ui/Tag';
import { useMoveBack } from '@/lib/hooks/useMoveBack';
import { useRouter } from 'next/navigation';

import BookingDataBox from './BookingDataBox';
import { useBooking } from './useBooking';
import { useDeleteBooking } from './useDeleteBooking';

const statusToTagName: Record<string, string> = {
  unconfirmed: 'blue',
  'checked-in': 'green',
  'checked-out': 'silver'
};

function BookingDetail(): React.ReactElement | null {
  const { booking, isLoading } = useBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { isDeletingBooking, deleteBooking } = useDeleteBooking();
  const moveBack = useMoveBack();
  const router = useRouter();

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const { status, id: bookingId } = booking;

  return (
    <>
      <Row type="horizontal">
        <div className="flex items-center gap-6">
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </div>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button onClick={() => router.push(`/admin/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}
        {status === 'checked-in' && (
          <Button onClick={() => checkout(bookingId)} disabled={isCheckingOut}>
            Check Out
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button $variation="danger">Delete</Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              disabled={isDeletingBooking}
              onConfirm={() =>
                deleteBooking(bookingId, {
                  onSettled: () => router.back()
                })
              }
            />
          </Modal.Window>
        </Modal>

        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
