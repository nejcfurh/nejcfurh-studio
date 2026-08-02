'use client';

import type { ActionResult } from '@repo/validation';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

/**
 * Puts a server action's outcome back onto the form it came from: rejected
 * fields get their own message, anything without a field lands on the form
 * root. Returns whether the action succeeded, so a caller can go straight to
 * its success path.
 *
 * Field paths arrive dotted (`owner.name`, `tags.1`), which is already how
 * react-hook-form addresses nested fields.
 */
export const applyActionResult = <TData, TValues extends FieldValues>(
  form: UseFormReturn<TValues>,
  result: ActionResult<TData>
): boolean => {
  if (result.status === 'success') {
    return true;
  }

  if (result.status === 'error') {
    form.setError('root', { message: result.message });
    return false;
  }

  const entries = Object.entries(result.fieldErrors);

  for (const [path, messages] of entries) {
    const message = messages[0];
    if (message) {
      form.setError(path as Path<TValues>, { message });
    }
  }

  if (result.formError) {
    form.setError('root', { message: result.formError });
  } else if (entries.length === 0) {
    // A rejection we cannot attribute is still a rejection — never silent.
    form.setError('root', { message: 'Please check the form and try again.' });
  }

  return false;
};
