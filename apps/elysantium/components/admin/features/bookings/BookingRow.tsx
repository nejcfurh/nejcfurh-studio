'use client';

import { useCheckout } from '@/components/admin/features/check-in-out/useCheckout';
import ConfirmDelete from '@/components/admin/ui/ConfirmDelete';
import Menus from '@/components/admin/ui/Menus';
import Modal from '@/components/admin/ui/Modal';
import Table from '@/components/admin/ui/Table';
import Tag from '@/components/admin/ui/Tag';
import { formatCurrency, formatDistanceFromNow } from '@/lib/utils/helpers';
import { format, isToday } from 'date-fns';
import { useRouter } from 'next/navigation';
import { HiEye, HiTrash } from 'react-icons/hi';
import { HiArrowDownOnSquare, HiArrowUpOnSquare } from 'react-icons/hi2';

import { useDeleteBooking } from './useDeleteBooking';

interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
}

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  status: string;
  cabinPrice: number;
  extrasPrice: number;
  hasBreakfast: boolean;
  observations: string;
  isPaid: boolean;
  guests: Guest;
  cabins: Cabin;
}

interface BookingRowProps {
  booking: Booking;
}

const statusToTagName: Record<string, string> = {
  unconfirmed: 'blue',
  'checked-in': 'green',
  'checked-out': 'silver'
};

function BookingRow({ booking }: BookingRowProps): React.ReactElement {
  const {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName }
  } = booking;

  const router = useRouter();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();

  return (
    <Table.Row>
      <div className="font-[Sono] text-base font-semibold text-[var(--color-grey-600)]">
        {cabinName}
      </div>

      <div className="flex flex-col gap-0.5 [&_span:first-child]:font-medium [&_span:last-child]:text-xs [&_span:last-child]:text-[var(--color-grey-500)]">
        <span>{guestName}</span>
        <span>{email}</span>
      </div>

      <div className="flex flex-col gap-0.5 [&_span:first-child]:font-medium [&_span:last-child]:text-xs [&_span:last-child]:text-[var(--color-grey-500)]">
        <span>
          {isToday(new Date(startDate))
            ? 'Today'
            : formatDistanceFromNow(startDate)}{' '}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), 'MMM dd yyyy')} &mdash;{' '}
          {format(new Date(endDate), 'MMM dd yyyy')}
        </span>
      </div>

      <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>

      <div className="font-[Sono] font-medium">
        {formatCurrency(totalPrice)}
      </div>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={String(bookingId)} />
          <Menus.List id={String(bookingId)}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => router.push(`/admin/bookings/${bookingId}`)}
            >
              See details
            </Menus.Button>
            {status === 'unconfirmed' && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => router.push(`/admin/checkin/${bookingId}`)}
              >
                Check in
              </Menus.Button>
            )}
            {status === 'checked-in' && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={() => checkout(bookingId)}
                disabled={isCheckingOut}
              >
                Check Out
              </Menus.Button>
            )}

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>
        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="booking"
            disabled={isDeletingBooking}
            onConfirm={() => deleteBooking(bookingId)}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
