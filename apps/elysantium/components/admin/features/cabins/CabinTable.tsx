'use client';

import Empty from '@/components/admin/ui/Empty';
import Menus from '@/components/admin/ui/Menus';
import Spinner from '@/components/admin/ui/Spinner';
import Table from '@/components/admin/ui/Table';
import { useSearchParams } from 'next/navigation';

import CabinRow from './CabinRow';
import { useCabins } from './useCabins';

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
  [key: string]: string | number;
}

function CabinTable(): React.ReactElement | null {
  const { isLoading, cabins } = useCabins();
  const searchParams = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!cabins!.length) return <Empty resourceName="cabins" />;

  // Filter
  const filterValue = searchParams.get('discount') || 'all';

  let filteredCabins: Cabin[] | undefined;
  if (filterValue === 'all') filteredCabins = cabins as Cabin[];
  if (filterValue === 'no-discount')
    filteredCabins = (cabins as Cabin[])?.filter(
      (cabin: Cabin) => cabin.discount === 0
    );
  if (filterValue === 'with-discount')
    filteredCabins = (cabins as Cabin[])?.filter(
      (cabin: Cabin) => cabin.discount > 0
    );

  // Sort
  const sortBy = searchParams.get('sortBy') || 'name-asc';

  const [field, direction] = sortBy.split('-');

  const modifier = direction === 'asc' ? 1 : -1;

  const sortedCabins = filteredCabins!.sort(
    (a: Cabin, b: Cabin) => (Number(a[field]) - Number(b[field])) * modifier
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin: Cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
