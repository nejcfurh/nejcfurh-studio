'use client';

import Button from '@/components/admin/ui/Button';
import Heading from '@/components/admin/ui/Heading';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <>
      <main className="flex h-screen items-center justify-center bg-[var(--color-grey-50)] p-12">
        <div className="flex-[0_1_60rem] rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)] p-12 text-center [&_h1]:mb-4 [&_p]:mb-8 [&_p]:font-['Sono'] [&_p]:text-[var(--color-grey-500)]">
          <Heading as="h1">Something went wrong!</Heading>
          <p>{error.message}</p>
          <Button $size="large" onClick={resetErrorBoundary}>
            Try again!
          </Button>
        </div>
      </main>
    </>
  );
}

export default ErrorFallback;
