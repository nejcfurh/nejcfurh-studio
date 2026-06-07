import { SCHEDULE_DATA } from '@/features/smooth-scroll/constants';
import type { ScheduleItemType } from '@/features/smooth-scroll/types';
import { AnimatedTitle } from '@repo/ui/animation/core';

import ScheduleItem from './ScheduleItem';

const Schedule = () => {
  return (
    <section
      id="launch-schedule"
      className="mx-auto max-w-5xl px-4 py-24 text-white sm:py-48"
    >
      <AnimatedTitle className="mb-10 text-2xl font-black text-zinc-50 uppercase sm:mb-20 sm:text-4xl">
        Launch Schedule
      </AnimatedTitle>
      {SCHEDULE_DATA.map((item: ScheduleItemType) => (
        <ScheduleItem
          key={item.title}
          title={item.title}
          location={item.location}
          date={item.date}
        />
      ))}
    </section>
  );
};

export default Schedule;
