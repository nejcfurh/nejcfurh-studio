'use client';

import Button from '@/components/admin/ui/Button';
import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import SpinnerMini from '@/components/admin/ui/SpinnerMini';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { signupSchema, type SignupFormValues } from './schemas';
import { useSignUp } from './useSignUp';

function SignupForm(): React.ReactElement {
  const { register, formState, handleSubmit, reset } =
    useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      mode: 'onTouched',
      defaultValues: {
        fullName: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    });
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
          {...register('fullName')}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending}
          {...register('email')}
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
          {...register('password')}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register('passwordConfirm')}
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
