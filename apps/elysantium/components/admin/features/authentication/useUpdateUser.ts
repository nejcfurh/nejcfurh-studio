'use client';

import { updateCurrentUser } from '@/lib/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface UpdateUserResponse {
  user: Record<string, unknown>;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }: UpdateUserResponse) => {
      toast.success('User account successfully updated!');
      queryClient.setQueryData(['user'], user);
    },
    onError: () => {
      toast.error('err.message');
    }
  });

  return { updateUser, isUpdating };
}
