'use client';

import { getCurrentUser } from '@/lib/services/apiAuth';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  role: string;
  user_metadata: {
    fullName: string;
    avatar: string;
  };
}

export function useUser() {
  const {
    isLoading,
    data: user,
    error,
    fetchStatus
  } = useQuery<User>({
    queryKey: ['user'],
    queryFn: getCurrentUser
  });

  return {
    isLoading,
    user,
    isAuthenticated: user?.role === 'authenticated',
    error,
    fetchStatus
  };
}
