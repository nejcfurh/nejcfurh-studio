'use client';

import Avatar from '@/app/components/Avatar';
import LoadingModal from '@/app/components/LoadingModal';
import { User } from '@prisma/client';
import { useMutation } from '@repo/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();

  const startConversation = useMutation({
    mutationFn: () => axios.post('/api/conversations', { userId: data.id }),
    onSuccess: (response) => {
      router.push(`/conversations/${response.data.id}`);
    }
  });

  const isLoading = startConversation.isPending;

  const handleClick = useCallback(() => {
    startConversation.mutate();
  }, [startConversation]);

  return (
    <>
      {isLoading && <LoadingModal />}

      <div
        onClick={handleClick}
        className="relative flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-white p-3 transition hover:bg-neutral-100"
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
