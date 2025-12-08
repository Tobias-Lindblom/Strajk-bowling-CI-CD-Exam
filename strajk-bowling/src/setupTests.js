import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Rensar upp efter varje test
afterEach(() => {
  cleanup();
});
