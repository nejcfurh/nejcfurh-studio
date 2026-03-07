'use client';

import { createEditCabin } from '@/lib/services/apiCabins';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: (newCabin: Parameters<typeof createEditCabin>[0]) =>
      createEditCabin(newCabin),
    onSuccess: () => {
      toast.success('New cabin successfully created!');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: () => {
      toast.error('err.message');
    }
  });

  return { isCreating, createCabin };
}
