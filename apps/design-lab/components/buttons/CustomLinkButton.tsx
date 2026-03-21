import { MainPageItem } from '@/utils/types';
import Link from 'next/link';
import { IoChevronForward } from 'react-icons/io5';

const CustomLinkButton = ({ name, path, icon, color }: MainPageItem) => {
  return (
    <Link
      key={path}
      href={path}
      className="group relative overflow-hidden rounded-2xl bg-white p-4 px-5 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-gray-300 dark:bg-gray-900 dark:ring-gray-800 dark:hover:ring-gray-700"
    >
      {/* GRADIENT BACKGROUND ON HOVER */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
      />

      {/* CONTENT */}
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
          <IoChevronForward className="size-8" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>
      </div>

      {/* BOTTOM BORDER GRADIENT */}
      <div
        className={`absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r ${color} transition-all duration-300 group-hover:w-full`}
      />
    </Link>
  );
};

export default CustomLinkButton;
