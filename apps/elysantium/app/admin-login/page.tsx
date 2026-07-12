'use client';

import LoginForm from '@/components/admin/features/authentication/LoginForm';
import { IoArrowBack } from '@repo/ui/icons/react-icons/io5';
import Link from 'next/link';

function Login(): React.ReactElement {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-6">
      {/* ELEGANT HOTEL BACKDROP */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder-image.jpeg')" }}
      />
      <div className="absolute inset-0 bg-black/65" />

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-104 rounded-2xl bg-(--color-grey-0) px-10 py-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        <div className="mb-9 text-center">
          <h1 className="text-3xl font-light tracking-[0.35em] text-[#d4a954] uppercase">
            Elysantium
          </h1>
          <div className="mx-auto mt-4 h-px w-12 bg-linear-to-r from-transparent via-[#d4a954] to-transparent" />
          <p className="mt-5 text-sm tracking-wide text-(--color-grey-500)">
            Sign in to the management suite
          </p>
        </div>
        <LoginForm />

        <Link
          href="/"
          className="mt-2 flex w-full items-center justify-center gap-2 text-center text-sm font-light tracking-wide text-(--color-grey-500) transition-colors hover:text-(--color-grey-700)"
        >
          <IoArrowBack className="size-4" />
          Back to homepage
        </Link>
      </div>
    </main>
  );
}

export default Login;
