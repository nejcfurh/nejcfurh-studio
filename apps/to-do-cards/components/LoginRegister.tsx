'use client';

import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useState } from 'react';

export default function LoginRegister() {
  const [isActive, setIsActive] = useState(false);

  return (
    <section className="login-section">
      <div
        className={
          isActive ? 'container-login right-panel-active' : 'container-login'
        }
      >
        <RegisterForm />
        <LoginForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className="title-section-overlay">Sign in</div>
              <p className="p-section-overlay">
                ... here if you already have an account!
              </p>
              <button
                className="button ghost mt-5"
                onClick={() => setIsActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <div className="title-section-overlay">Welcome!</div>
              <p className="p-section-overlay">
                Sign up if you still don&apos;t have an account!
              </p>
              <button
                className="button ghost"
                onClick={() => setIsActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
