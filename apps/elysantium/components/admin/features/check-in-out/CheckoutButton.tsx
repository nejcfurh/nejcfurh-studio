'use client';

import Button from '@/components/admin/ui/Button';

import { useCheckout } from './useCheckout';

interface CheckoutButtonProps {
  bookingId: number;
}

function CheckoutButton({
  bookingId
}: CheckoutButtonProps): React.ReactElement {
  const { checkout, isCheckingOut } = useCheckout();

  return (
    <Button
      $variation="danger"
      $size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingOut}
    >
      {' '}
      Check out
    </Button>
  );
}

export default CheckoutButton;
