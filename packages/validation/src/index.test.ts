import { describe, expect, it } from 'vitest';

import { z } from './index';

describe('@repo/validation', () => {
  it('re-exports a usable schema builder', () => {
    expect(z.string().min(2).safeParse('ok').success).toBe(true);
  });

  it('reports failures as issues carrying path and message', () => {
    const result = z
      .object({ email: z.string().min(1, 'Email is required') })
      .safeParse({ email: '' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['email']);
    expect(result.error?.issues[0]?.message).toBe('Email is required');
  });

  it('reports the path of a nested field', () => {
    const result = z
      .object({ owner: z.object({ name: z.string().min(1) }) })
      .safeParse({ owner: { name: '' } });

    expect(result.error?.issues[0]?.path).toEqual(['owner', 'name']);
  });
});
