'use client';

import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Loader2 } from '@repo/ui/icons/lucide';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

const isSafeRedirectPath = (path: string | null): path is string =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const redirectTo = isSafeRedirectPath(nextParam) ? nextParam : '/';
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [pending, setPending] = useState<'email' | 'google' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setPending('email');
    const displayName = `${formData.firstName} ${formData.lastName}`.trim();
    try {
      await signUpWithEmail(displayName, formData.email, formData.password);
      toast.success('Account successfully created — welcome!');
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
      toast.success('Account successfully created — welcome!');
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
      setPending(null);
    }
  };

  return (
    <AnimatedSection className="bg-background grid h-full min-h-screen w-full lg:grid-cols-2">
      <AnimatedDiv className="order-2 flex h-full w-full items-center justify-center p-6 sm:p-10 lg:order-1">
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
              Create your account
            </AnimatedTitle>
            <AnimatedText className="text-muted-foreground text-base sm:text-lg">
              Start your search for the perfect place to call home.
            </AnimatedText>
          </AnimatedDiv>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AnimatedDiv
              variants={authItemVariants}
              className="grid h-20 grid-cols-2 gap-4"
            >
              <AnimatedDiv className="flex flex-col gap-2.5">
                <Label htmlFor="firstName" className="text-base">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={pending !== null}
                  className="h-12 min-h-12 px-4 text-base md:text-base"
                />
              </AnimatedDiv>
              <AnimatedDiv className="flex flex-col gap-2.5">
                <Label htmlFor="lastName" className="text-base">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={pending !== null}
                  className="h-12 min-h-12 px-4 text-base md:text-base"
                />
              </AnimatedDiv>
            </AnimatedDiv>

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
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={pending !== null}
                className="h-12 min-h-12 px-4 text-base md:text-base"
              />
            </AnimatedDiv>

            <AnimatedDiv
              variants={authItemVariants}
              className="flex h-20 flex-col gap-2.5"
            >
              <Label htmlFor="confirmPassword" className="text-base">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
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
                {pending === 'email' ? 'Creating account' : 'Create account'}
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
                label="Sign up with Google"
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
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </AnimatedText>
        </AnimatedDiv>
      </AnimatedDiv>

      <AnimatedDiv className="relative order-1 hidden lg:order-2 lg:block">
        <Image
          src="/images/register-image.jpg"
          alt="Register"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0"
          className="object-cover"
        />
      </AnimatedDiv>
    </AnimatedSection>
  );
};

const RegisterPage = () => (
  <Suspense
    fallback={
      <AnimatedSection className="bg-background flex h-[calc(100svh-4rem)] w-full items-center justify-center">
        <Spinner size={64} />
      </AnimatedSection>
    }
  >
    <RegisterForm />
  </Suspense>
);

export default RegisterPage;
