import type { MouseEventHandler } from 'react';

interface CloseButtonProps {
  className?: string;
  onClick: MouseEventHandler<SVGElement>;
}

export const CloseButton = ({
  className,
  onClick
}: CloseButtonProps): React.ReactNode => {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <rect width="32" height="32" rx="16" fill="#F9F8F7" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2441 11.244C11.5695 10.9186 12.0972 10.9186 12.4226 11.244L20.7559 19.5774C21.0814 19.9028 21.0814 20.4305 20.7559 20.7559C20.4305 21.0813 19.9028 21.0813 19.5774 20.7559L11.2441 12.4226C10.9186 12.0971 10.9186 11.5695 11.2441 11.244Z"
        fill="#003333"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2441 20.7559C10.9186 20.4305 10.9186 19.9028 11.2441 19.5774L19.5774 11.244C19.9028 10.9186 20.4305 10.9186 20.7559 11.244C21.0814 11.5695 21.0814 12.0971 20.7559 12.4226L12.4226 20.7559C12.0972 21.0813 11.5695 21.0813 11.2441 20.7559Z"
        fill="#003333"
      />
    </svg>
  );
};
