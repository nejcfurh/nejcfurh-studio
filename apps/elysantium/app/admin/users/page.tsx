'use client';

import SignupForm from '@/components/admin/features/authentication/SignupForm';
import UsersTable from '@/components/admin/features/users/UsersTable';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';

function Users(): React.ReactElement {
  return (
    <>
      <Heading as="h1">{'Users'.toUpperCase()}</Heading>

      <Row>
        <Heading as="h2">{'All users'.toUpperCase()}</Heading>
        <UsersTable />
      </Row>

      <Row>
        <Heading as="h2">{'Create New User'.toUpperCase()}</Heading>
        <SignupForm />
      </Row>
    </>
  );
}

export default Users;
