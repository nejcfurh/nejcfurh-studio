import { generateObject } from '@repo/ai-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from './route';

vi.mock('@repo/ai-sdk', () => ({
  google: vi.fn((modelId: string) => modelId),
  generateObject: vi.fn(async () => ({ object: { plants: [] } }))
}));

// The shape the how-to-help page sends.
const validRequest = {
  locationCity: 'Portland',
  locationState: 'Oregon',
  locationCountry: 'United States'
};

const send = (body: unknown): Promise<Response> =>
  POST(
    new Request('http://localhost/api/pollinator-plants', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body)
    })
  );

describe('POST /api/pollinator-plants', () => {
  beforeEach(() => {
    vi.mocked(generateObject).mockClear();
  });

  it('lists plants for a normal request with capped output', async () => {
    const response = await send(validRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ plants: [] });

    const options = vi.mocked(generateObject).mock.calls[0]?.[0];
    expect(options).toMatchObject({ maxOutputTokens: 2048 });
    expect(options?.prompt).toContain('Portland, Oregon, United States');
  });

  it.each([
    ['a body that is not JSON', 'not json'],
    ['an empty body', ''],
    ['a missing country', { ...validRequest, locationCountry: undefined }],
    ['a blank city', { ...validRequest, locationCity: '' }],
    [
      'a city over 100 characters',
      { ...validRequest, locationCity: 'a'.repeat(100_000) }
    ],
    ['a state that is a list', { ...validRequest, locationState: ['Oregon'] }]
  ])('rejects %s without calling Gemini', async (_, body) => {
    const response = await send(body);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Location information is required'
    });
    expect(generateObject).not.toHaveBeenCalled();
  });
});
