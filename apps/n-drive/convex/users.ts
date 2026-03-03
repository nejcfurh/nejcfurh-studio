import { ConvexError, v } from 'convex/values';

import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx
} from './_generated/server';
import { roles } from './schema';

export const getUser = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) => {
  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError('User not found');
  }

  return user;
};

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    imageUrl: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('users', {
      tokenIdentifier: args.tokenIdentifier,
      organizationIds: [],
      name: args.name,
      imageUrl: args.imageUrl
    });
  }
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.tokenIdentifier);

    if (!user) {
      throw new ConvexError('User not found!');
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      imageUrl: args.imageUrl
    });
  }
});

export const addOrganizationIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    organizationId: v.string(),
    role: roles
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      organizationIds: [
        ...user.organizationIds,
        { organizationId: args.organizationId, role: args.role }
      ]
    });
  }
});

export const updateRoleInOrganizationForUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    organizationId: v.string(),
    role: roles
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.tokenIdentifier);

    const organizationId = user.organizationIds.find(
      (org) => org.organizationId === args.organizationId
    )?.organizationId;

    if (!organizationId) {
      throw new ConvexError('Organization not found');
    }

    await ctx.db.patch(user._id, { organizationIds: user.organizationIds });
  }
});

export const getUserProfile = query({
  args: {
    userId: v.id('users')
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return null;
    }

    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError('User not found!');
    }

    return { name: user.name, imageUrl: user.imageUrl };
  }
});

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) {
      return null;
    }

    return user;
  }
});
