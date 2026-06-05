'use client';

import { signIn } from '@repo/auth/next-auth/react';
import { useState } from 'react';

import Modal from './Modal';

export default function SocialMediaButtons() {
  const [showTwitterNotice, setShowTwitterNotice] = useState(false);

  const continueWithTwitter = () => {
    setShowTwitterNotice(false);
    signIn('twitter', { callbackUrl: '/todos' });
  };

  return (
    <div className="social-media-buttons">
      <ul>
        <li className="item">
          <a
            href="#"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              signIn('google', { callbackUrl: '/todos' });
            }}
          >
            <i className="fa-brands fa-google icon"></i>
          </a>
        </li>
        <li className="item">
          <a
            href="#"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              signIn('github', { callbackUrl: '/todos' });
            }}
          >
            <i className="fa-brands fa-github icon"></i>
          </a>
        </li>
        <li className="item">
          <a
            href="#"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              signIn('facebook', { callbackUrl: '/todos' });
            }}
          >
            <i className="fa-brands fa-facebook icon"></i>
          </a>
        </li>
        <li className="item">
          <a
            href="#"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTwitterNotice(true);
            }}
          >
            <i className="fa-brands fa-x-twitter icon"></i>
          </a>
        </li>
      </ul>

      <Modal
        open={showTwitterNotice}
        onClose={() => setShowTwitterNotice(false)}
      >
        <div className="w-[90vw] max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Heads up about X login
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-gray-600">
            X removed its free API tier, so signing in with X still works — but
            it creates a brand-new account on every attempt, because we can no
            longer read your X profile to recognize you. You can continue
            anyway, or use a different login option.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={continueWithTwitter}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Continue anyway
            </button>
            <button
              type="button"
              onClick={() => setShowTwitterNotice(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Use another login option
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
