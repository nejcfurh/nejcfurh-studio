import SlidingStack from './SlidingStack';
import { JSX } from 'react';

const Tech = (): JSX.Element => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      <SlidingStack />
    </div>
  );
};

export default Tech;
