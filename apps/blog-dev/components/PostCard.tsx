'use client';

import type { IPost } from '@/lib/models/post';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

import DeletePostButton from './DeletePostButton';

interface PostCardProps {
  post: IPost;
  isAdmin?: boolean;
  /** WHETHER THIS CARD IS THE ACTIVE/CENTERED CARD (ONLY IT IS INTERACTIVE). */
  active: boolean;
}

const formatDate = (date: number): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

const PostCard = ({ post, isAdmin, active }: PostCardProps): JSX.Element => {
  const href = `/posts/${post._id}`;
  const title =
    post.title.length > 60 ? post.title.substring(0, 60) + '...' : post.title;

  return (
    <article
      className="glass-card group relative flex h-full flex-col overflow-hidden"
      aria-hidden={!active}
    >
      {/* IMAGE AREA */}
      {post.imageLink ? (
        <Link
          href={href}
          tabIndex={active ? undefined : -1}
          className={`aspect-16/10 overflow-hidden ${active ? '' : 'pointer-events-none'}`}
        >
          <Image
            src={post.imageLink}
            alt={post.title}
            width={1000}
            height={1000}
            draggable={false}
            // Cards render at ~340px (carousel) up to a third of the grid; tell
            // Next so it serves a right-sized image instead of the full 1000px
            // source — a big mobile download/decode win.
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
            className="project-card-image h-full w-full object-cover"
          />
        </Link>
      ) : (
        <Link
          href={href}
          tabIndex={active ? undefined : -1}
          className={`bg-tertiary flex aspect-16/10 items-center justify-center ${active ? '' : 'pointer-events-none'}`}
        >
          <span className="text-gradient-accent text-5xl font-bold">
            {post.title.charAt(0).toUpperCase()}
          </span>
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="text-secondary mb-3 flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
          <span>{post.author}</span>
          <span className="opacity-40">/</span>
          <time>{formatDate(post.date)}</time>
        </div>

        <Link
          href={href}
          tabIndex={active ? undefined : -1}
          className={active ? '' : 'pointer-events-none'}
        >
          <h3 className="text-white-100 group-hover:text-accent text-lg leading-snug font-semibold transition-colors duration-300">
            {title}
          </h3>
        </Link>

        <p className="text-secondary mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">
          {post.content}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={href}
            tabIndex={active ? undefined : -1}
            className={`text-white-100 hover:text-accent inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${active ? '' : 'pointer-events-none'}`}
          >
            Read more
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
          {isAdmin && active && (
            <DeletePostButton postId={post._id as string} />
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
