import { useEffect, useState } from 'react';

export const useDisplayCurrentTime = (): Date => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
};
