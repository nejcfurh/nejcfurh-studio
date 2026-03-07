'use client';

import { deleteCabin as deleteCabinApi } from '@/lib/services/apiCabins';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success('Cabin successfully deleted!');
      queryClient.invalidateQueries({
        queryKey: ['cabins']
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return { isDeleting, deleteCabin };
}
