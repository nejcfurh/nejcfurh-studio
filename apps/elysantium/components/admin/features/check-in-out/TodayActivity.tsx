'use client';

import { dashboardItem } from '@/components/admin/features/dashboard/motion';
import Heading from '@/components/admin/ui/Heading';
import Row from '@/components/admin/ui/Row';
import Spinner from '@/components/admin/ui/Spinner';
import { AnimatedDiv } from '@repo/ui/animation/core';

import TodayItem from './TodayItem';
import { useTodayActivity } from './useTodayActivity';

function TodayActivity(): React.ReactElement {
  const { activities, isPendingTodayActivity } = useTodayActivity();

  return (
    <AnimatedDiv
      variants={dashboardItem}
      className="col-[1/span_2] flex flex-col gap-6 rounded-(--border-radius-md) border border-(--color-grey-100) bg-(--color-grey-0) p-8 pt-6 shadow-(--shadow-card)"
    >
      <Row type="horizontal">
        <Heading
          as="h2"
          className="flex items-center gap-3 before:h-5 before:w-1 before:rounded-full before:bg-(--color-brand-500) before:content-['']"
        >
          Today Activities
        </Heading>
      </Row>

      {!isPendingTodayActivity ? (
        activities?.length && activities.length > 0 ? (
          <ul className="overflow-x-hidden overflow-y-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:w-0!">
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
    </AnimatedDiv>
  );
}

export default TodayActivity;
