'use client';

import LoginForm from '@/components/admin/features/authentication/LoginForm';
import Heading from '@/components/admin/ui/Heading';
import Logo from '@/components/admin/ui/Logo';

function Login(): React.ReactElement {
  return (
    <main className="grid min-h-screen grid-cols-[30rem] content-center justify-center gap-8 bg-[var(--color-grey-50)]">
      <Logo />
      <Heading as="h4" className="font-thin">
        Log in to your account
      </Heading>
      <LoginForm />
    </main>
  );
}

export default Login;
