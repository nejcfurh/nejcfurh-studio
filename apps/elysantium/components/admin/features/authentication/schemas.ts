import { z } from '@repo/validation';

const password = z.string().min(8, 'Password needs a minimum of 8 characters!');

const matchesConfirmation = {
  check: (value: { password: string; passwordConfirm: string }) =>
    value.password === value.passwordConfirm,
  options: {
    message: 'Passwords need to match!',
    path: ['passwordConfirm'] as PropertyKey[]
  }
};

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(1, 'This field is required!'),
    email: z.email('Provide a valid email address!'),
    password,
    passwordConfirm: z.string().min(1, 'This field is required!')
  })
  .refine(matchesConfirmation.check, matchesConfirmation.options);

export type SignupFormValues = z.infer<typeof signupSchema>;

export const updatePasswordSchema = z
  .object({
    password,
    passwordConfirm: z.string().min(1, 'This field is required')
  })
  .refine(matchesConfirmation.check, matchesConfirmation.options);

export type PasswordFormValues = z.infer<typeof updatePasswordSchema>;
