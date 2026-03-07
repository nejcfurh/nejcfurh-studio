'use client';

import Image from 'next/image';

import { useUser } from './useUser';

function UserAvatar(): React.ReactElement {
  const { user } = useUser();
  const { avatar, fullName } = user!.user_metadata;

  return (
    <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-grey-600)]">
      <Image
        className="block aspect-square w-9 rounded-full object-cover object-center outline outline-2 outline-[var(--color-grey-100)]"
        src={avatar || '/default-user.jpg'}
        alt={`Avatar of ${fullName}`}
        width={36}
        height={36}
      />
      <span>{fullName}</span>
    </div>
  );
}

export default UserAvatar;
