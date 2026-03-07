import getCurrentUser from '@/app/actions/getCurrentUser';
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

    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true }
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
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
      if (user.email)
        await pusherServer.trigger(
          user.email,
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
