import { getCurrentUser } from '@/features/auth/utils/get-current-user';
import { CreateListingForm } from '@/features/listings/components/CreateListingForm';
import { redirect } from 'next/navigation';

const CreateListingPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-10 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Create a Listing
        </h1>
        <p className="text-muted-foreground">Tell us about your property.</p>
      </div>

      <CreateListingForm />
    </section>
  );
};

export default CreateListingPage;
