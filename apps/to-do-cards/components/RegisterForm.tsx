'use client';

import SocialMediaButtons from '@/components/SocialMediaButtons';
import { registerAction } from '@/lib/actions/auth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterForm() {
  const [isPending, setIsPending] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      const result = await registerAction(formData);
      if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      // redirect throws - this is expected
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form action={handleSubmit}>
        <div className="title-section">Sign up</div>
        <SocialMediaButtons />
        <span className="span-section">
          or use your Email for registration ...
        </span>
        <div className="box-input">
          <div className="input__wrapper">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="input__field"
              disabled={isPending}
            />
            <output className="input__label">Name</output>
          </div>
          <br />
          <div className="input__wrapper">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="input__field"
              disabled={isPending}
            />
            <output className="input__label">Email</output>
          </div>
          <br />
          <div className="input__wrapper">
            <input
              type={viewPassword ? 'text' : 'password'}
              name="password"
              placeholder="Your Password"
              required
              className="input__field"
              disabled={isPending}
            />
            <output className="input__label">Password</output>
            <button
              type="button"
              className="input__icon"
              onClick={(e) => {
                e.preventDefault();
                setViewPassword(!viewPassword);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {viewPassword ? (
                <EyeOff size={20} color="#454545" />
              ) : (
                <Eye size={20} color="#454545" />
              )}
            </button>
          </div>
        </div>
        <button className="button" disabled={isPending}>
          {!isPending ? (
            'Sign up'
          ) : (
            <Loader2 className="inline animate-spin" size={16} />
          )}
        </button>
      </form>
    </div>
  );
}
