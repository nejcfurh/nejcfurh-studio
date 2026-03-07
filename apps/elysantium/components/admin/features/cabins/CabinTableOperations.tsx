'use client';

import Filter from '@/components/admin/ui/Filter';
import SortBy from '@/components/admin/ui/SortBy';
import TableOperations from '@/components/admin/ui/TableOperations';

// client-side-filtering & sorting

function CabinTableOperations(): React.ReactElement {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: 'all', label: 'All' },
          { value: 'no-discount', label: 'No Discount' },
          { value: 'with-discount', label: 'With Discount' }
        ]}
      />

      <SortBy
        options={[
          { value: 'name-asc', label: 'Sort by name (A-Z)' },
          { value: 'name-desc', label: 'Sort by name (Z-A)' },
          { value: 'regularPrice-asc', label: 'Sort by price (lowest first)' },
          {
            value: 'regularPrice-desc',
            label: 'Sort by price (highest first)'
          },
          {
            value: 'maxCapacity-asc',
            label: 'Sort by capacity (lowest first)'
          },
          {
            value: 'maxCapacity-desc',
            label: 'Sort by capacity (highest first)'
          }
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
