import { getCategoryIcon, getSentimentColor } from '../utils';
import CustomIcon from './CustomIcon';
import { TbCategory2 } from 'react-icons/tb';

const CategoryAnalysis = ({
  categories,
}: {
  categories: Record<string, string>;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6 justify-center">
        <div className="p-2 bg-indigo-500 rounded-full shadow-sm">
          <TbCategory2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Category Analysis</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(categories).map(([category, rating]) => (
          <div
            key={category}
            className={`group p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${getSentimentColor(
              rating
            )}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold capitalize text-base">
                {category.replaceAll('_', ' ')}
              </span>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full backdrop-blur-sm border border-current/20 group-hover:bg-white/70 transition-colors">
                <span className="text-xl">
                  <CustomIcon name={getCategoryIcon(rating)} />
                </span>
                <span className="text-sm font-bold capitalize tracking-wide">
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
