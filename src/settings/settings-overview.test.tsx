import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsOverview } from './settings-overview';
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

describe('SettingsOverview Component', () => {
  it('should render the settings overview correctly', () => {
    render(<SettingsOverview />);

    expect(screen.getByText('overview')).toBeInTheDocument();
    expect(screen.getByText('overview-desc')).toBeInTheDocument();
  });

  it('should submit accessibility correctly', async () => {
    const { container } = render(<SettingsOverview />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
