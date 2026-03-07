'use client';

import Button from '@/components/admin/ui/Button';
import FileInput from '@/components/admin/ui/FileInput';
import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import SpinnerMini from '@/components/admin/ui/SpinnerMini';
import React, { useState } from 'react';

import { useUpdateUser } from './useUpdateUser';
import { useUser } from './useUser';

function UpdateUserDataForm(): React.ReactElement {
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName }
    }
  } = useUser() as {
    user: { email: string; user_metadata: { fullName: string } };
  };

  const { updateUser, isUpdating } = useUpdateUser();

  const [fullName, setFullName] = useState<string>(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          (e.target as HTMLFormElement).reset();
        }
      }
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFullName(e.target.value)
          }
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          disabled={isUpdating}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAvatar(e.target.files?.[0] ?? null)
          }
        />
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          disabled={isUpdating}
          $variation="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>
          {' '}
          {!isUpdating ? 'Update Account' : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
