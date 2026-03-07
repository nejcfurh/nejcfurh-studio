'use client';

import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';
import Spinner from '@/components/admin/ui/Spinner';

import TodayItem from './TodayItem';
import { useTodayActivity } from './useTodayActivity';

function TodayActivity(): React.ReactElement {
  const { activities, isPendingTodayActivity } = useTodayActivity();

  return (
    <div className="col-[1/span_2] flex flex-col gap-6 rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)] p-8 pt-6">
      <Row type="horizontal">
        <Heading as="h2">Today Activities</Heading>
      </Row>

      {!isPendingTodayActivity ? (
        activities?.length && activities.length > 0 ? (
          <ul className="overflow-x-hidden overflow-y-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:!w-0">
            {activities.map((activity) => (
              <TodayItem activity={activity} key={activity.id} />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-center text-lg font-medium">
            No activity today!
          </p>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default TodayActivity;
