'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@repo/ui/components/table';
import {
  ColumnDef,
  columnVisibilityFeature,
  flexRender,
  rowSelectionFeature,
  tableFeatures,
  useTable,
  type RowData
} from '@tanstack/react-table';

export const tableDisplayFeatures = tableFeatures({
  columnVisibilityFeature,
  rowSelectionFeature
});

export type TableDisplayFeatures = typeof tableDisplayFeatures;

interface TableDisplayProps<TData extends RowData> {
  columns: ColumnDef<TableDisplayFeatures, TData>[];
  data: TData[];
}

export function TableDisplay<TData extends RowData>({
  columns,
  data
}: TableDisplayProps<TData>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useTable({
    features: tableDisplayFeatures,
    data,
    columns
  });

  return (
    <div className="mt-12 overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableDisplay;
