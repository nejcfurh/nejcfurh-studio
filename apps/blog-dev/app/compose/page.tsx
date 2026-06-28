import { auth } from '@/auth';
import ComposeForm from '@/components/ComposeForm';
import { redirect } from 'next/navigation';

export default async function ComposePage() {
  const session = await auth();

  if (!session) redirect('/login');

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
      <p className="text-secondary mb-4 font-mono text-sm tracking-[0.2em] uppercase">
        Compose
      </p>
      <h1 className="text-gradient-white text-3xl font-bold tracking-tight">
        Create a new post
      </h1>
      <p className="text-secondary mt-2 mb-10">
        Share your thoughts, tutorials, or insights with the community.
      </p>
      <ComposeForm />
    </div>
  );
}
