'use node';

import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/clerk-sdk-node';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('CLERK_WEBHOOK_SECRET is not set');
}

export const fulfill = internalAction({
  args: {
    payload: v.string(),
    headers: v.object({
      svix_id: v.string(),
      svix_timestamp: v.string(),
      svix_signature: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const wh = new Webhook(webhookSecret);

    const payload = wh.verify(args.payload, {
      'svix-id': args.headers.svix_id,
      'svix-timestamp': args.headers.svix_timestamp,
      'svix-signature': args.headers.svix_signature,
    }) as WebhookEvent;
    return payload;
  },
});
