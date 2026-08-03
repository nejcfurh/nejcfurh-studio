import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from './label';

describe('Label', () => {
  it('carries the data-slot the sibling field styles select on', () => {
    const { container } = render(<Label>Email</Label>);

    expect(container.querySelector('[data-slot="label"]')).not.toBeNull();
  });

  it('keeps its base classes when a consumer adds its own', () => {
    const { container } = render(<Label className="text-destructive" />);
    const className = container.querySelector('label')?.className ?? '';

    expect(className).toContain('text-destructive');
    expect(className).toContain('font-medium');
  });
});
