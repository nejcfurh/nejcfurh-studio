import prisma from '@/app/libs/prismadb';

import getCurrentUser from './getCurrentUser';

const getMessages = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return [];
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
        conversation: {
          userIds: { has: currentUser.id }
        }
      },
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    return messages;
  } catch {
    return [];
  }
};

export default getMessages;
