import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LoginForm } from './login-form';
import { initializeRouter } from '@/test/router';
import { RouterProvider } from '@tanstack/react-router';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';

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
const user = userEvent.setup();
describe('LoginForm Component', () => {
  beforeEach(() => {
    const router = initializeRouter(<LoginForm />);
    render(<RouterProvider router={router} />);
  });

  it('should render the login form elements correctly', () => {
    expect(screen.getByText('login-to-your-account')).toBeInTheDocument();
    expect(screen.getByText('enter-email-login')).toBeInTheDocument();

    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('email-placeholder')
    ).toBeInTheDocument();

    expect(screen.getByLabelText('password')).toBeInTheDocument();

    expect(screen.getByText('login')).toBeInTheDocument();

    expect(screen.getByText('forgot-password')).toBeInTheDocument();

    expect(screen.getByText('login-with-google')).toBeInTheDocument();

    expect(screen.getByText('sign-up')).toBeInTheDocument();
  });

  it('should be able to fill in the form and press login button', async () => {
    const email = screen.getByLabelText('email');
    await user.type(email, 'user@example.com');
    const pass = screen.getByLabelText('password');
    await user.type(pass, 'password123');
    await user.click(screen.getByText('login'));
  });

  it('should have clickable links and buttons', () => {
    const forgotPasswordLink = screen.getByText('forgot-password');
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '#');

    const signUpLink = screen.getByText('sign-up');
    expect(signUpLink.closest('a')).toHaveAttribute('href', '#');

    const googleButton = screen.getByText('login-with-google');
    expect(googleButton).toBeInTheDocument();
  });

  it('should show the correct placeholder text in the email input field', () => {
    const emailInput = screen.getByPlaceholderText('email-placeholder');
    expect(emailInput).toBeInTheDocument();
  });

  it('should render the correct translated text', () => {
    expect(screen.getByText('login-to-your-account')).toBeInTheDocument();
    expect(screen.getByText('enter-email-login')).toBeInTheDocument();
    expect(screen.getByText('forgot-password')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });
});
