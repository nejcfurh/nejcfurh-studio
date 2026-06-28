import { auth } from '@/auth';
import ArchiveSection from '@/components/ArchiveSection';
import Hero from '@/components/Hero';
import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { connectDB } from '@/lib/db';
import type { IPost } from '@/lib/models/post';
import { Post } from '@/lib/models/post';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';

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
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.BLOG_DEV_HOMEPAGE
        }}
      />
      {/* HERO — TITLE + AUTOMATIC, INFINITE FEATURED CAROUSEL */}
      <Hero posts={serializedPosts} isAdmin={!!session} />

      {/* POSTS — ANIMATES IN WHEN SCROLLED INTO VIEW */}
      <ArchiveSection
        posts={serializedPosts}
        isAdmin={!!session}
        dbError={dbError}
      />
    </>
  );
}
