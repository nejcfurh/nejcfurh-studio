import { z } from '@repo/validation';

/**
 * One form serves both variants, so the requirements are conditional — which is
 * why this is a factory rather than a constant.
 *
 * Signing in only checks the password is present: the length rule belongs to
 * account creation, and enforcing it here would lock out any existing account
 * whose password predates it, while telling the user the wrong thing.
 */
export const authSchema = (variant: 'LOGIN' | 'REGISTER') =>
  z.object({
    name:
      variant === 'REGISTER'
        ? z.string().trim().min(1, 'Name is required')
        : z.string().optional(),
    email: z.email('Enter a valid email address'),
    password:
      variant === 'REGISTER'
        ? z.string().min(6, 'Password needs at least 6 characters')
        : z.string().min(1, 'Password is required')
  });

export type AuthFormValues = z.infer<ReturnType<typeof authSchema>>;

export const messageSchema = z.object({
  message: z.string().trim().min(1)
});

export type MessageFormValues = z.infer<typeof messageSchema>;

export const groupChatSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  members: z
    // label mirrors Select's option shape, where a user's name may be null.
    .array(z.object({ value: z.string(), label: z.string().nullable() }))
    .min(2, 'Pick at least two members')
});

export type GroupChatFormValues = z.infer<typeof groupChatSchema>;

export const settingsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  image: z.string().nullable()
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
