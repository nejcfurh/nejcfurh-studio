import prisma from '@/app/libs/prismadb';

import getCurrentUser from './getCurrentUser';

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return null;
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userIds: { has: currentUser.id }
      },
      include: {
        users: true
      }
    });

    return conversation;
  } catch {
    return null;
  }
};

export default getConversationById;
