'use client';

import { createEditCabin } from '@/lib/services/apiCabins';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface EditCabinParams {
  newCabinData: { image: any; [key: string]: any };
  id: number;
}

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }: EditCabinParams) =>
      createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success('New cabin successfully edited!');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: () => {
      toast.error('err.message');
    }
  });

  return { editCabin, isEditing };
}
