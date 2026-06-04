'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const SignOutButton = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    try {
      await signOut();
      toast.success('Signed out.');
      router.push('/');
      router.refresh();
    } catch {
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
