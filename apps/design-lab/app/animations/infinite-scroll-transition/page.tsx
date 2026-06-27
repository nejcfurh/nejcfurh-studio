'use client';

import Project from '@/features/infinite-scroll-transition/components/Project';
import { INFINITE_SCROLL_TRANSITION_DATA } from '@/features/infinite-scroll-transition/constants';
import { getNextProjectData } from '@/features/infinite-scroll-transition/utils';

const InfiniteScrollTransitionPage = () => {
  const firstProject = INFINITE_SCROLL_TRANSITION_DATA[0];

  const nextProject = getNextProjectData(firstProject.slug);

  if (!firstProject || !nextProject) {
    return null;
  }

  return (
    <main id="infinite-scroll-transition">
      <Project project={firstProject} nextProject={nextProject} />
    </main>
  );
};

export default InfiniteScrollTransitionPage;
