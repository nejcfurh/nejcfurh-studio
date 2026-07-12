import { IoChevronDownOutline } from '@repo/ui/icons/react-icons/io5';
import { cn } from '@repo/ui/utils';

/**
 * "Explore" scroll-down hint — a bouncing chevron indicating more content
 * below. Presentational only; wrap it in a link/button if it should navigate.
 */
const ScrollDownIndicator = ({
  label = 'Explore',
  className
}: {
  label?: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'flex flex-col items-center gap-1 text-white/60',
        className
      )}
    >
      <span className="text-xs tracking-[0.2em] uppercase">{label}</span>
      <IoChevronDownOutline className="animate-bounce text-3xl" />
    </span>
  );
};

export default ScrollDownIndicator;
