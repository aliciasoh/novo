import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LoginForm } from './login-form'; // Adjust the path if needed
import { initializeRouter } from '@/test/router';
import { RouterProvider } from '@tanstack/react-router';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';

// Mock react-i18next
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
    // Check if the title and description are rendered
    expect(screen.getByText('login-to-your-account')).toBeInTheDocument();
    expect(screen.getByText('enter-email-login')).toBeInTheDocument();

    // Check if email input field is rendered
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('email-placeholder')
    ).toBeInTheDocument();

    // Check if password input field is rendered
    expect(screen.getByLabelText('password')).toBeInTheDocument();

    // Check if the submit button is rendered
    expect(screen.getByText('login')).toBeInTheDocument();

    // Check if the 'forgot password' link is rendered
    expect(screen.getByText('forgot-password')).toBeInTheDocument();

    // Check if 'login with google' button is rendered
    expect(screen.getByText('login-with-google')).toBeInTheDocument();

    // Check if 'sign-up' link is rendered
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
    // Check if the 'forgot password' link is clickable
    const forgotPasswordLink = screen.getByText('forgot-password');
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '#');

    // Check if the 'sign-up' link is clickable
    const signUpLink = screen.getByText('sign-up');
    expect(signUpLink.closest('a')).toHaveAttribute('href', '#');

    // Check if the login with google button is rendered
    const googleButton = screen.getByText('login-with-google');
    expect(googleButton).toBeInTheDocument();
  });

  it('should show the correct placeholder text in the email input field', () => {
    const emailInput = screen.getByPlaceholderText('email-placeholder');
    expect(emailInput).toBeInTheDocument();
  });

  it('should render the correct translated text', () => {
    // Ensure the text keys are correctly replaced with mock values
    expect(screen.getByText('login-to-your-account')).toBeInTheDocument();
    expect(screen.getByText('enter-email-login')).toBeInTheDocument();
    expect(screen.getByText('forgot-password')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });
});
