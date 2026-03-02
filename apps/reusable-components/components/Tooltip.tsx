'use client';

interface TooltipProps {
  text: string;
  className?: string;
  showPulse?: boolean;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

export default function Tooltip({
  text,
  className = '',
  bgColor = '',
  textColor = 'text-white',
  borderColor = '',
}: TooltipProps) {
  return (
    <div className={`absolute inline-flex animate-pulse ${className}`}>
      <div
        className={`
          px-5 py-2 text-lg font-bold rounded-full
          ${bgColor} ${textColor} ${borderColor}
          border-2 shadow-lg backdrop-blur-sm bg-opacity-95 cursor-none
        `}
      >
        {text}
      </div>
    </div>
  );
}
