'use client';

import { updateBooking } from '@/lib/services/apiBookings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface CheckinParams {
  bookingId: number;
  breakfast: {
    hasBreakfast?: boolean;
    extrasPrice?: number;
    totalPrice?: number;
  };
}

interface BookingResponse {
  id: number;
}

export function useCheckin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: checkin, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }: CheckinParams) =>
      updateBooking(bookingId, {
        status: 'checked-in',
        isPaid: true,
        ...breakfast
      }),

    onSuccess: (data: BookingResponse) => {
      toast.success(`Booking #${data.id} successfully checked in!`);
      queryClient.invalidateQueries({ type: 'active' });
      router.push('/admin/dashboard');
    },

    onError: () => {
      toast.error('There was an error while checking the guest in!');
    }
  });

  return { checkin, isCheckingIn };
}
