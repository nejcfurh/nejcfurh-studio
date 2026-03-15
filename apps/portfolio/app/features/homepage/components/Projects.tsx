'use client';

import { motion } from 'framer-motion';
import { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import SectionHeading from '@/app/components/SectionHeading';
import { projects } from '../constants';

interface ProjectCardProps {
  project: (typeof projects)[0];
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="project-card glass-card overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-[220px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="project-card-image object-cover"
        />
        {/* Hover overlay */}
        {(project.source_code_link || project.link) && (
          <div className="project-card-overlay absolute inset-0 bg-primary/10 backdrop-blur-xs flex items-center justify-center gap-4">
            {project.source_code_link && (
              <Link
                href={project.source_code_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/75 transition-colors ease-out duration-300"
              >
                <Github size={20} className="text-white-100" />
              </Link>
            )}
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/75 transition-colors ease-out duration-300"
              >
                <ExternalLink size={20} className="text-white-100" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white-100 font-semibold text-lg">{project.name}</h3>
        <p className="text-secondary text-sm mt-2 leading-relaxed line-clamp-3">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag: { name: string; color: string }) => (
            <span key={tag.name} className="tag-pill">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = (): JSX.Element => {
  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -top-[150px] -left-[150px] absolute" />
      <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -bottom-[150px] -right-[150px] absolute" />
      <span className="hash-span">&nbsp;</span>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading label="My Work" title="Projects." />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-secondary max-w-2xl mb-16 leading-relaxed"
        >
          A showcase of my latest web development creations. Each project
          includes links to GitHub repositories{' '}
          <span className="italic">(if not private)</span> and live demos
          <span className="italic">(if available)</span>.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
