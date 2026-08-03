import { z } from '@repo/validation';

export const composeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  author: z.string().trim().min(1, 'Author is required').max(100),
  content: z.string().trim().min(1, 'Post content is required').max(50_000),
  imageLink: z.union([z.literal(''), z.url('Enter a valid image URL')])
});

export type ComposeFormData = z.infer<typeof composeSchema>;
