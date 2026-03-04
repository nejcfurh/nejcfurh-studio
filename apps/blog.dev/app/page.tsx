import { auth } from '@/auth';
import PostList from '@/components/PostList';
import { connectDB } from '@/lib/db';
import type { IPost } from '@/lib/models/post';
import { Post } from '@/lib/models/post';

export default async function HomePage() {
  const session = await auth();
  let serializedPosts: IPost[] = [];
  let dbError = false;

  try {
    await connectDB();
    const posts = await Post.find({}).sort({ date: -1 }).lean();
    serializedPosts = posts.map((post) => ({
      _id: String(post._id),
      title: post.title as string,
      content: post.content as string,
      date: post.date as number,
      author: post.author as string,
      imageLink: (post.imageLink as string) || ''
    }));
  } catch {
    dbError = true;
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/blog-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-40">
          <h1 className="max-w-3xl text-6xl leading-tight font-bold tracking-tight text-white md:text-7xl">
            Blog.dev
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/80">
            A personal dev blog by Nejc Furh — software engineer building web
            apps with React, Next.js, Node.js, and TypeScript. Writing about
            code, projects, and lessons learned along the way.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-muted mb-8 text-sm font-semibold tracking-widest uppercase">
          Latest posts
        </h2>
        {dbError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-800">
              Could not connect to the database.
            </p>
            <p className="mt-1 text-sm text-red-600">
              Please check your MONGODB_URI environment variable.
            </p>
          </div>
        ) : serializedPosts.length === 0 ? (
          <div className="border-border bg-surface rounded-2xl border p-12 text-center">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-muted mt-1 text-sm">
              Create your first post to get started.
            </p>
          </div>
        ) : (
          <PostList posts={serializedPosts} isAdmin={!!session} />
        )}
      </section>
    </>
  );
}
