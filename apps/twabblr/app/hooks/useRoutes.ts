import { signOut } from '@repo/auth/next-auth/react';
import { HiChat } from '@repo/ui/icons/react-icons/hi';
import {
  HiArrowLeftEndOnRectangle,
  HiUsers
} from '@repo/ui/icons/react-icons/hi2';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import useConversation from './useConversation';

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: HiChat,
        active: pathname === '/conversations' || !!conversationId
      },
      {
        label: 'Users',
        href: '/users',
        icon: HiUsers,
        active: pathname === '/users'
      },
      {
        label: 'Logout',
        href: '#',
        onClick: () => signOut(),
        icon: HiArrowLeftEndOnRectangle
      }
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
