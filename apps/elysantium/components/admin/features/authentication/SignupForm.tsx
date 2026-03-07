'use client';

import Button from '@/components/admin/ui/Button';
import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import SpinnerMini from '@/components/admin/ui/SpinnerMini';
import { useForm } from 'react-hook-form';

import { useSignUp } from './useSignUp';

interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function SignupForm(): React.ReactElement {
  const { register, formState, getValues, handleSubmit, reset } =
    useForm<SignupFormValues>();
  const { errors } = formState;

  const { signup, isPending } = useSignUp();

  function onSubmit({ fullName, email, password }: SignupFormValues) {
    signup({ fullName, email, password }, { onSettled: () => reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isPending}
          {...register('fullName', { required: 'This field is required!' })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending}
          {...register('email', {
            required: 'This field is required!',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Provide a valid email address!'
            }
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isPending}
          {...register('password', {
            required: 'This field is required!',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters!'
            }
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register('passwordConfirm', {
            required: 'This field is required!',
            validate: (value: string) =>
              value === getValues().password || 'Passwords need to match!'
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          disabled={isPending}
          $variation="secondary"
          type="reset"
          onClick={() => reset()}
        >
          Cancel
        </Button>
        <Button disabled={isPending}>
          {!isPending ? 'Create new user' : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
