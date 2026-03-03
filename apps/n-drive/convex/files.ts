import { ConvexError, v } from 'convex/values';

import { Id } from './_generated/dataModel';
import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx
} from './_generated/server';
import { fileTypes } from './schema';

const hasAccessToFile = async (
  ctx: MutationCtx | QueryCtx,
  fileId: Id<'files'>
) => {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(ctx, file.organizationId);

  if (!hasAccess) {
    return null;
  }

  const { user } = hasAccess;

  if (!user) {
    return null;
  }

  return {
    file,
    user
  };
};

export const deleteMarkedFilesForDeletion = internalMutation({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db
      .query('files')
      .withIndex('by_marked_for_deletion', (q) =>
        q.eq('markedForDeletion', true)
      )
      .collect();

    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.fileId);
        return await ctx.db.delete(file._id);
      })
    );
  }
});

export const deleteFile = mutation({
  args: {
    fileId: v.id('files')
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError('You do not have access to this file!');
    }

    const { file, user } = access;

    const canDelete =
      file.userId === user._id ||
      user.organizationIds.find(
        (org) => org.organizationId === file.organizationId
      )?.role === 'admin';

    if (!canDelete) {
      throw new ConvexError(
        'You do not have sufficient permissions to delete this file!'
      );
    }

    await ctx.db.patch(file._id, { markedForDeletion: true });
  }
});

export const restoreFile = mutation({
  args: {
    fileId: v.id('files')
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError('You do not have access to this file!');
    }

    const { file, user } = access;

    const canRestore =
      file.userId === user._id ||
      user.organizationIds.find(
        (org) => org.organizationId === file.organizationId
      )?.role === 'admin';

    if (!canRestore) {
      throw new ConvexError(
        'You do not have sufficient permissions to restore this file!'
      );
    }

    await ctx.db.patch(file._id, { markedForDeletion: false });
  }
});

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError('You must be signed in to create a file!');
  }

  return await ctx.storage.generateUploadUrl();
});

const hasAccessToOrg = async (
  ctx: MutationCtx | QueryCtx,
  organizationId: string
) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.organizationIds.some((org) => org.organizationId === organizationId) ||
    user.tokenIdentifier.includes(organizationId);

  if (!hasAccess) {
    return null;
  }

  return {
    user
  };
};

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id('_storage'),
    organizationId: v.string(),
    type: fileTypes
  },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToOrg(ctx, args.organizationId);

    if (!hasAccess) {
      throw new ConvexError('You do not have access to this organization!');
    }

    const { user } = hasAccess;

    await ctx.db.insert('files', {
      name: args.name,
      fileId: args.fileId,
      organizationId: args.organizationId,
      type: args.type,
      userId: user._id
    });
  }
});

export const getStorage = query({
  args: {
    fileId: v.id('_storage')
  },
  handler: async (ctx, args) => {
    const storageUrl = await ctx.storage.getUrl(args.fileId);
    return storageUrl;
  }
});

export const getFiles = query({
  args: {
    organizationId: v.string(),
    searchQuery: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    markedForDeletion: v.optional(v.boolean()),
    fileType: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToOrg(ctx, args.organizationId);

    if (!hasAccess) {
      return [];
    }
    const { user } = hasAccess;

    const searchQuery = args.searchQuery?.toLowerCase();

    const files = await ctx.db
      .query('files')
      .withIndex('by_organization', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect();

    if (searchQuery) {
      return files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery)
      );
    }

    if (!user) {
      return files;
    }

    if (args.favorites) {
      const favorites = await ctx.db
        .query('favorites')
        .withIndex('by_user_organization_file', (q) =>
          q.eq('userId', user._id).eq('organizationId', args.organizationId)
        )
        .collect();

      return files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
      );
    }

    if (args.markedForDeletion) {
      return files.filter((file) => file.markedForDeletion);
    }

    if (args.fileType) {
      return files.filter(
        (file) => file.type === args.fileType && !file.markedForDeletion
      );
    }

    return files.filter((file) => !file.markedForDeletion);
  }
});

export const toggleFavorites = mutation({
  args: {
    fileId: v.id('files')
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError('You do not have access to this file!');
    }

    const { file, user } = access;

    const favorite = await ctx.db
      .query('favorites')
      .withIndex('by_user_organization_file', (q) =>
        q
          .eq('userId', user._id)
          .eq('organizationId', file.organizationId)
          .eq('fileId', file._id)
      )
      .first();

    if (!favorite) {
      await ctx.db.insert('favorites', {
        fileId: file._id,
        organizationId: file.organizationId,
        userId: user._id
      });
      return {
        success: true,
        message: 'File added to favorites successfully.'
      };
    } else {
      await ctx.db.delete(favorite._id);
      return {
        success: true,
        message: 'File removed from favorites successfully.'
      };
    }
  }
});

export const queryAllFavorites = query({
  args: {
    organizationId: v.string()
  },
  handler: async (ctx, args) => {
    const access = await hasAccessToOrg(ctx, args.organizationId);

    if (!access) {
      return [];
    }

    const { user } = access;

    const favorites = await ctx.db
      .query('favorites')
      .withIndex('by_user_organization_file', (q) =>
        q.eq('userId', user._id).eq('organizationId', args.organizationId)
      )
      .collect();

    if (!favorites) {
      return [];
    }

    return favorites;
  }
});
