'use client';

import Table from '@/components/admin/ui/Table';
import type { AppUser } from '@/lib/services/apiUsers';

interface UsersRowProps {
  user: AppUser;
}

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

function UsersRow({ user }: UsersRowProps): React.ReactElement {
  return (
    <Table.Row>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user.avatar || '/default-user.jpg'}
        alt={user.fullName ? `Avatar of ${user.fullName}` : 'User avatar'}
        className="aspect-square w-9 rounded-full object-cover object-center"
      />
      <div className="font-medium text-(--color-grey-700)">
        {user.fullName || '—'}
      </div>
      <div className="text-(--color-grey-600)">{user.email}</div>
      <div className="text-(--color-grey-500)">
        {formatDate(user.createdAt)}
      </div>
    </Table.Row>
  );
}

export default UsersRow;
