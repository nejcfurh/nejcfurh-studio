// Meteocons (MIT) — https://github.com/basmilius/meteocons
export const ClearDayArt = (): React.ReactNode => (
  <>
    <g>
      <g>
        <circle cx="64" cy="64" r="18" stroke="currentColor" strokeWidth="4" />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M64 16a2 2 0 0 1 2 2v12a2 2 0 1 1-4 0V18a2 2 0 0 1 2-2M30.059 30.059a2 2 0 0 1 2.828 0l8.486 8.485a2 2 0 0 1-2.829 2.829l-8.485-8.486a2 2 0 0 1 0-2.828m67.882 0a2 2 0 0 1 0 2.828l-8.485 8.486a2 2 0 0 1-2.829-2.829l8.486-8.485a2 2 0 0 1 2.828 0M16 64a2 2 0 0 1 2-2h12a2 2 0 1 1 0 4H18a2 2 0 0 1-2-2m80 0a2 2 0 0 1 2-2h12a2 2 0 1 1 0 4H98a2 2 0 0 1-2-2M41.373 86.627a2 2 0 0 1 0 2.829l-8.486 8.485a2 2 0 1 1-2.828-2.828l8.485-8.486a2 2 0 0 1 2.829 0m45.254 0a2 2 0 0 1 2.829 0l8.485 8.486a2 2 0 1 1-2.828 2.828l-8.486-8.485a2 2 0 0 1 0-2.829M64 96a2 2 0 0 1 2 2v12a2 2 0 1 1-4 0V98a2 2 0 0 1 2-2"
          clipRule="evenodd"
        >
          <animateTransform
            attributeName="transform"
            begin="0s"
            dur="6s"
            repeatCount="indefinite"
            type="rotate"
            values="0 64.0 64.0;360 64.0 64.0"
          />
        </path>
      </g>
    </g>
  </>
);
