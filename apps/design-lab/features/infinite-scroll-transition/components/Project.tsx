import { InfiniteScrollTransitionData } from '../types';
import Experiments from './Experiments';
import Hero from './Hero';
import NextProject from './NextProject';

type ProjectProps = {
  project: InfiniteScrollTransitionData;
  nextProject?: InfiniteScrollTransitionData;
};

const Project = ({ project, nextProject }: ProjectProps) => {
  return (
    <>
      <Hero project={project} />
      <Experiments project={project} />
      {nextProject && <NextProject nextProject={nextProject} />}
    </>
  );
};

export default Project;
