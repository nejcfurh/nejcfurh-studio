'use client';

import { signIn } from 'next-auth/react';

export default function SocialMediaButtons() {
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
              signIn('twitter', { callbackUrl: '/todos' });
            }}
          >
            <i className="fa-brands fa-x-twitter icon"></i>
          </a>
        </li>
      </ul>
    </div>
  );
}
