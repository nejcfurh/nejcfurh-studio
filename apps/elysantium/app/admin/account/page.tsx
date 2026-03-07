'use client';

import UpdatePasswordForm from '@/components/admin/features/authentication/UpdatePasswordForm';
import UpdateUserDataForm from '@/components/admin/features/authentication/UpdateUserDataForm';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';

function Account(): React.ReactElement {
  return (
    <>
      <Heading as="h1">{'Update your account'.toUpperCase()}</Heading>
      <Row>
        <Heading as="h3">User data</Heading>
        <UpdateUserDataForm />
      </Row>
      <Row>
        <Heading as="h3">User password</Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
