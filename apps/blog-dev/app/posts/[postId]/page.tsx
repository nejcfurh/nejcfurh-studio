import PostContent from '@/components/PostContent';
import { connectDB } from '@/lib/db';
import type { IPost } from '@/lib/models/post';
import { Post } from '@/lib/models/post';
import Image from 'next/image';
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
        <div className="glass-card p-6 text-center">
          <p className="text-accent-light font-medium">
            Could not connect to the database.
          </p>
          <p className="text-secondary mt-1 text-sm">
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
      {/* COVER IMAGE */}
      {post.imageLink && (
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <Image
            src={post.imageLink}
            alt={post.title}
            width={1000}
            height={1000}
            className="aspect-2/1 w-full rounded-2xl object-cover ring-1 ring-(--card-border)"
          />
        </div>
      )}

      {/* POST CONTENT */}
      <PostContent
        title={post.title}
        author={post.author}
        content={post.content}
        formattedDate={formattedDate}
      />
    </article>
  );
}
