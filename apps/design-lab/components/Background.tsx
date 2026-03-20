import { cn } from '@/utils/utils';

const Background = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Background;
