'use client';

import Empty from '@/components/admin/ui/Empty';
import Spinner from '@/components/admin/ui/Spinner';
import Table from '@/components/admin/ui/Table';

import UsersRow from './UsersRow';
import { useUsers } from './useUsers';

function UsersTable(): React.ReactElement {
  const { isPending, users, error } = useUsers();

  if (isPending) return <Spinner />;
  if (error)
    return (
      <p className="text-sm text-red-700">
        Could not load users: {error.message}
      </p>
    );
  if (!users?.length) return <Empty resourceName="users" />;

  return (
    <Table columns="0.5fr 2fr 2.4fr 1.4fr">
      <Table.Header>
        <div></div>
        <div>Name</div>
        <div>Email</div>
        <div>Joined</div>
      </Table.Header>

      <Table.Body
        data={users}
        render={(user) => <UsersRow key={user.id} user={user} />}
      />
    </Table>
  );
}

export default UsersTable;
