import AnimatedTitle from '@/components/animation-core/AnimatedTitle';
import ScheduleItem from './ScheduleItem';
import { SCHEDULE_DATA } from '@/features/smooth-scroll/constants';
import type { ScheduleItemType } from '@/features/smooth-scroll/types';

const Schedule = () => {
  return (
    <section
      id="launch-schedule"
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <AnimatedTitle className="mb-20 text-4xl font-black uppercase text-zinc-50">
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
