import { server } from './src/mocks/server';
import { afterEach, beforeAll, afterAll } from 'vitest';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
