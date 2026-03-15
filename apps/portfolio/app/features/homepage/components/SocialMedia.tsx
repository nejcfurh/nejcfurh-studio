import Link from 'next/link';
import { JSX } from 'react';

const socialMediaData = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/nejcfurh/',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-instagram"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    name: 'X',
    url: 'https://twitter.com/nejcfurh',
    icon: (
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
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nejcfurh/',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-linkedin"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/nejcfurh',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="white"
        strokeWidth="1.2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H8.015V12h2.423V9.607c0-2.412 1.437-3.737 3.638-3.737 1.056 0 2.165.195 2.165.195v2.385h-1.219c-1.204 0-1.596.746-1.596 1.512V12h2.713l-.434 2.89h-2.28v6.988C18.343 21.128 22 16.991 22 12 22 6.477 17.523 2 12 2z"
        />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    url: 'https://github.com/nejcfurh',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="white"
        strokeWidth="1.2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 0.5C5.648 0.5 0.5 5.648 0.5 12c0 5.06 3.282 9.34 7.84 10.76.572.106.78-.248.78-.55 0-.272-.01-1.177-.01-2.138-3.188.693-3.863-.773-3.863-.773-.52-1.322-1.268-1.675-1.268-1.675-1.037-.709.078-.695.078-.695 1.147.08 1.75 1.178 1.75 1.178 1.019 1.746 2.673 1.242 3.325.949.104-.738.399-1.242.726-1.527-2.547-.29-5.221-1.273-5.221-5.662 0-1.251.446-2.273 1.18-3.073-.12-.29-.512-1.46.11-3.045 0 0 .963-.308 3.15 1.177.914-.254 1.894-.382 2.868-.387.974.005 1.955.133 2.87.387 2.183-1.485 3.145-1.177 3.145-1.177.623 1.585.23 2.755.11 3.045.735.8 1.18 1.822 1.18 3.073 0 4.401-2.678 5.368-5.23 5.652.41.353.778 1.051.778 2.119 0 1.528-.013 2.757-.013 3.134 0 .305.206.663.785.55C20.72 21.34 24 17.06 24 12c0-6.352-5.148-11.5-12-11.5z"
        />
      </svg>
    ),
  },
];

const SocialMedia = (): JSX.Element => {
  return (
    <div className="flex gap-6 my-5">
      {socialMediaData.map(socialMediaItem => (
        <button
          key={socialMediaItem.name}
          className="social-media-button w-14 h-14 bg-transparent rounded-full outline-[2px] outline-white cursor-pointer transition-all duration-300 ease-in-out hover:outline-offset-[3px]"
        >
          <Link
            href={socialMediaItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full h-full"
          >
            {socialMediaItem.icon}
          </Link>
        </button>
      ))}
    </div>
  );
};

export default SocialMedia;
