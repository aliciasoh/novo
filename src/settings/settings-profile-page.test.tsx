import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsProfile } from './settings-profile-page';
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

describe('SettingsProfile Component', () => {
  it('should render the profile section correctly', () => {
    render(<SettingsProfile />);

    expect(screen.getByText('profile')).toBeInTheDocument();
    expect(screen.getByText('profile-desc')).toBeInTheDocument();

    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toHaveValue('aliciasoh@example.com');
    expect(screen.getByLabelText('email')).toBeDisabled();
  });

  it('should submit accessibility correctly', async () => {
    const { container } = render(<SettingsProfile />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
