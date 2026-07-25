'use client';

import { AnimatedSpan } from '@repo/ui/animation/core';

import { digitMotion } from './weather-motion';

/**
 * Renders a time string a glyph at a time so each digit can animate on the tick
 * it changes. Keying by index *and* value means an unchanged digit keeps its
 * element and stays put, while a changed one remounts and slides in; the colons
 * never change, so they never move.
 *
 * inline-block is required for the transform — transforms do not apply to
 * inline elements — and the caller's tabular figures keep the widths stable.
 */
export function ClockDigits({ value }: { value: string }): React.ReactNode {
  return value.split('').map((char, index) => (
    <AnimatedSpan
      key={`${index}-${char}`}
      className="inline-block"
      {...digitMotion}
    >
      {char}
    </AnimatedSpan>
  ));
}
