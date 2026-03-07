'use client';

import BookingDataBox from '@/components/admin/features/bookings/BookingDataBox';
import { useBooking } from '@/components/admin/features/bookings/useBooking';
import { useCheckin } from '@/components/admin/features/check-in-out/useCheckin';
import { useSettings } from '@/components/admin/features/settings/useSettings';
import Button from '@/components/admin/ui/Button';
import ButtonGroup from '@/components/admin/ui/ButtonGroup';
import ButtonText from '@/components/admin/ui/ButtonText';
import Checkbox from '@/components/admin/ui/Checkbox';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';
import Spinner from '@/components/admin/ui/Spinner';
import { useMoveBack } from '@/lib/hooks/useMoveBack';
import { formatCurrency } from '@/lib/utils/helpers';
import { useEffect, useState } from 'react';

function CheckinBooking(): React.ReactElement | null {
  const [confirmPaid, setConfirmPaid] = useState<boolean>(false);
  const [addBreakfast, setAddBreakfast] = useState<boolean>(false);

  const { booking, isLoading } = useBooking();
  const { checkin, isCheckingIn } = useCheckin();
  const { settings, isPending: isLoadingSettings } = useSettings();

  const bookingIsPaid = booking?.isPaid ?? false;
  useEffect(() => {
    setConfirmPaid(bookingIsPaid);
  }, [bookingIsPaid]);

  const moveBack = useMoveBack();

  if (isLoading || isLoadingSettings || isCheckingIn) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights
  } = booking!;

  const optionalBreakfastPrice =
    (settings?.breakfastPrice ?? 0) * numNights * numGuests;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice
        }
      });
    } else {
      checkin({ bookingId, breakfast: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking!} />

      {!hasBreakfast && (
        <div className="rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)] px-10 py-6">
          <Checkbox
            id="breakfast"
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </div>
      )}

      <div className="rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)] px-10 py-6">
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          id="confirm"
          disabled={confirmPaid || isCheckingIn}
        >
          I confirm that {guests.fullName} has paid the total amount{' '}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(totalPrice + optionalBreakfastPrice)}
              (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )})`}
        </Checkbox>
      </div>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
