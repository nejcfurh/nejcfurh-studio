import { INFINITE_SCROLL_TRANSITION_DATA } from './constants';
import { InfiniteScrollTransitionData } from './types';

export const getProjectDataBySlug = (
  slug: string
): InfiniteScrollTransitionData | undefined => {
  return INFINITE_SCROLL_TRANSITION_DATA.find(
    (project) => project.slug === slug
  );
};

export const getNextProjectData = (
  currentSlug: string
): InfiniteScrollTransitionData | undefined => {
  const currentIndex = INFINITE_SCROLL_TRANSITION_DATA.findIndex(
    (project) => project.slug === currentSlug
  );

  if (currentIndex === -1) {
    return undefined;
  }

  const nextIndex = (currentIndex + 1) % INFINITE_SCROLL_TRANSITION_DATA.length;

  return INFINITE_SCROLL_TRANSITION_DATA[nextIndex];
};
