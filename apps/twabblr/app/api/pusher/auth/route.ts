import { pusherServer } from '@/app/libs/pusher';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.text();
  const params = new URLSearchParams(body);
  const socketId = params.get('socket_id') as string;
  const channel = params.get('channel_name') as string;

  const data = {
    user_id: session.user.email
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return NextResponse.json(authResponse);
}
