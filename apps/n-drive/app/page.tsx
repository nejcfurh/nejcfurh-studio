import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <div className="relative h-screen overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute start-1/2 -top-96 flex -translate-x-1/2 transform"
        >
          <div className="h-175 w-100 -translate-x-40 rotate-[-60deg] transform bg-linear-to-r from-violet-300/50 to-purple-100 blur-3xl dark:from-violet-900/50 dark:to-purple-900"></div>
          <div className="rounded-fulls h-200 w-[1440px] origin-top-left -translate-x-60 -rotate-12 bg-linear-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70"></div>
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-340 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
              <Image
                src="/n-drive-logo.png"
                alt="nDrive"
                width={100}
                height={100}
              />
              <p className="inline-block bg-linear-to-l from-blue-600 to-violet-500 bg-clip-text text-lg font-medium text-transparent dark:from-blue-400 dark:to-violet-400">
                nDrive: Secure file sharing made effortless
              </p>

              <div className="mt-8 max-w-5xl">
                <h1 className="text-5xl font-semibold text-gray-800 md:text-6xl dark:text-neutral-200">
                  Sharing files was never easier
                </h1>
              </div>

              <div className="mt-8 max-w-2xl">
                <p className="text-xl text-gray-600 md:text-2xl dark:text-neutral-400">
                  Upload, organize, and share files with your team. Secure cloud
                  storage accessible from anywhere.
                </p>
              </div>
              <div className="mt-12 flex justify-center gap-4">
                <SignedIn>
                  <Link href="/dashboard/files">
                    <Button className="inline-flex h-12 w-44 cursor-pointer items-center gap-x-3 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 text-base font-medium text-white transition-all duration-300 ease-in-out hover:opacity-90 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 md:text-lg">
                      Dashboard <ArrowRightIcon className="size-5 md:size-6" />
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Button className="inline-flex cursor-pointer items-center gap-x-3 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 px-8 py-6 text-base font-medium text-white transition-all duration-300 ease-in-out hover:opacity-90 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 md:text-lg">
                    <SignInButton mode="modal">
                      <div className="flex items-center gap-2">
                        Get started
                        <svg
                          className="size-5 shrink-0 md:size-6"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </SignInButton>
                  </Button>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
