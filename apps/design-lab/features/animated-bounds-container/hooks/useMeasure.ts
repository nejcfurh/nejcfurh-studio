import { useCallback, useEffect, useState } from 'react';

// WE DO HAVE useMeasure hook in react-use-measure package, BUT THIS IS A CUSTOM HOOK THAT DOES THE SAME THING IN JUST A FEW LINES OF CODE, NO DEPENDENCY

const useMeasure = (): [
  (node: HTMLElement | null) => void,
  { width: number; height: number }
] => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
};

export default useMeasure;
