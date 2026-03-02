import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRightIcon } from 'lucide-react';

const Header = () => {
  return (
    <div className="relative z-10 border-b py-4 bg-gray-50">
      <div className="container mx-auto justify-between flex items-center px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/n-drive-logo.png"
            alt="nDrive"
            width={30}
            height={30}
            className="object-contain border-2 border-gray-200 rounded-full p-1"
          />
          <span className="text-2xl font-semibold font-mono">nDRIVE</span>
        </Link>

        <div className="flex items-center gap-2">
          <SignedIn>
            <Link href="/dashboard/files">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </SignedIn>

          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <Button variant="outline">
              <SignInButton mode="modal">
                <div className="flex items-center gap-2">
                  Sign in
                  <ArrowRightIcon className="size-5 md:size-6" />
                </div>
              </SignInButton>
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Header;
