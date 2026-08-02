'use client';

import Button from '@/components/admin/ui/Button';
import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import SpinnerMini from '@/components/admin/ui/SpinnerMini';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { updatePasswordSchema, type PasswordFormValues } from './schemas';
import { useUpdateUser } from './useUpdateUser';

function UpdatePasswordForm(): React.ReactElement {
  const { register, handleSubmit, formState, reset } =
    useForm<PasswordFormValues>({
      resolver: zodResolver(updatePasswordSchema),
      mode: 'onTouched',
      defaultValues: { password: '', passwordConfirm: '' }
    });
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
          {...register('password')}
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
          {...register('passwordConfirm')}
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
