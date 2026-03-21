import { cn } from '@/utils/utils';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

const BackButton = ({
  href = '/',
  className
}: {
  href?: string;
  className: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'absolute top-5 left-5 z-10 cursor-pointer rounded-full bg-amber-50 p-4 backdrop-blur-3xl transition-all duration-300 hover:scale-[1.10] hover:opacity-80',
        className
      )}
    >
      <IoArrowBack className="text-2xl text-black" />
    </Link>
  );
};

export default BackButton;
