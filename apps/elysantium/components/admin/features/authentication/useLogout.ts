'use client';

import { logout as logoutApi } from '@/lib/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      router.push('/admin/login');
    }
  });

  return { logout, isPending };
}
