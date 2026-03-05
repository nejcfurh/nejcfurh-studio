import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';

export default function ContactButtons() {
  return (
    <div className="social-media-buttons-contact">
      <button className="social-media-button">
        <a
          href="https://www.instagram.com/nejcfurh/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram size={24} stroke="white" />
        </a>
      </button>
      <button className="social-media-button">
        <a
          href="https://twitter.com/nejcfurh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-brand-x"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
          </svg>
        </a>
      </button>
      <button className="social-media-button">
        <a href="mailto:nejc.furh7@gmail.com">
          <Mail size={24} stroke="white" />
        </a>
      </button>
      <button className="social-media-button linkedin">
        <a
          href="https://si.linkedin.com/in/nejcfurh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={24} stroke="white" />
        </a>
      </button>
      <button className="social-media-button">
        <a
          href="https://www.facebook.com/nejcfurh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook size={24} stroke="white" />
        </a>
      </button>
    </div>
  );
}
