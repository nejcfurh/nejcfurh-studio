'use client';

import { signup as signupApi } from '@/lib/services/apiAuth';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
}

export function useSignUp() {
  const { mutate: signup, isPending } = useMutation({
    mutationFn: (credentials: SignUpCredentials) => signupApi(credentials),
    onSuccess: () => {
      toast.success(
        'Account successfully created! Please verify the new account via the email!'
      );
    }
  });

  return { signup, isPending };
}
