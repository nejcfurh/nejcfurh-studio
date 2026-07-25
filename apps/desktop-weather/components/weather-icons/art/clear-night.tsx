// Meteocons (MIT) — https://github.com/basmilius/meteocons
export const ClearNightArt = (): React.ReactNode => (
  <>
    <g>
      <g>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          d="M58.4 34.416c-3.48 20.81 14.126 40.037 34.823 39.704C88.98 85.698 77.763 94 64.536 94 47.646 94 34 80.497 34 63.898c0-14.53 10.46-26.68 24.4-29.482"
        />
        <animateTransform
          attributeName="transform"
          begin="0s"
          calcMode="spline"
          dur="3s"
          keySplines=".42 0 .58 1; .42 0 .58 1"
          repeatCount="indefinite"
          type="rotate"
          values="-6 63.6 64.2;6 63.6 64.2;-6 63.6 64.2"
        />
      </g>
    </g>
  </>
);
