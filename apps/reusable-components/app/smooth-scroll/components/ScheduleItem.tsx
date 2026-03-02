'use client';

import { motion } from 'motion/react';
import { FiMapPin } from 'react-icons/fi';

const ScheduleItem = ({
  title,
  location,
  date,
}: {
  title: string;
  location: string;
  date: string;
}) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 pb-9 last:border-b-0 px-3"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm text-zinc-500 uppercase">{date}</p>
      </div>
      <div className="flex items-center gap-2 text-end text-sm uppercase text-zinc-500">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};

export default ScheduleItem;
