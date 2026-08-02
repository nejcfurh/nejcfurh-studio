import type { ZodError } from 'zod';

/** Messages per field, keyed by the dotted path a form uses for that field. */
export type FieldErrors = Record<string, string[]>;

/**
 * The terminal states a server action can end in. Keeping them distinct is what
 * lets a caller put a rejected field back on its field, offer a retry only when
 * retrying could help, and explain a business rule without offering one.
 */
export type ActionResult<TData> =
  | { status: 'success'; data: TData }
  | { status: 'invalid'; fieldErrors: FieldErrors; formError?: string }
  | { status: 'error'; message: string; retryable: boolean };

export const succeeded = <TData>(data: TData): ActionResult<TData> => ({
  status: 'success',
  data
});

/**
 * A rule the input broke. `retryable: false` — resending the same payload
 * fails the same way.
 */
export const rejected = <TData>(message: string): ActionResult<TData> => ({
  status: 'error',
  message,
  retryable: false
});

/** A failure the same payload might survive on a second attempt. */
export const failed = <TData>(message: string): ActionResult<TData> => ({
  status: 'error',
  message,
  retryable: true
});

/**
 * Flattens a ZodError into per-field messages. Issues that carry no field path
 * come from whole-object refinements, so they become the form-level error
 * rather than being dropped.
 */
export const invalid = <TData>(error: ZodError): ActionResult<TData> => {
  const fieldErrors: FieldErrors = {};
  let formError: string | undefined;

  for (const issue of error.issues) {
    if (issue.path.length === 0) {
      formError ??= issue.message;
      continue;
    }

    const path = issue.path.map((segment) => String(segment)).join('.');
    const existing = fieldErrors[path];

    if (existing) {
      existing.push(issue.message);
    } else {
      fieldErrors[path] = [issue.message];
    }
  }

  return { status: 'invalid', fieldErrors, formError };
};
