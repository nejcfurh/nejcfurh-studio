const PredictiveTextInputFooter = () => {
  return (
    <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-500">
      Inspired by{' '}
      <a
        href="https://matthuggins.com/blog/posts/building-a-predictive-text-input-in-react"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-blue-600"
      >
        Matt Huggins
      </a>
    </div>
  );
};

export default PredictiveTextInputFooter;
