import { auth } from '@/auth';
import LoginForm from '@/components/LoginForm';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();

  if (session) redirect('/compose');

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="text-muted mt-2 mb-8 text-sm">
        Admin access only. Sign in to create and manage posts.
      </p>
      <LoginForm />
    </div>
  );
}
