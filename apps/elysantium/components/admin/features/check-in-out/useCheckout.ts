'use client';

import { updateBooking } from '@/lib/services/apiBookings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface BookingResponse {
  id: number;
}

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId: number) =>
      updateBooking(bookingId, {
        status: 'checked-out'
      }),

    onSuccess: (data: BookingResponse) => {
      toast.success(`Booking #${data.id} successfully checked out!`);
      queryClient.invalidateQueries({ type: 'active' });
    },

    onError: () => {
      toast.error('There was an error while checking the guest out!');
    }
  });

  return { checkout, isCheckingOut };
}
