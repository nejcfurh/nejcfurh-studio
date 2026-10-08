import getCurrentUser from '@/app/actions/getCurrentUser';
import { parseChannel } from '@/app/libs/channels';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

const canAccessChannel = async (channel: string, userId: string) => {
  const parsed = parseChannel(channel);

  switch (parsed.kind) {
    case 'presence':
      return true;
    case 'user':
      return parsed.userId === userId;
    case 'conversation': {
      const conversation = await prisma.conversation.findFirst({
        where: { id: parsed.conversationId, userIds: { has: userId } },
        select: { id: true }
      });
      return conversation !== null;
    }
    case 'unknown':
      return false;
  }
};

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const params = new URLSearchParams(await request.text());
    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
      return new NextResponse('Invalid Data', { status: 400 });
    }

    if (!(await canAccessChannel(channel, currentUser.id))) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Presence members are keyed by email: Avatar and Header compare
    // useActiveList members to user.email when showing who is online.
    const presenceData =
      parseChannel(channel).kind === 'presence'
        ? { user_id: currentUser.email }
        : undefined;

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channel,
      presenceData
    );
    return NextResponse.json(authResponse);
  } catch (error: unknown) {
    console.log(error, 'ERROR_PUSHER_AUTH_API');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
