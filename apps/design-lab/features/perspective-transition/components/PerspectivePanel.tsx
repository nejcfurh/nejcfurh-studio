'use client';

import { MotionValue, useTransform } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { ReactNode } from 'react';

const PerspectivePanel = ({
  enter,
  leave,
  progress,
  children
}: {
  enter: [number, number] | null;
  leave: [number, number] | null;
  progress: MotionValue<number>;
  children: ReactNode;
}) => {
  const pts: number[] = [];
  const scaleKf: number[] = [];
  const rotateKf: number[] = [];

  if (enter) {
    pts.push(enter[0], enter[1]);
    scaleKf.push(0.8, 1);
    rotateKf.push(5, 0);
  } else {
    pts.push(0);
    scaleKf.push(1);
    rotateKf.push(0);
  }

  if (leave) {
    pts.push(leave[0], leave[1]);
    scaleKf.push(1, 0.8);
    rotateKf.push(0, -5);
  } else {
    pts.push(1);
    scaleKf.push(1);
    rotateKf.push(0);
  }

  const scale = useTransform(progress, pts, scaleKf);
  const rotate = useTransform(progress, pts, rotateKf);

  return (
    <AnimatedDiv
      style={{ scale, rotate }}
      className="sticky top-0 h-screen w-full overflow-hidden"
    >
      {children}
    </AnimatedDiv>
  );
};

export default PerspectivePanel;
