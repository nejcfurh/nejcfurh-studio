import type { IPost } from '@/lib/models/post';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import DeletePostButton from './DeletePostButton';

interface PostListProps {
  posts: IPost[];
  isAdmin?: boolean;
}

export default function PostList({ posts, isAdmin }: PostListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        return (
          <article
            key={post._id as string}
            className="group border-border relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-lg"
          >
            {/* Image area */}
            {post.imageLink ? (
              <Link
                href={`/posts/${post._id}`}
                className="bg-surface aspect-[16/10] overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageLink}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            ) : (
              <Link
                href={`/posts/${post._id}`}
                className="bg-accent flex aspect-[16/10] items-center justify-center"
              >
                <span className="text-accent-foreground text-4xl font-bold opacity-20">
                  {post.title.charAt(0).toUpperCase()}
                </span>
              </Link>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              <div className="text-muted mb-3 flex items-center gap-2 text-xs">
                <span className="font-medium tracking-wider uppercase">
                  {post.author}
                </span>
                <span className="text-border">|</span>
                <time>{formattedDate}</time>
              </div>

              <Link href={`/posts/${post._id}`}>
                <h3 className="group-hover:text-muted text-lg leading-snug font-semibold transition-colors">
                  {post.title.length > 60
                    ? post.title.substring(0, 60) + '...'
                    : post.title}
                </h3>
              </Link>

              <p className="text-muted mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">
                {post.content}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/posts/${post._id}`}
                  className="hover:text-muted inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                >
                  Read more
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                {isAdmin && <DeletePostButton postId={post._id as string} />}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
