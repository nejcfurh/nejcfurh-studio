import Image from 'next/image';
import Link from 'next/link';

const DomaviaFooter = (): React.ReactNode => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-300 bg-gray-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-10 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3 lg:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/logo.svg"
                alt="Domavia"
                width={200}
                height={200}
                className="ml-[-10] h-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm text-gray-600">
              Find a house. Make it your home. Browse listings, contact
              landlords, and discover your next place — all in one spot.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-300 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Domavia. All rights reserved. Created by{' '}
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

export default DomaviaFooter;
