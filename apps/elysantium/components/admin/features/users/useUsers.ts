'use client';

import { getUsers } from '@/lib/services/apiUsers';
import { useQuery } from '@repo/react-query';

export function useUsers() {
  const {
    isPending,
    data: users,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  return { isPending, users, error };
}
