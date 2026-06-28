'use client';

import { cn } from '@repo/ui/utils';

import EmptyState from '../components/EmptyState';
import useConversation from '../hooks/useConversation';

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <div
      className={cn('h-full lg:block lg:pl-80', isOpen ? 'block' : 'hidden')}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
