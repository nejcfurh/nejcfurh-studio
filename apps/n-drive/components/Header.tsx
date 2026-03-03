import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/nextjs';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from './ui/button';

const Header = () => {
  return (
    <div className="relative z-10 border-b bg-gray-50 py-4">
      <div className="container mx-auto flex items-center justify-between px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/n-drive-logo.png"
            alt="nDrive"
            width={30}
            height={30}
            className="rounded-full border-2 border-gray-200 object-contain p-1"
          />
          <span className="font-mono text-2xl font-semibold">nDRIVE</span>
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
