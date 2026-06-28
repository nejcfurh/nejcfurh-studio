'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@repo/ui/utils';
import * as React from 'react';
import { FcGoogle } from 'react-icons/fc';

type GoogleOAuthButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'variant' | 'children'
> & {
  label?: string;
  loading?: boolean;
};

export const GoogleOAuthButton = ({
  className,
  label = 'Continue with Google',
  loading = false,
  disabled,
  ...props
}: GoogleOAuthButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading || disabled}
      className={cn('h-12 w-full gap-3 text-base', className)}
      {...props}
    >
      <FcGoogle className="size-6" />
      {loading ? 'Signing in…' : label}
    </Button>
  );
};
