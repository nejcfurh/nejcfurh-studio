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
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            background: 'var(--accent-tint)',
            borderColor: 'var(--accent-border)',
            color: 'var(--accent-light)'
          }}
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="text-white-100 mb-1.5 block text-sm font-medium"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="form-input"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-white-100 mb-1.5 block text-sm font-medium"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-accent w-full cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_25px_var(--accent-glow)] active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
