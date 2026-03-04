import { auth } from '@/auth';
import { logoutAction } from '@/lib/actions/auth';
import { LogOut, PenLine } from 'lucide-react';
import Link from 'next/link';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-border sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Blog.dev
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/compose"
                className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              >
                <PenLine size={16} />
                Write
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="border-border text-muted hover:bg-surface inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="border-border hover:bg-surface inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
