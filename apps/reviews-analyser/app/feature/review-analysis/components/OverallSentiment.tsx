import { IoMdHappy, IoMdSad } from 'react-icons/io';
import { getSentimentColor } from '../utils';
import { MdOutlineSentimentNeutral } from 'react-icons/md';

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return <IoMdHappy className="w-8 h-8" />;
    case 'negative':
      return <IoMdSad className="w-8 h-8" />;
    case 'mixed':
      return <MdOutlineSentimentNeutral className="w-8 h-8" />;
    default:
      return <MdOutlineSentimentNeutral className="w-8 h-8" />;
  }
};

const OverallSentiment = ({ sentiment }: { sentiment: string }) => {
  return (
    <div
      className={`border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ${getSentimentColor(
        sentiment
      )}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/50 rounded-xl backdrop-blur-sm border-2 border-current/30">
            {getSentimentIcon(sentiment)}
          </div>
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider opacity-80 mb-1">
              Overall Sentiment
            </h3>
            <div className="text-2xl font-bold capitalize tracking-wide">
              {sentiment}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/30 rounded-full backdrop-blur-sm border border-current/20">
          <div className="w-3 h-3 rounded-full bg-current" />
          <span className="text-sm font-semibold">Analysis Complete</span>
        </div>
      </div>
    </div>
  );
};

export default OverallSentiment;
