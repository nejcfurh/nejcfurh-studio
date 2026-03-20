import { ReactNode } from 'react';

const SectionTitle = ({
  children
}: {
  children: React.ReactNode;
}): ReactNode => {
  return (
    <h2 className="mt-10 mb-6 bg-linear-to-r from-white/90 to-white/60 bg-clip-text text-left text-2xl font-bold text-transparent sm:text-3xl">
      {children}
    </h2>
  );
};

export default SectionTitle;
