import { z } from 'zod';

//  anything else: is false
export const boolean = (defaultValue = false) =>
  z.preprocess((a) => {
    const booleanAsString = z.string().optional().parse(a) ?? `${defaultValue}`;

    return booleanAsString === 'true';
  }, z.boolean());

/**
 * Zod integer helper that also parses string as integer
 */
export const integer = (defaultValue?: number) =>
  z.preprocess((val) => {
    if (typeof val === 'number') {
      const numberAsString = `${val}`;

      return parseInt(numberAsString);
    }

    const numberAsString =
      typeof defaultValue === 'number'
        ? z.string().parse(val ?? `${defaultValue}`)
        : z.string().parse(val);

    return parseInt(numberAsString);
  }, z.number().int());

export const rootUrl = (params: { removeLastSlash?: boolean } = {}) =>
  z.preprocess((val) => {
    if (typeof val !== 'string') {
      return val;
    }

    const { removeLastSlash = false } = params;

    const url = new URL(val);

    const origin = url.origin;

    if (removeLastSlash && origin.endsWith('/')) {
      return origin.trimEnd();
    }

    return origin;
  }, z.string().url());

export const base64 = z
  .string()
  .min(1)
  .regex(/^[-A-Za-z0-9+/]*={0,3}$/u) // TODO: update zod to 3.23.0 to use the built-in base64 method after https://github.com/react-hook-form/resolvers/issues/675 is resolved
  // We need to convert decode the base64 string and replace the raw newlines
  .transform((val) =>
    Buffer.from(val, 'base64').toString('utf8').replace(/\\n/gu, '\n')
  );
