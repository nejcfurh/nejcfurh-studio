import getCurrentUser from '@/app/actions/getCurrentUser';
import { conversationChannel, userChannel } from '@/app/libs/channels';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { newMessageSchema } from '@/app/schemas';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const parsed = newMessageSchema.safeParse(
      await request.json().catch(() => null)
    );

    if (!parsed.success) {
      return new NextResponse('Invalid Data', { status: 400 });
    }

    const { message, image, conversationId } = parsed.data;

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userIds: { has: currentUser.id } },
      select: { id: true }
    });

    if (!conversation) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId
          }
        },
        sender: {
          connect: {
            id: currentUser.id
          }
        },
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      },
      include: {
        seen: true,
        sender: true
      }
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    });

    // Server Pusher
    await pusherServer.trigger(
      conversationChannel(conversationId),
      'messages:new',
      newMessage
    );

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    for (const user of updatedConversation.users) {
      await pusherServer.trigger(userChannel(user.id), 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    }

    return NextResponse.json(newMessage);
  } catch (error: unknown) {
    console.log(error, 'ERROR_MESSAGES_API_ROUTE');
    return new NextResponse('InternalError', { status: 500 });
  }
}
