'use client';

import { AnimatedButton } from '@repo/ui/animation/core';
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
    <AnimatedButton
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
      aria-label="Share listing"
      className="bg-background/90 text-foreground hover:bg-background grid size-11 cursor-pointer place-items-center rounded-full border shadow-lg backdrop-blur transition-colors"
    >
      <Share2 className="size-5" />
    </AnimatedButton>
  );
};
