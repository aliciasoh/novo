import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsOverview } from './settings-overview'; // Adjust the path if needed
import { axe } from 'jest-axe';

// Mock react-i18next
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key, // Mock translation function to return the key
    }),
  };
});

describe('SettingsOverview Component', () => {
  it('should render the settings overview correctly', () => {
    render(<SettingsOverview />);

    // Check if the title and description are rendered
    expect(screen.getByText('overview')).toBeInTheDocument();
    expect(screen.getByText('overview-desc')).toBeInTheDocument();
  });

  it('should submit accessibility correctly', async () => {
    const { container } = render(<SettingsOverview />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
