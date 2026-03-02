export interface ScrollToDecryptSkeletonProps {
  enableScrollContent?: boolean;
  containerClassName?: string;
}

const ScrollToDecryptSkeleton: React.FC<ScrollToDecryptSkeletonProps> = ({
  enableScrollContent = false,
  containerClassName = '',
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {enableScrollContent && (
        <main className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 font-mono uppercase">
          <div className="w-full max-w-7xl mx-auto text-center">
            <div className="h-8 sm:h-10 md:h-12 w-3/4 mx-auto bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
        </main>
      )}
      <header className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-center">
            <div className="font-mono uppercase w-full">
              {/* Title Skeleton */}
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8">
                <div className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 w-full max-w-4xl bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                {/* Subtitle Skeleton */}
                <div className="h-6 sm:h-8 md:h-10 lg:h-12 w-3/4 max-w-2xl bg-gray-300 dark:bg-gray-700 animate-pulse rounded opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {enableScrollContent && (
        <main className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 font-mono uppercase">
          <div className="w-full max-w-7xl mx-auto text-center">
            <div className="h-8 sm:h-10 md:h-12 w-3/4 mx-auto bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
        </main>
      )}
    </div>
  );
};

export default ScrollToDecryptSkeleton;
