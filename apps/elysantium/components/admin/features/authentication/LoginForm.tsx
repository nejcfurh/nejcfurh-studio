'use client';

import Button from '@/components/admin/ui/Button';
import Form from '@/components/admin/ui/Form';
import FormRowVertical from '@/components/admin/ui/FormRowVertical';
import Input from '@/components/admin/ui/Input';
import SpinnerMini from '@/components/admin/ui/SpinnerMini';
import React, { useState } from 'react';

import { useLogin } from './useLogin';

function LoginForm(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { login, isPending } = useLogin();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;

    login(
      { email, password },
      {
        onSettled: () => {
          setEmail('');
          setPassword('');
        }
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          disabled={isPending}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          disabled={isPending}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button $size="large" disabled={isPending}>
          {!isPending ? 'Log in' : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
