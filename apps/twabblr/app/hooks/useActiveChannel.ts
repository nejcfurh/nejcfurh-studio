'use client';

import { useSession } from 'next-auth/react';
import { Channel, Members } from 'pusher-js';
import { useEffect, useRef } from 'react';

import { pusherClient } from '../libs/pusher';
import useActiveList from './useActiveList';

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const channelRef = useRef<Channel | null>(null);
  const session = useSession();

  useEffect(() => {
    if (session?.status !== 'authenticated') return;

    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe('presence-messenger');
    }

    const channel = channelRef.current;

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, string>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);
    });

    channel.bind('pusher:member_added', (member: Record<string, string>) => {
      add(member.id);
    });

    channel.bind('pusher:member_removed', (member: Record<string, string>) => {
      remove(member.id);
    });

    return () => {
      if (channelRef.current) {
        pusherClient.unsubscribe('presence-messenger');
        channelRef.current = null;
      }
    };
  }, [set, add, remove, session?.status]);
};

export default useActiveChannel;
