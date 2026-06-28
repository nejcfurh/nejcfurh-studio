'use client';

import type { IPost } from '@/lib/models/post';
import { easeOut, viewportOnce } from '@/utils/motion';
import { useReducedMotion } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { JSX } from 'react';

import PostGrid from './PostGrid';

interface ArchiveSectionProps {
  posts: IPost[];
  isAdmin?: boolean;
  dbError?: boolean;
}

// ARCHIVE ENTERS A TOUCH (0.6s) AFTER COMING INTO VIEW / AFTER THE HERO.
const ENTER_DELAY = 0.6;

const ArchiveSection = ({
  posts,
  isAdmin,
  dbError
}: ArchiveSectionProps): JSX.Element => {
  const reduce = useReducedMotion();

  const headingVariants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delay: ENTER_DELAY } }
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: easeOut, delay: ENTER_DELAY }
        }
      };

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 lg:px-12">
      {/* HEADING ANIMATES IN WHEN SCROLLED INTO VIEW. */}
      <AnimatedDiv
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={headingVariants}
        className="mb-12"
      >
        <p className="text-secondary mb-4 font-mono text-sm tracking-[0.2em] uppercase">
          The Archive
        </p>
        <h2 className="text-white-100 text-[32px] font-bold tracking-tight sm:text-[40px]">
          Latest posts
        </h2>
      </AnimatedDiv>

      {dbError ? (
        <div className="glass-card p-6 text-center">
          <p className="text-accent-light font-medium">
            Could not connect to the database.
          </p>
          <p className="text-secondary mt-1 text-sm">
            Please check your MONGODB_URI environment variable.
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white-100 text-lg font-medium">No posts yet</p>
          <p className="text-secondary mt-1 text-sm">
            Create your first post to get started.
          </p>
        </div>
      ) : (
        <PostGrid posts={posts} isAdmin={isAdmin} delay={ENTER_DELAY} />
      )}
    </section>
  );
};

export default ArchiveSection;
