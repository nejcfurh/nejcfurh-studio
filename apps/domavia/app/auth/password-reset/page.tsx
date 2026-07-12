'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  authItemVariants,
  authStaggerVariants
} from '@/features/auth/utils/auth-motion';
import { getFirebaseErrorMessage } from '@/features/auth/utils/firebase-errors';
import {
  AnimatedDiv,
  AnimatedSection,
  AnimatedText,
  AnimatedTitle
} from '@repo/ui/animation/core';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { toast } from '@repo/ui/components/sonner';
import { Loader2 } from '@repo/ui/icons/lucide';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
    <AnimatedSection className="relative h-[calc(100svh-4rem)] w-full overflow-hidden">
      <Image
        src="/images/forgot-password.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <AnimatedDiv className="absolute inset-0 bg-linear-to-br from-black/80 via-black/50 to-black/30" />

      <AnimatedDiv className="relative flex h-full w-full items-center justify-center p-6 sm:p-10">
        <AnimatedDiv
          variants={authStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-lg flex-col gap-10 rounded-2xl border border-white/15 bg-black/40 p-8 text-white shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <AnimatedDiv
            variants={authItemVariants}
            className="flex flex-col gap-3"
          >
            <AnimatedTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Forgot password?
            </AnimatedTitle>
            <AnimatedText className="text-base text-white/80 sm:text-lg">
              Enter the email tied to your account and we&apos;ll send you a
              reset link.
            </AnimatedText>
          </AnimatedDiv>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AnimatedDiv
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
            </AnimatedDiv>

            <AnimatedDiv variants={authItemVariants}>
              <Button
                type="submit"
                disabled={pending || sent}
                className="h-12 w-full bg-white text-base text-black hover:bg-white/90"
              >
                {pending ? 'Sending' : sent ? 'Link sent!' : 'Send reset link'}
                {pending && <Loader2 className="animate-spin" />}
              </Button>
            </AnimatedDiv>
          </form>

          <AnimatedText
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
          </AnimatedText>
        </AnimatedDiv>
      </AnimatedDiv>
    </AnimatedSection>
  );
};

export default PasswordResetPage;
