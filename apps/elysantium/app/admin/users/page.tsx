'use client';

import SignupForm from '@/components/admin/features/authentication/SignupForm';
import Heading from '@/components/admin/ui/Heading';

function Users(): React.ReactElement {
  return (
    <>
      <Heading as="h1">{'Users'.toUpperCase()}</Heading>
      <Heading as="h2">{'All users'.toUpperCase()}</Heading>
      <div>List of users</div>
      <Heading as="h2">{'Create New User'.toUpperCase()}</Heading>
      <SignupForm />
    </>
  );
}

export default Users;
