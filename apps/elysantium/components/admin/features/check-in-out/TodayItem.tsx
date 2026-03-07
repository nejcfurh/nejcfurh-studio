'use client';

import CheckoutButton from '@/components/admin/features/check-in-out/CheckoutButton';
import { Flag } from '@/components/admin/ui/Flag';
import Tag from '@/components/admin/ui/Tag';
import Link from 'next/link';

interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
  country?: string;
}

interface Activity {
  id: number;
  status: string;
  guests: Guest;
  numNights: number;
}

interface TodayItemProps {
  activity: Activity;
}

function TodayItem({ activity }: TodayItemProps): React.ReactElement {
  const { id, status, guests, numNights } = activity;

  return (
    <li className="grid grid-cols-[9rem_2rem_1fr_7rem_9rem] items-center gap-3 border-b border-[var(--color-grey-100)] py-2 text-sm first:border-t first:border-t-[var(--color-grey-100)]">
      {status === 'unconfirmed' && <Tag type="green">Arriving</Tag>}
      {status === 'checked-in' && <Tag type="blue">Departing</Tag>}

      <Flag src={guests.countryFlag} alt={`Flag of ${guests.country}`} />
      <div className="font-medium">{guests.fullName}</div>
      <div>{numNights} nights</div>

      {status === 'unconfirmed' && (
        <Link
          href={`/admin/checkin/${id}`}
          className="cursor-pointer rounded-[var(--border-radius-sm)] border-none bg-[var(--color-brand-600)] px-2 py-1 text-center text-xs font-semibold text-[var(--color-brand-50)] uppercase shadow-[var(--shadow-sm)] hover:bg-[var(--color-brand-700)]"
        >
          Check in
        </Link>
      )}

      {status === 'checked-in' && <CheckoutButton bookingId={id} />}
    </li>
  );
}

export default TodayItem;
