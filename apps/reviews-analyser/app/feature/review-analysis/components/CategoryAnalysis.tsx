import { TbCategory2 } from 'react-icons/tb';

import { getCategoryIcon, getSentimentColor } from '../utils';
import CustomIcon from './CustomIcon';

const CategoryAnalysis = ({
  categories
}: {
  categories: Record<string, string>;
}) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="rounded-full bg-indigo-500 p-2 shadow-sm">
          <TbCategory2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Category Analysis</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(categories).map(([category, rating]) => (
          <div
            key={category}
            className={`group cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-md ${getSentimentColor(
              rating
            )}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold capitalize">
                {category.replaceAll('_', ' ')}
              </span>
              <div className="flex items-center gap-2 rounded-full border border-current/20 bg-white/50 px-3 py-1 backdrop-blur-sm transition-colors group-hover:bg-white/70">
                <span className="text-xl">
                  <CustomIcon name={getCategoryIcon(rating)} />
                </span>
                <span className="text-sm font-bold tracking-wide capitalize">
                  {rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryAnalysis;
