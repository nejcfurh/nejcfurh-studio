'use client';

import { loginAction } from '@/lib/actions/auth';
import { useActionState } from 'react';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await loginAction(formData);
    },
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="border-border bg-surface focus:border-accent w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border-border bg-surface focus:border-accent w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-accent text-accent-foreground w-full rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
