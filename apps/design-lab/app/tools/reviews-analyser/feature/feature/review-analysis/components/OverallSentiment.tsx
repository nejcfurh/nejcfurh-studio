import { IoMdHappy, IoMdSad } from 'react-icons/io';
import { MdOutlineSentimentNeutral } from 'react-icons/md';

import { getSentimentColor } from '../utils';

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return <IoMdHappy className="h-8 w-8" />;
    case 'negative':
      return <IoMdSad className="h-8 w-8" />;
    case 'mixed':
      return <MdOutlineSentimentNeutral className="h-8 w-8" />;
    default:
      return <MdOutlineSentimentNeutral className="h-8 w-8" />;
  }
};

const OverallSentiment = ({ sentiment }: { sentiment: string }) => {
  return (
    <div
      className={`rounded-xl border-2 p-6 shadow-md transition-all duration-300 hover:shadow-xl ${getSentimentColor(
        sentiment
      )}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl border-2 border-current/30 bg-white/50 p-3 backdrop-blur-sm">
            {getSentimentIcon(sentiment)}
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium tracking-wider uppercase opacity-80">
              Overall Sentiment
            </h3>
            <div className="text-2xl font-bold tracking-wide capitalize">
              {sentiment}
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-current/20 bg-white/30 px-4 py-2 backdrop-blur-sm sm:flex">
          <div className="h-3 w-3 rounded-full bg-current" />
          <span className="text-sm font-semibold">Analysis Complete</span>
        </div>
      </div>
    </div>
  );
};

export default OverallSentiment;
