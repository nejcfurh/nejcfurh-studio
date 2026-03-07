'use client';

import BookingTable from '@/components/admin/features/bookings/BookingTable';
import BookingTableOperations from '@/components/admin/features/bookings/BookingTableOperations';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';

function Bookings(): React.ReactElement {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">{'Bookings'.toUpperCase()}</Heading>
        <BookingTableOperations />
      </Row>
      <BookingTable />
    </>
  );
}

export default Bookings;
