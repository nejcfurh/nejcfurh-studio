import { describe, expect, it } from 'vitest';

import { invalid } from './action-result';
import { z } from './index';

const parse = (schema: z.ZodType, value: unknown) => {
  const result = schema.safeParse(value);
  if (result.success) throw new Error('expected the parse to fail');
  return invalid(result.error);
};

describe('invalid', () => {
  it('keys each message by its field', () => {
    const result = parse(
      z.object({
        name: z.string().min(1, 'Name is required'),
        price: z.number().min(50, 'Too cheap')
      }),
      { name: '', price: 1 }
    );

    expect(result).toMatchObject({
      status: 'invalid',
      fieldErrors: { name: ['Name is required'], price: ['Too cheap'] }
    });
  });

  it('collects several messages for one field', () => {
    const result = parse(
      z.object({
        name: z.string().min(5, 'Too short').regex(/^x/u, 'Must start with x')
      }),
      { name: 'ab' }
    );

    expect(result).toMatchObject({
      fieldErrors: { name: ['Too short', 'Must start with x'] }
    });
  });

  it('routes a cross-field refinement to the field it names', () => {
    // Mirrors the listing schema: the rule spans two fields but reports on one.
    const schema = z
      .object({ regularPrice: z.number(), discountedPrice: z.number() })
      .refine((v) => v.discountedPrice < v.regularPrice, {
        message: 'Discounted price must be lower than the regular price',
        path: ['discountedPrice']
      });

    const result = parse(schema, { regularPrice: 100, discountedPrice: 200 });

    expect(result).toMatchObject({
      fieldErrors: {
        discountedPrice: [
          'Discounted price must be lower than the regular price'
        ]
      }
    });
    expect(result).not.toHaveProperty('formError', expect.any(String));
  });

  it('promotes a pathless refinement to the form level', () => {
    const schema = z
      .object({ a: z.number(), b: z.number() })
      .refine((v) => v.a < v.b, { message: 'a must be below b' });

    const result = parse(schema, { a: 2, b: 1 });

    expect(result).toMatchObject({
      status: 'invalid',
      fieldErrors: {},
      formError: 'a must be below b'
    });
  });

  it('uses the dotted path a form addresses a nested field by', () => {
    const schema = z.object({
      owner: z.object({ name: z.string().min(1, 'Required') })
    });

    const result = parse(schema, { owner: { name: '' } });

    expect(result).toMatchObject({
      fieldErrors: { 'owner.name': ['Required'] }
    });
  });

  it('uses an indexed path for an array member', () => {
    const schema = z.object({ tags: z.array(z.string().min(2, 'Too short')) });

    const result = parse(schema, { tags: ['ok', 'x'] });

    expect(result).toMatchObject({ fieldErrors: { 'tags.1': ['Too short'] } });
  });
});
