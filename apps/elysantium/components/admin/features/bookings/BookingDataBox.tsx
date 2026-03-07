'use client';

import DataItem from '@/components/admin/ui/DataItem';
import { Flag } from '@/components/admin/ui/Flag';
import { formatCurrency, formatDistanceFromNow } from '@/lib/utils/helpers';
import { format, isToday } from 'date-fns';
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern
} from 'react-icons/hi2';

interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
}

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  status: string;
  cabinPrice: number;
  extrasPrice: number;
  hasBreakfast: boolean;
  observations: string;
  isPaid: boolean;
  guests: Guest & { country?: string };
  cabins: Cabin;
}

interface BookingDataBoxProps {
  booking: Booking;
}

// A purely presentational component
function BookingDataBox({ booking }: BookingDataBoxProps): React.ReactElement {
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    guests: { fullName: guestName, email, country, countryFlag, nationalID },
    cabins: { name: cabinName }
  } = booking;

  return (
    <section className="overflow-hidden rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)]">
      <header className="flex items-center justify-between bg-[var(--color-brand-500)] px-10 py-5 text-lg font-medium text-[#e0e7ff] [&_svg]:h-8 [&_svg]:w-8">
        <div className="flex items-center gap-4 text-lg font-semibold">
          <HiOutlineHomeModern />
          <p>
            {numNights} nights in Cabin{' '}
            <span className="ml-1 font-[Sono] text-xl">{cabinName}</span>
          </p>
        </div>

        <p>
          {format(new Date(startDate), 'EEE, MMM dd yyyy')} (
          {isToday(new Date(startDate))
            ? 'Today'
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), 'EEE, MMM dd yyyy')}
        </p>
      </header>

      <section className="px-10 pt-8 pb-3">
        <div className="mb-4 flex items-center gap-3 text-[var(--color-grey-500)] [&_p:first-of-type]:font-medium [&_p:first-of-type]:text-[var(--color-grey-700)]">
          {countryFlag && <Flag src={countryFlag} alt={`Flag of ${country}`} />}
          <p>
            {guestName} {numGuests > 1 ? `+ ${numGuests - 1} guests` : ''}
          </p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <p>National ID {nationalID}</p>
        </div>

        {observations && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Observations"
          >
            {observations}
          </DataItem>
        )}

        <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
          {hasBreakfast ? 'Yes' : 'No'}
        </DataItem>

        <div
          className={`mt-6 flex items-center justify-between rounded-[var(--border-radius-sm)] px-8 py-4 [&_p:last-child]:text-sm [&_p:last-child]:font-semibold [&_p:last-child]:uppercase [&_svg]:h-6 [&_svg]:w-6 [&_svg]:!text-current ${
            isPaid
              ? 'bg-[var(--color-green-100)] text-[var(--color-green-700)]'
              : 'bg-[var(--color-yellow-100)] text-[var(--color-yellow-700)]'
          }`}
        >
          <DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
            {formatCurrency(totalPrice)}

            {hasBreakfast &&
              ` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
                extrasPrice
              )} breakfast)`}
          </DataItem>

          <p>{isPaid ? 'Paid' : 'Will pay at property'}</p>
        </div>
      </section>

      <footer className="px-10 py-4 text-right text-xs text-[var(--color-grey-500)]">
        <p>Booked {format(new Date(created_at), 'EEE, MMM dd yyyy, p')}</p>
      </footer>
    </section>
  );
}

export default BookingDataBox;
