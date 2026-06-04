import Image from 'next/image';
import Link from 'next/link';
import { GoDotFill } from 'react-icons/go';

const DomeraFooter = (): React.ReactNode => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-300 bg-gray-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-10 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3 lg:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/domera-logo.png"
                alt="Domera"
                width={32}
                height={32}
                className="h-auto object-contain"
              />
              <span className="mt-1 flex items-baseline font-sans text-2xl font-light text-[#BF9D61]">
                omera
                <span className="font-mono text-lg font-bold text-black">
                  <GoDotFill className="mt-1 inline-block size-3 p-0" />
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-sm text-gray-600">
              Find a house. Make it your home. Browse listings, contact
              landlords, and discover your next place — all in one spot.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-300 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Domera. All rights reserved. Created by{' '}
            <a
              href="https://github.com/nejcfurh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 hover:underline"
            >
              Nejc Furh
            </a>
            .
          </p>
          <p>
            Stock photography from{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:text-gray-900 hover:underline"
            >
              Unsplash
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DomeraFooter;
