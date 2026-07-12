'use client';

import Spinner from '@/components/Spinner';
import { GoogleOAuthButton } from '@/features/auth/components/GoogleOAuthButton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  authItemVariants,
  authStaggerVariants
} from '@/features/auth/utils/auth-motion';
import { getFirebaseErrorMessage } from '@/features/auth/utils/firebase-errors';
import {
  AnimatedDiv,
  AnimatedSection,
  AnimatedSpan,
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
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const isSafeRedirectPath = (path: string | null): path is string =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const redirectTo = isSafeRedirectPath(nextParam) ? nextParam : '/';
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [pending, setPending] = useState<'email' | 'google' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setPending('email');
    try {
      await signInWithEmail(formData.email, formData.password);
      toast.success('Welcome back!');
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
      setPending(null);
    }
  };

  const handleGoogle = async () => {
    if (pending) return;
    setPending('google');
    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
      setPending(null);
    }
  };

  return (
    <AnimatedSection className="bg-background grid h-[calc(100svh-4rem)] w-full lg:grid-cols-2">
      <AnimatedDiv className="relative hidden lg:block">
        <Image
          src="/images/login-image.jpg"
          alt="Login"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0"
          className="object-cover"
        />
      </AnimatedDiv>

      <AnimatedDiv className="flex h-full w-full items-center justify-center p-6 sm:p-10">
        <AnimatedDiv
          variants={authStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-lg flex-col gap-10"
        >
          <AnimatedDiv
            variants={authItemVariants}
            className="flex flex-col gap-3"
          >
            <AnimatedTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Welcome back
            </AnimatedTitle>
            <AnimatedText className="text-muted-foreground text-base sm:text-lg">
              Enter your email and password to access your account.
            </AnimatedText>
          </AnimatedDiv>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AnimatedDiv
              variants={authItemVariants}
              className="flex h-20 flex-col gap-2.5"
            >
              <Label htmlFor="email" className="text-base">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={pending !== null}
                className="h-12 min-h-12 px-4 text-base md:text-base"
              />
            </AnimatedDiv>

            <AnimatedDiv
              variants={authItemVariants}
              className="flex h-20 flex-col gap-2.5"
            >
              <AnimatedDiv className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <Link
                  href="/auth/password-reset"
                  className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </AnimatedDiv>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={pending !== null}
                className="h-12 min-h-12 px-4 text-base md:text-base"
              />
            </AnimatedDiv>

            <AnimatedDiv variants={authItemVariants}>
              <Button
                type="submit"
                disabled={pending !== null}
                className="h-12 w-full text-base"
              >
                {pending === 'email' ? 'Signing in' : 'Sign in'}
                {pending === 'email' && <Loader2 className="animate-spin" />}
              </Button>
            </AnimatedDiv>

            <AnimatedDiv
              variants={authItemVariants}
              className="flex items-center gap-4"
            >
              <AnimatedSpan className="bg-border h-px flex-1" />
              <AnimatedSpan className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Or
              </AnimatedSpan>
              <AnimatedSpan className="bg-border h-px flex-1" />
            </AnimatedDiv>

            <AnimatedDiv variants={authItemVariants}>
              <GoogleOAuthButton
                onClick={handleGoogle}
                loading={pending === 'google'}
                disabled={pending !== null}
              />
            </AnimatedDiv>
          </form>

          <AnimatedText
            variants={authItemVariants}
            className="text-muted-foreground text-center text-base"
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </AnimatedText>
        </AnimatedDiv>
      </AnimatedDiv>
    </AnimatedSection>
  );
};

const LoginPage = () => (
  <Suspense
    fallback={
      <AnimatedSection className="bg-background flex h-[calc(100svh-4rem)] w-full items-center justify-center">
        <Spinner size={64} />
      </AnimatedSection>
    }
  >
    <LoginForm />
  </Suspense>
);

export default LoginPage;
