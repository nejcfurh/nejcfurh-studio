'use client';

import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';
import Image from 'next/image';
import { Suspense, useState } from 'react';

import AuthForm from './components/AuthForm';

export default function Home() {
  const [register, setRegister] = useState(false);

  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.TWABBLR_HOMEPAGE
        }}
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="logo"
          height="300"
          width="300"
          className="pointer-events-none mx-auto mt-[-30px] w-auto scale-75 sm:scale-100"
          src="/images/twabblr.png"
        />
        <h2 className="mt-3 text-center text-xl font-semibold tracking-tight text-gray-900 sm:mt-6 sm:text-2xl">
          {register ? 'Register your account!' : 'Sign in to your account!'}
        </h2>
      </div>
      <Suspense>
        <AuthForm setRegister={setRegister} />
      </Suspense>
    </div>
  );
}
