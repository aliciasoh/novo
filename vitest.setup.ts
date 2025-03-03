import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom';
import { server } from '@/mocks/server';

global.indexedDB = {
  open: () => ({ result: {}, onupgradeneeded: () => {}, onsuccess: () => {} }),
} as any;
console.error = () => {
  return;
};
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
