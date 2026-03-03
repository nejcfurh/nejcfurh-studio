import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fileTypes = v.union(
  v.literal('image'),
  v.literal('video'),
  v.literal('csv'),
  v.literal('pdf')
);

export const roles = v.union(v.literal('admin'), v.literal('member'));

export default defineSchema({
  files: defineTable({
    fileId: v.id('_storage'),
    type: fileTypes,
    name: v.string(),
    organizationId: v.string(),
    markedForDeletion: v.optional(v.boolean()),
    userId: v.id('users')
  })
    .index('by_organization', ['organizationId'])
    .index('by_marked_for_deletion', ['markedForDeletion']),
  favorites: defineTable({
    fileId: v.id('files'),
    organizationId: v.string(),
    userId: v.id('users')
  }).index('by_user_organization_file', ['userId', 'organizationId', 'fileId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    organizationIds: v.array(
      v.object({
        organizationId: v.string(),
        role: roles
      })
    ),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  }).index('by_tokenIdentifier', ['tokenIdentifier'])
});
