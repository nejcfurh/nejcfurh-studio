'use client';

import React, { createContext, useContext } from 'react';

interface TableContextValue {
  columns: string;
}

const TableContext = createContext<TableContextValue>({} as TableContextValue);

interface TableProps {
  columns: string;
  children: React.ReactNode;
}

function Table({ columns, children }: TableProps) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div
        role="table"
        className="overflow-hidden rounded-[7px] border border-[var(--color-grey-200)] bg-[var(--color-grey-0)] text-sm"
      >
        {children}
      </div>
    </TableContext.Provider>
  );
}

interface HeaderProps {
  children: React.ReactNode;
}

function Header({ children }: HeaderProps) {
  const { columns } = useContext(TableContext);
  return (
    <header
      role="row"
      className="grid items-center gap-x-6 border-b border-[var(--color-grey-100)] bg-[var(--color-grey-50)] px-6 py-4 font-semibold tracking-[0.4px] text-[var(--color-grey-600)] uppercase"
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </header>
  );
}

interface RowProps {
  children: React.ReactNode;
}

function Row({ children }: RowProps) {
  const { columns } = useContext(TableContext);
  return (
    <div
      role="row"
      className="grid items-center gap-x-6 px-6 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[var(--color-grey-100)]"
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  );
}

interface BodyProps<T> {
  data: T[];
  render: (item: T, index: number) => React.ReactNode;
}

//render props pattern
function Body<T>({ data, render }: BodyProps<T>) {
  if (!data.length)
    return (
      <p className="m-6 text-center text-base font-medium">
        No data to show at the moment!
      </p>
    );
  return <section className="my-1">{data.map(render)}</section>;
}

function TableFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="flex justify-center bg-[var(--color-grey-50)] py-3 empty:hidden">
      {children}
    </footer>
  );
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = TableFooter;

export default Table;
