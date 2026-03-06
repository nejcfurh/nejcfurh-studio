import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { name, image } = body;

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        image: image,
        name: name
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.log(error, 'ERROR_SETTINGS_API');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
