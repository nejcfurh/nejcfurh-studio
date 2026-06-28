'use client';

import type { IPost } from '@/lib/models/post';
import { cardItem, fadeIn, viewportOnce } from '@/utils/motion';
import { useReducedMotion } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { JSX } from 'react';

import PostCard from './PostCard';

interface PostGridProps {
  posts: IPost[];
  isAdmin?: boolean;
  /** DELAY (S) BEFORE THE ENTRANCE STAGGER BEGINS ONCE IN VIEW. */
  delay?: number;
}

const PostGrid = ({
  posts,
  isAdmin,
  delay = 0
}: PostGridProps): JSX.Element => {
  const reduce = useReducedMotion();

  const container = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay } } }
    : {
        hidden: {},
        visible: { transition: { delayChildren: delay, staggerChildren: 0.1 } }
      };

  return (
    <AnimatedDiv
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={container}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <AnimatedDiv
          key={post._id as string}
          variants={reduce ? fadeIn : cardItem}
          className="h-full"
        >
          <PostCard post={post} isAdmin={isAdmin} active />
        </AnimatedDiv>
      ))}
    </AnimatedDiv>
  );
};

export default PostGrid;
