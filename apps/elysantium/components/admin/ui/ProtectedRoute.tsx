'use client';

import { useUser } from '@/components/admin/features/authentication/useUser';
import Spinner from '@/components/admin/ui/Spinner';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  //1. load the authenticated user
  const { isLoading, isAuthenticated, fetchStatus } = useUser();

  //2. If there is not authenticated user, redirect to /admin-login page
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading && fetchStatus !== 'fetching')
        router.push('/admin-login');
    },
    [isAuthenticated, isLoading, router, fetchStatus]
  );

  //3. While loading show a full-page spinner
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-grey-50)]">
        <Spinner />
      </div>
    );

  //4. If there is authenticated user, render the app
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
