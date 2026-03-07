'use client';

import { login as loginApi } from '@/lib/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: Record<string, unknown>;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      loginApi({ email, password }),
    onSuccess: (user: LoginResponse) => {
      queryClient.setQueryData(['user'], user.user);
      router.push('/admin/dashboard');
    },
    onError: (err: Error) => {
      console.log('Error', err);
      toast.error('Provided email or password are incorrect!');
    }
  });

  return { login, isPending };
}
