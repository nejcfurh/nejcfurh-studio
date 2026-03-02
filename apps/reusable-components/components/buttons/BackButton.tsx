import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import { cn } from '@/utils/utils';

const BackButton = ({
  href = '/',
  className,
}: {
  href?: string;
  className: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'absolute top-5 left-5 bg-amber-50 z-10 p-4 rounded-full backdrop-blur-3xl hover:opacity-80 hover:scale-[1.10] transition-all duration-300 cursor-pointer',
        className
      )}
    >
      <IoArrowBack className="text-2xl text-black" />
    </Link>
  );
};

export default BackButton;
