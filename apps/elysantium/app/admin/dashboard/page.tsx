'use client';

import DashboardFilter from '@/components/admin/features/dashboard/DashboardFilter';
import DashboardLayout from '@/components/admin/features/dashboard/DashboardLayout';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';

function Dashboard(): React.ReactElement {
  return (
    <>
      <Row type="horizontal">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[var(--color-brand-600)] uppercase">
            Overview
          </span>
          <Heading as="h1">{'Dashboard'.toUpperCase()}</Heading>
        </div>
        <DashboardFilter />
      </Row>
      <DashboardLayout />
    </>
  );
}

export default Dashboard;
