import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with `clsx` semantics and de-duplicate conflicting
 * Tailwind utilities with `tailwind-merge`. Shared across all apps.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
