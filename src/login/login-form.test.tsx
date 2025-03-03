import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LoginForm } from './login-form';
import { initializeRouter } from '@/test/router';
import { RouterProvider } from '@tanstack/react-router';
import { axe } from 'jest-axe';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});
describe('LoginForm accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(<LoginForm />);
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
describe('LoginForm Component', () => {
  beforeEach(() => {
    const router = initializeRouter(<LoginForm />);
    render(<RouterProvider router={router} />);
  });

  it('should render the login form elements correctly', () => {
    expect(screen.getByText('login-with-sso')).toBeInTheDocument();
  });
});
