import type { HTMLMotionProps } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';

import useMeasure from '../hooks/useMeasure';

type AnimatedContainerProps = Omit<HTMLMotionProps<'div'>, 'animate'> & {
  children: React.ReactNode;
  /**
   * APPLIED TO THE INNER, MEASURED DIV. USE IT TO MAKE THAT DIV CONTENT-SIZED
   * (E.G. `w-max whitespace-nowrap`) WHEN YOU WANT WIDTH TO ANIMATE — A PLAIN
   * BLOCK DIV FILLS ITS PARENT, SO ITS WIDTH NEVER CHANGES.
   */
  contentClassName?: string;
};

/**
 * WRAPS ITS CHILDREN IN A MOTION DIV WHOSE WIDTH/HEIGHT ANIMATE TO THE MEASURED
 * BOUNDS OF THE CONTENT. THE INNER DIV IS ALWAYS RENDERED SO THE RESIZE OBSERVER
 * CAN MEASURE IT — WE FALL BACK TO `auto` UNTIL THE FIRST MEASUREMENT LANDS.
 *
 * THE ANIMATION TRANSITION IS INHERITED FROM ANY SURROUNDING `MotionConfig`.
 */
const AnimatedContainer = ({
  children,
  contentClassName,
  ...props
}: AnimatedContainerProps) => {
  const [ref, bounds] = useMeasure();

  const { width, height } = bounds;

  return (
    <AnimatedDiv
      animate={{ width: width || 'auto', height: height || 'auto' }}
      {...props}
    >
      <div ref={ref} className={contentClassName}>
        {children}
      </div>
    </AnimatedDiv>
  );
};

export default AnimatedContainer;
