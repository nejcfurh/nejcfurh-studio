export interface ScrollToDecryptSkeletonProps {
  enableScrollContent?: boolean;
  containerClassName?: string;
}

const ScrollToDecryptSkeleton: React.FC<ScrollToDecryptSkeletonProps> = ({
  enableScrollContent = false,
  containerClassName = ''
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {enableScrollContent && (
        <main className="flex min-h-screen w-full items-center justify-center px-4 font-mono uppercase sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl text-center">
            <div className="mx-auto h-8 w-3/4 animate-pulse rounded bg-gray-300 sm:h-10 md:h-12 dark:bg-gray-700"></div>
          </div>
        </main>
      )}
      <header className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center text-center">
          <div className="flex w-full items-center justify-center">
            <div className="w-full font-mono uppercase">
              {/* Title Skeleton */}
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8">
                <div className="h-12 w-full max-w-4xl animate-pulse rounded bg-gray-300 sm:h-16 md:h-20 lg:h-24 xl:h-28 dark:bg-gray-700"></div>
                {/* Subtitle Skeleton */}
                <div className="h-6 w-3/4 max-w-2xl animate-pulse rounded bg-gray-300 opacity-80 sm:h-8 md:h-10 lg:h-12 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {enableScrollContent && (
        <main className="flex min-h-screen w-full items-center justify-center px-4 font-mono uppercase sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl text-center">
            <div className="mx-auto h-8 w-3/4 animate-pulse rounded bg-gray-300 sm:h-10 md:h-12 dark:bg-gray-700"></div>
          </div>
        </main>
      )}
    </div>
  );
};

export default ScrollToDecryptSkeleton;
