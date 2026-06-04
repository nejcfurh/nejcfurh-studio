import { Button } from '@/components/ui/button';
import { EditableProfileForm } from '@/features/auth/components/EditableProfileForm';
import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { getCurrentUser } from '@/features/auth/utils/get-current-user';
import { ListingItem } from '@/features/listings/components/ListingItem';
import { getUserListings } from '@/features/listings/utils/get-user-listings';
import { Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const formatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long'
});

const PROVIDER_LABELS: Record<string, string> = {
  password: 'Email & Password',
  'google.com': 'Google'
};

const ProfilePage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const listings = await getUserListings(user.uid);

  const providerLabel = user.provider
    ? (PROVIDER_LABELS[user.provider] ?? user.provider)
    : 'Unknown';

  return (
    <section className="grid w-full lg:h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="flex justify-center px-6 py-10 sm:px-10 sm:py-16 lg:overflow-y-auto">
        <div className="flex w-full max-w-xl flex-col gap-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Your profile
            </h1>
            <p className="text-muted-foreground">
              Update your account details and profile photo.
            </p>
          </div>

          <EditableProfileForm
            initialDisplayName={user.displayName}
            initialEmail={user.email}
            initialPhotoURL={user.photoURL}
            provider={user.provider}
          />

          <dl className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground text-sm">Sign-in method</dt>
              <dd className="font-medium">{providerLabel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Member since</dt>
              <dd className="font-medium">
                {user.createdAt ? formatter.format(user.createdAt) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Last sign-in</dt>
              <dd className="font-medium">
                {user.lastSignInAt ? formatter.format(user.lastSignInAt) : '—'}
              </dd>
            </div>
          </dl>

          <SignOutButton />
        </div>
      </div>

      <div className="relative min-h-[480px] lg:min-h-0">
        <Image
          src="/images/my-listings.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="relative flex h-full flex-col gap-10 px-6 py-10 sm:px-10 sm:py-16 lg:overflow-y-auto">
          <div className="flex flex-col items-center gap-2 text-center text-white">
            <h1 className="text-3xl font-semibold tracking-tight">
              My Listings
            </h1>
            <p className="text-white/80">Browse your listings.</p>
          </div>

          <Button
            asChild
            className="h-12 self-center bg-white px-8! text-base text-black hover:bg-white/90"
          >
            <Link href="/create-listing">
              <Home />
              Sell or rent your home
            </Link>
          </Button>

          {listings.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
