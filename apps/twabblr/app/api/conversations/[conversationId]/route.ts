import getCurrentUser from '@/app/actions/getCurrentUser';
import { userChannel } from '@/app/libs/channels';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userIds: { has: currentUser.id } },
      include: { users: true }
    });

    if (!existingConversation) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    });

    // pusher-async
    existingConversation.users.forEach(async (user) => {
      await pusherServer.trigger(
        userChannel(user.id),
        'conversation:remove',
        existingConversation
      );
    });

    return NextResponse.json(deletedConversation);
  } catch (error: unknown) {
    console.log(error, 'ERROR_CONVERSATION_DELETE_API');
    return new NextResponse('Internal Error!', { status: 500 });
  }
}
