import { connectDB } from '@/lib/db';
import type { IPost } from '@/lib/models/post';
import { Post } from '@/lib/models/post';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PostPage({
  params
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  try {
    await connectDB();
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800">
            Could not connect to the database.
          </p>
          <p className="mt-1 text-sm text-red-600">
            Please check your MONGODB_URI environment variable.
          </p>
        </div>
      </div>
    );
  }

  const raw = await Post.findById(postId).lean<{
    _id: unknown;
    title: string;
    content: string;
    date: number;
    author: string;
    imageLink: string;
  }>();

  if (!raw) notFound();

  const post: IPost = {
    _id: String(raw._id),
    title: raw.title as string,
    content: raw.content as string,
    date: raw.date as number,
    author: raw.author as string,
    imageLink: (raw.imageLink as string) || ''
  };

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article>
      {/* Cover image */}
      {post.imageLink && (
        <div className="mx-auto max-w-5xl px-6 pt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageLink}
            alt={post.title}
            className="aspect-[2/1] w-full rounded-2xl object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/"
          className="text-muted hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          Back to posts
        </Link>

        <div className="text-muted mb-6 flex items-center gap-3 text-sm">
          <span className="text-foreground font-semibold tracking-wider uppercase">
            {post.author.toUpperCase()}
          </span>
          <span className="bg-border h-1 w-1 rounded-full" />
          <time>{formattedDate}</time>
        </div>

        <h1 className="text-4xl leading-tight font-bold tracking-tight">
          {post.title}
        </h1>

        <div className="text-muted mt-8 text-lg leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </article>
  );
}
