'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  authItemVariants,
  authStaggerVariants
} from '@/features/auth/utils/auth-motion';
import { getFirebaseErrorMessage } from '@/features/auth/utils/firebase-errors';
import { motion } from '@repo/ui/animation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

const PasswordResetPage = () => {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
      toast.success(`Reset link sent successfully.`);
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="relative h-[calc(100svh-4rem)] w-full overflow-hidden">
      <Image
        src="/images/forgot-password.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/50 to-black/30" />

      <div className="relative flex h-full w-full items-center justify-center p-6 sm:p-10">
        <motion.div
          variants={authStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-lg flex-col gap-10 rounded-2xl border border-white/15 bg-black/40 p-8 text-white shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <motion.div
            variants={authItemVariants}
            className="flex flex-col gap-3"
          >
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Forgot password?
            </h1>
            <p className="text-base text-white/80 sm:text-lg">
              Enter the email tied to your account and we&apos;ll send you a
              reset link.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <motion.div
              variants={authItemVariants}
              className="flex h-20 flex-col gap-2.5"
            >
              <Label htmlFor="email" className="text-base text-white">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={pending || sent}
                className="h-12 min-h-12 border-white/20 bg-white/10 px-4 text-base text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20 md:text-base"
              />
            </motion.div>

            <motion.div variants={authItemVariants}>
              <Button
                type="submit"
                disabled={pending || sent}
                className="h-12 w-full bg-white text-base text-black hover:bg-white/90"
              >
                {pending ? 'Sending' : sent ? 'Link sent!' : 'Send reset link'}
                {pending && <Loader2 className="animate-spin" />}
              </Button>
            </motion.div>
          </form>

          <motion.p
            variants={authItemVariants}
            className="text-center text-base text-white/70"
          >
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default PasswordResetPage;
