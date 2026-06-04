'use client';

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
import { motion } from '@repo/ui/animation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const isSafeRedirectPath = (path: string | null): path is string =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

const RegisterPage = () => {
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
    <section className="bg-background grid h-[calc(100svh-4rem)] w-full lg:grid-cols-2">
      <div className="order-2 flex h-full w-full items-center justify-center p-6 sm:p-10 lg:order-1">
        <motion.div
          variants={authStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-lg flex-col gap-10"
        >
          <motion.div
            variants={authItemVariants}
            className="flex flex-col gap-3"
          >
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Create your account
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Start your search for the perfect place to call home.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <motion.div
              variants={authItemVariants}
              className="grid h-20 grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-2.5">
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
              </div>
              <div className="flex flex-col gap-2.5">
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
              </div>
            </motion.div>

            <motion.div
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
            </motion.div>

            <motion.div
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
            </motion.div>

            <motion.div
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
            </motion.div>

            <motion.div variants={authItemVariants}>
              <Button
                type="submit"
                disabled={pending !== null}
                className="h-12 w-full text-base"
              >
                {pending === 'email' ? 'Creating account' : 'Create account'}
                {pending === 'email' && <Loader2 className="animate-spin" />}
              </Button>
            </motion.div>

            <motion.div
              variants={authItemVariants}
              className="flex items-center gap-4"
            >
              <span className="bg-border h-px flex-1" />
              <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Or
              </span>
              <span className="bg-border h-px flex-1" />
            </motion.div>

            <motion.div variants={authItemVariants}>
              <GoogleOAuthButton
                label="Sign up with Google"
                onClick={handleGoogle}
                loading={pending === 'google'}
                disabled={pending !== null}
              />
            </motion.div>
          </form>

          <motion.p
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
          </motion.p>
        </motion.div>
      </div>

      <div className="relative order-1 hidden lg:order-2 lg:block">
        <Image
          src="/images/register-image.jpg"
          alt="Register"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0"
          className="object-cover"
        />
      </div>
    </section>
  );
};

export default RegisterPage;
