'use client';

import DashboardFilter from '@/components/admin/features/dashboard/DashboardFilter';
import DashboardLayout from '@/components/admin/features/dashboard/DashboardLayout';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';

function Dashboard(): React.ReactElement {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">{'Dashboard'.toUpperCase()}</Heading>
        <DashboardFilter />
      </Row>
      <DashboardLayout />
    </>
  );
}

export default Dashboard;
