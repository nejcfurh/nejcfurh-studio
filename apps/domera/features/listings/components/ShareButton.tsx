'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export const ShareButton = () => {
  const handleClick = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard.');
    } catch {
      toast.error('Could not copy link.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Share listing"
      className="bg-background/90 text-foreground hover:bg-background grid size-11 cursor-pointer place-items-center rounded-full border shadow-lg backdrop-blur transition-colors"
    >
      <Share2 className="size-5" />
    </button>
  );
};
