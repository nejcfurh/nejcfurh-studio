export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-800 bg-green-50 border-green-200';
    case 'negative':
      return 'text-red-800 bg-red-50 border-red-200';
    case 'mixed':
      return 'text-yellow-800 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-800 bg-gray-50 border-gray-200';
  }
};

export const getCategoryIcon = (rating: string) => {
  switch (rating) {
    case 'good':
      return 'thumbs-up';
    case 'bad':
      return 'thumbs-down';
    case 'neutral':
      return 'minus';
    default:
      return 'minus';
  }
};
