import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './form';

type Values = { email: string };

const TestForm = ({
  withDescription = false
}: {
  withDescription?: boolean;
}) => {
  const form = useForm<Values>({ defaultValues: { email: '' } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              {withDescription ? (
                <FormDescription>We never share it.</FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Save</button>
      </form>
    </Form>
  );
};

const submit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));

describe('FormMessage', () => {
  it('announces a validation error to assistive tech', async () => {
    render(<TestForm />);
    submit();

    // role=alert is what makes a post-submit error audible; without it the
    // message renders but is never read out.
    const message = await waitFor(() => screen.getByRole('alert'));
    expect(message.textContent).toBe('Email is required');
  });

  it('renders nothing while the field is valid', () => {
    render(<TestForm />);

    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('FormControl', () => {
  it('marks the control invalid and points it at the message', async () => {
    render(<TestForm />);
    submit();

    const message = await waitFor(() => screen.getByText('Email is required'));
    const input = screen.getByRole('textbox');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain(message.id);
  });

  it('describes the control by its description while valid', () => {
    render(<TestForm withDescription />);
    const input = screen.getByRole('textbox');
    const description = screen.getByText('We never share it.');

    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toBe(description.id);
  });
});

describe('FormLabel', () => {
  it('points at the control it labels', () => {
    render(<TestForm />);

    expect(screen.getByLabelText('Email')).toBe(screen.getByRole('textbox'));
  });
});
