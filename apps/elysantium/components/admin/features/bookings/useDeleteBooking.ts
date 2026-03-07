'use client';

import { deleteBooking as deleteBookingApi } from '@/lib/services/apiBookings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingBooking, mutate: deleteBooking } = useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: () => {
      toast.success('Booking successfully deleted!');
      queryClient.invalidateQueries({
        queryKey: ['bookings']
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return { isDeletingBooking, deleteBooking };
}
