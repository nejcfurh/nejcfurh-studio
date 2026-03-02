import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-linear-to-r from-violet-300/50 to-purple-100 blur-3xl w-100 h-175 rotate-[-60deg] transform -translate-x-40 dark:from-violet-900/50 dark:to-purple-900"></div>
          <div className="bg-linear-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl w-[1440px] h-200 rounded-fulls origin-top-left -rotate-12 -translate-x-60 dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70"></div>
        </div>

        <div className="relative z-10">
          <div className="max-w-340 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-4xl text-center mx-auto flex flex-col items-center gap-4">
              <Image
                src="/n-drive-logo.png"
                alt="nDrive"
                width={100}
                height={100}
              />
              <p className="inline-block text-lg font-medium bg-clip-text bg-linear-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
                nDrive: Secure file sharing made effortless
              </p>

              <div className="mt-8 max-w-5xl">
                <h1 className="font-semibold text-gray-800 text-5xl md:text-6xl dark:text-neutral-200">
                  Sharing files was never easier
                </h1>
              </div>

              <div className="mt-8 max-w-2xl">
                <p className="text-xl md:text-2xl text-gray-600 dark:text-neutral-400">
                  Upload, organize, and share files with your team. Secure cloud
                  storage accessible from anywhere.
                </p>
              </div>
              <div className="mt-12 gap-4 flex justify-center">
                <SignedIn>
                  <Link href="/dashboard/files">
                    <Button className="w-44 h-12 inline-flex items-center gap-x-3 text-base md:text-lg font-medium rounded-lg bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 ease-in-out cursor-pointer">
                      Dashboard <ArrowRightIcon className="size-5 md:size-6" />
                    </Button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Button className="py-6 px-8 inline-flex items-center gap-x-3 text-base md:text-lg font-medium rounded-lg bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 ease-in-out cursor-pointer">
                    <SignInButton mode="modal">
                      <div className="flex items-center gap-2">
                        Get started
                        <svg
                          className="shrink-0 size-5 md:size-6"
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
