import { failed, invalid, rejected, succeeded, z } from '@repo/validation';
import { act, render, screen } from '@testing-library/react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError
} from '../components/form';
import { applyActionResult } from './apply-action-result';

type Values = { name: string; discountedPrice: number };

/** Builds the `invalid` result a server action would return for bad input. */
const invalidFor = (schema: z.ZodType, value: unknown) => {
  const result = schema.safeParse(value);
  if (result.success) throw new Error('expected the parse to fail');
  return invalid(result.error);
};

/**
 * Renders the real field components so assertions read what a user would see,
 * and hands the live form back so a test can drive it like a submit handler.
 */
const renderForm = () => {
  let form: UseFormReturn<Values> | undefined;

  const Harness = () => {
    form = useForm<Values>({ defaultValues: { name: '', discountedPrice: 0 } });

    return (
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discountedPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discounted price</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormRootError />
      </Form>
    );
  };

  render(<Harness />);

  return () => {
    if (!form) throw new Error('the harness did not render');
    return form;
  };
};

describe('applyActionResult', () => {
  it('reports success without surfacing any error', () => {
    const form = renderForm();

    const ok = applyActionResult(form(), succeeded({ listingId: 'abc' }));

    expect(ok).toBe(true);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('puts a rejected field back on that field', () => {
    const form = renderForm();
    const result = invalidFor(
      z.object({ name: z.string().min(1, 'Name is required') }),
      { name: '' }
    );

    act(() => {
      expect(applyActionResult(form(), result)).toBe(false);
    });

    const message = screen.getByText('Name is required');
    expect(message.getAttribute('role')).toBe('alert');
    // The message belongs to the name field, not the form as a whole.
    expect(
      screen.getByLabelText('Name').getAttribute('aria-describedby')
    ).toContain(message.id);
  });

  it('puts a cross-field rule on the field the schema names', () => {
    const form = renderForm();
    const result = invalidFor(
      z
        .object({ regularPrice: z.number(), discountedPrice: z.number() })
        .refine((v) => v.discountedPrice < v.regularPrice, {
          message: 'Discounted price must be lower than the regular price',
          path: ['discountedPrice']
        }),
      { regularPrice: 100, discountedPrice: 200 }
    );

    act(() => {
      applyActionResult(form(), result);
    });

    const message = screen.getByText(
      'Discounted price must be lower than the regular price'
    );
    expect(
      screen.getByLabelText('Discounted price').getAttribute('aria-describedby')
    ).toContain(message.id);
  });

  it('announces a retryable failure at the form level', () => {
    const form = renderForm();

    act(() => {
      applyActionResult(form(), failed('Could not finalize upload'));
    });

    expect(screen.getByRole('alert').textContent).toBe(
      'Could not finalize upload'
    );
  });

  it('announces a business rejection at the form level', () => {
    const form = renderForm();

    act(() => {
      applyActionResult(
        form(),
        rejected('You can only edit your own listings.')
      );
    });

    expect(screen.getByRole('alert').textContent).toBe(
      'You can only edit your own listings.'
    );
  });

  it('never fails silently when no field could be attributed', () => {
    const form = renderForm();

    act(() => {
      applyActionResult(form(), { status: 'invalid', fieldErrors: {} });
    });

    expect(screen.getByRole('alert').textContent).toBe(
      'Please check the form and try again.'
    );
  });
});
