'use client';

import Project from '@/features/infinite-scroll-transition/components/Project';
import {
  getNextProjectData,
  getProjectDataBySlug
} from '@/features/infinite-scroll-transition/utils';
import { notFound, useParams } from 'next/navigation';

const InfiniteScrollTransitionSlugPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const project = getProjectDataBySlug(slug);

  if (!project) {
    return notFound();
  }

  const nextProject = getNextProjectData(project.slug);

  return (
    <main id="infinite-scroll-transition">
      <Project project={project} nextProject={nextProject} />
    </main>
  );
};

export default InfiniteScrollTransitionSlugPage;
