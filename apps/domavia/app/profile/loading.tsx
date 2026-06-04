import Spinner from '@/components/Spinner';

const ProfileLoading = () => (
  <section className="flex h-[calc(100svh-4rem)] flex-col items-center justify-center gap-4">
    <Spinner size={100} className="mb-32" />
  </section>
);

export default ProfileLoading;
