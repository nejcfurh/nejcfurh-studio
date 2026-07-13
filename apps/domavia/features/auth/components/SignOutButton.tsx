'use client';

import { destroySessionAndRedirectHome } from '@/features/auth/actions/session';
import { firebaseAuth } from '@/lib/firebase/client';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/sonner';
import { Loader2, LogOut } from '@repo/ui/icons/lucide';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useState } from 'react';

const isNextRedirect = (err: unknown): boolean =>
  err !== null &&
  typeof err === 'object' &&
  'digest' in err &&
  typeof err.digest === 'string' &&
  err.digest.startsWith('NEXT_REDIRECT');

export const SignOutButton = () => {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    try {
      await firebaseSignOut(firebaseAuth);
      toast.success('Signed out successfully!');
      await destroySessionAndRedirectHome();
    } catch (err) {
      if (isNextRedirect(err)) {
        throw err;
      }
      toast.error('Failed to sign out. Please try again.');
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={pending}
      className="w-full"
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      {pending ? 'Signing out' : 'Sign out'}
    </Button>
  );
};
