import Pusher from 'pusher';
import { vi } from 'vitest';

import { createFakePrisma, type FakeSeed } from './fake-prisma';

/**
 * Shared doubles for the external systems: the database (fake Prisma), the
 * session (next-auth's `auth`) and Pusher. Test files point the app modules
 * at these with vi.mock. The Pusher server is the real library, so channel
 * signatures are computed exactly as in production; only network calls
 * (`trigger`) are stubbed.
 */

export const PUSHER_KEY = 'test-key';
export const PUSHER_SECRET = 'test-secret';

export const fakePrisma = createFakePrisma();

export const pusherServer = new Pusher({
  appId: '1',
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: 'eu',
  useTLS: true
});

export const trigger = vi
  .spyOn(pusherServer, 'trigger')
  .mockImplementation(async () => new Response(null) as never);

let session: { user: { email: string } } | null = null;

export const auth = vi.fn(async () => session);

export const signInAs = (email: string | null) => {
  session = email ? { user: { email } } : null;
};

export const resetDoubles = (seed: FakeSeed) => {
  vi.clearAllMocks();
  fakePrisma.seed(seed);
  signInAs(null);
};

/** Channel names and event names that Pusher was asked to trigger. */
export const triggeredEvents = () =>
  trigger.mock.calls.map(([channel, event]) => ({ channel, event }));
