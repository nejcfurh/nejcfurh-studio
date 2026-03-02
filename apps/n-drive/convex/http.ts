import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { CLERK_DOMAIN } from './auth.config';
import { internal } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/clerk',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          svix_id: headerPayload.get('svix-id')!,
          svix_timestamp: headerPayload.get('svix-timestamp')!,
          svix_signature: headerPayload.get('svix-signature')!,
        },
      });

      switch (result.type) {
        case 'user.created':
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `${CLERK_DOMAIN}|${result.data.id}`,
            name: result.data.first_name + ' ' + result.data.last_name,
            imageUrl: result.data.image_url,
          });
          break;
        case 'user.updated':
          await ctx.runMutation(internal.users.updateUser, {
            tokenIdentifier: `${CLERK_DOMAIN}|${result.data.id}`,
            name: result.data.first_name + ' ' + result.data.last_name,
            imageUrl: result.data.image_url,
          });
          break;
        case 'organizationMembership.created':
          await ctx.runMutation(internal.users.addOrganizationIdToUser, {
            tokenIdentifier: `${CLERK_DOMAIN}|${result.data.public_user_data.user_id}`,
            organizationId: result.data.organization.id,
            role: result.data.role === 'org:admin' ? 'admin' : 'member',
          });
          break;
        case 'organizationMembership.updated':
          await ctx.runMutation(
            internal.users.updateRoleInOrganizationForUser,
            {
              tokenIdentifier: `${CLERK_DOMAIN}|${result.data.public_user_data.user_id}`,
              organizationId: result.data.organization.id,
              role: result.data.role === 'org:admin' ? 'admin' : 'member',
            }
          );
          break;
      }
    } catch (error) {
      console.error(error);
      return new Response('Internal Server Error', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  }),
});

export default http;
