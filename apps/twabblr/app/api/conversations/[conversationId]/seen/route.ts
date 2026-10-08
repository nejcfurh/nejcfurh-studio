import getCurrentUser from '@/app/actions/getCurrentUser';
import { conversationChannel, userChannel } from '@/app/libs/channels';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = await params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    //find the existing conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userIds: { has: currentUser.id }
      },
      include: {
        messages: {
          include: {
            seen: true
          }
        },
        users: true
      }
    });

    if (!conversation) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    //Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        sender: true,
        seen: true
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    await pusherServer.trigger(
      userChannel(currentUser.id),
      'conversation:update',
      {
        id: conversation.id,
        messages: [updatedMessage]
      }
    );

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      conversationChannel(conversation.id),
      'message:update',
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (error: unknown) {
    console.log(error, 'ERROR_MESSAGES_SEEN_API');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
