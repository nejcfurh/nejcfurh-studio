'use client';

import AddCabin from '@/components/admin/features/cabins/AddCabin';
import CabinTable from '@/components/admin/features/cabins/CabinTable';
import CabinTableOperations from '@/components/admin/features/cabins/CabinTableOperations';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';

function Cabins(): React.ReactElement {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">{'Cabins'.toUpperCase()}</Heading>
        <CabinTableOperations />
      </Row>
      <Row>
        <CabinTable />
        <AddCabin />
      </Row>
    </>
  );
}

export default Cabins;
