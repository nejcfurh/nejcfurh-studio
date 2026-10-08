import { Conversation, Message, User } from '@prisma/client';

// The Prisma client omits hashedPassword from every query (app/libs/prismadb).
export type SafeUser = Omit<User, 'hashedPassword'>;

export type FullMessageType = Message & {
  sender: SafeUser;
  seen: SafeUser[];
};

export type FullConversationType = Conversation & {
  users: SafeUser[];
  messages: FullMessageType[];
};
