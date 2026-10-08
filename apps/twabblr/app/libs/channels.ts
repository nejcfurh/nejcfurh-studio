// The `private-` prefix makes pusher-js call /api/pusher/auth before it
// subscribes; a bare channel name is public to anyone holding the app key.
const USER_PREFIX = 'private-user-';
const CONVERSATION_PREFIX = 'private-conversation-';

export const PRESENCE_CHANNEL = 'presence-messenger';

export const userChannel = (userId: string) => `${USER_PREFIX}${userId}`;

export const conversationChannel = (conversationId: string) =>
  `${CONVERSATION_PREFIX}${conversationId}`;

export type ParsedChannel =
  | { kind: 'user'; userId: string }
  | { kind: 'conversation'; conversationId: string }
  | { kind: 'presence' }
  | { kind: 'unknown' };

export const parseChannel = (channel: string): ParsedChannel => {
  if (channel === PRESENCE_CHANNEL) {
    return { kind: 'presence' };
  }

  if (channel.startsWith(USER_PREFIX)) {
    const userId = channel.slice(USER_PREFIX.length);
    return userId ? { kind: 'user', userId } : { kind: 'unknown' };
  }

  if (channel.startsWith(CONVERSATION_PREFIX)) {
    const conversationId = channel.slice(CONVERSATION_PREFIX.length);
    return conversationId
      ? { kind: 'conversation', conversationId }
      : { kind: 'unknown' };
  }

  return { kind: 'unknown' };
};
