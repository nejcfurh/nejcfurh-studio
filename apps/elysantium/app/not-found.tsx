'use client';

import Heading from '@/components/admin/ui/Heading';
import { useRouter } from 'next/navigation';

function PageNotFound(): React.ReactElement {
  const router = useRouter();

  return (
    <main className="flex h-screen items-center justify-center bg-[var(--color-grey-50)] p-12">
      <div className="flex-[0_1_60rem] rounded-[var(--border-radius-md)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)] p-12 text-center [&_h1]:mb-8">
        <Heading as="h1">
          The page you are looking for could not be found
        </Heading>
        <button onClick={() => router.back()}>&larr; Go back</button>
      </div>
    </main>
  );
}

export default PageNotFound;
