const TubesCursorAttribution = () => {
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 px-4 text-center text-xs text-gray-400 sm:text-sm">
      Tubes cursor by{' '}
      <a
        href="https://github.com/klevron/threejs-components"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto text-gray-300 underline-offset-2 hover:text-white hover:underline"
      >
        Kevin Levron
      </a>{' '}
      ·{' '}
      <a
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto text-gray-300 underline-offset-2 hover:text-white hover:underline"
      >
        CC BY-NC-SA 4.0
      </a>
    </div>
  );
};

export default TubesCursorAttribution;
