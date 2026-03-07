'use client';

import Button from '@/components/admin/ui/Button';
import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import SpinnerMini from '@/components/admin/ui/SpinnerMini';
import { useForm } from 'react-hook-form';

import { useUpdateUser } from './useUpdateUser';

interface PasswordFormValues {
  password: string;
  passwordConfirm: string;
}

function UpdatePasswordForm(): React.ReactElement {
  const { register, handleSubmit, formState, getValues, reset } =
    useForm<PasswordFormValues>();
  const { errors } = formState;

  const { updateUser, isUpdating } = useUpdateUser();

  function onSubmit({ password }: PasswordFormValues) {
    updateUser({ password }, { onSuccess: () => reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="New Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters'
            }
          })}
        />
      </FormRow>

      <FormRow
        label="Confirm New Password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value: string) =>
              getValues().password === value || 'Passwords need to match'
          })}
        />
      </FormRow>
      <FormRow>
        <Button onClick={() => reset()} type="reset" $variation="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>
          {!isUpdating ? 'Update Password' : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
