import { cn } from '@/lib/utils';

type SpinnerProps = {
  size?: number;
  className?: string;
};

const Spinner = ({ size = 48, className }: SpinnerProps) => (
  <svg
    role="status"
    aria-label="Loading"
    width={size}
    height={size}
    viewBox="0 0 50 50"
    className={cn('animate-spin text-[#BF9D61]', className)}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.15"
      strokeWidth="5"
    />
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      pathLength="100"
      strokeDasharray="25 75"
    />
  </svg>
);

export default Spinner;
