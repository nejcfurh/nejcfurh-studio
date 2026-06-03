import { EditableProfileForm } from '@/features/auth/components/EditableProfileForm';
import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { getCurrentUser } from '@/features/auth/utils/get-current-user';
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

  const providerLabel = user.provider
    ? (PROVIDER_LABELS[user.provider] ?? user.provider)
    : 'Unknown';

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-10 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Your profile</h1>
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
    </section>
  );
};

export default ProfilePage;
