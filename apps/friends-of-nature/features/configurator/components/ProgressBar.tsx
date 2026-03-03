import { motion } from 'framer-motion';

type ProgressBarProps = {
  state: number | undefined;
};

const ProgressBar = ({ state }: ProgressBarProps): React.ReactNode => {
  const progress = state === 0 ? 50 : 100;

  return (
    <div className="h-[10px] w-full overflow-hidden rounded-[20px] bg-gray-200">
      <motion.div
        className="h-full rounded-[20px]"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          backgroundColor: state === 0 ? 'white' : '#3B9858'
        }}
      />
    </div>
  );
};

export default ProgressBar;
