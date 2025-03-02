import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsHelp } from './settings-help';
import userEvent from '@testing-library/user-event';
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

const user = userEvent.setup();
describe('SettingsHelp accessibility', () => {
  it('accessibility', async () => {
    const { container } = render(<SettingsHelp />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
describe('SettingsHelp Component', () => {
  it('should render form fields correctly', () => {
    render(<SettingsHelp />);

    expect(screen.getByLabelText('title')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('body')).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('title-placeholder')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('email-placeholder')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('body-placeholder')).toBeInTheDocument();

    expect(screen.getByText('create-ticket')).toBeInTheDocument();
  });

  it('should show validation errors for empty fields on submit', async () => {
    render(<SettingsHelp />);

    const submitButton = screen.getByText('create-ticket');
    await user.click(submitButton);
    expect(screen.getByText('title-validation-min')).toBeInTheDocument();
    expect(screen.getByText('email-validation-invalid')).toBeInTheDocument();
    expect(screen.getByText('body-validation-min')).toBeInTheDocument();
  });

  it('should show correct error messages for invalid email and body length', async () => {
    render(<SettingsHelp />);

    await user.type(screen.getByLabelText('title'), 'Test');
    await user.type(screen.getByLabelText('email'), 'invalid-email');
    await user.type(screen.getByLabelText('body'), 'a');

    const submitButton = screen.getByText('create-ticket');
    await user.click(submitButton);

    expect(screen.getByText('email-validation-invalid')).toBeInTheDocument();
    expect(screen.getByText('body-validation-min')).toBeInTheDocument();
  });

  it('should submit the form with valid data', async () => {
    render(<SettingsHelp />);

    await user.type(screen.getByLabelText('title'), 'Help Needed');
    await user.type(screen.getByLabelText('email'), 'user@example.com');
    await user.type(
      screen.getByLabelText('body'),
      'This is a valid body for the help request.'
    );
    expect(
      screen.queryByText('email-validation-invalid')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('body-validation-min')).not.toBeInTheDocument();
  });
});
