'use client';

import Empty from '@/components/admin/ui/Empty';
import Menus from '@/components/admin/ui/Menus';
import Pagination from '@/components/admin/ui/Pagination';
import Spinner from '@/components/admin/ui/Spinner';
import Table from '@/components/admin/ui/Table';

import BookingRow from './BookingRow';
import { useBookings } from './useBookings';

function BookingTable(): React.ReactElement | null {
  const { bookings, isLoading, count } = useBookings();

  if (isLoading) return <Spinner />;

  if (!bookings?.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking: any) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
