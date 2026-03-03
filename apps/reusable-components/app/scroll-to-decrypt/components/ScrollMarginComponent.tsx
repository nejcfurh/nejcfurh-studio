const ScrollMarginComponent = ({ text }: { text: string }) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 font-mono uppercase sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl text-center">
        <div className="animate-pulse text-xl opacity-60 sm:text-2xl md:text-3xl">
          {text}
        </div>
      </div>
    </main>
  );
};

export default ScrollMarginComponent;
