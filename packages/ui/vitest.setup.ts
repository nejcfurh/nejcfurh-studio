import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// RTL only self-registers cleanup when vitest runs with globals enabled.
afterEach(cleanup);
