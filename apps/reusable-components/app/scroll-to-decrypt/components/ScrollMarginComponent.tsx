const ScrollMarginComponent = ({ text }: { text: string }) => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 font-mono uppercase">
      <div className="w-full max-w-7xl mx-auto text-center">
        <div className="text-xl sm:text-2xl md:text-3xl opacity-60 animate-pulse">
          {text}
        </div>
      </div>
    </main>
  );
};

export default ScrollMarginComponent;
