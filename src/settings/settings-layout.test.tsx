import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsLayout } from './settings-layout'; // Adjust the path if needed
import { axe } from 'jest-axe';
import { RouterProvider } from '@tanstack/react-router';
import { initializeRouter } from '@/test/router';

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

describe('SettingsLayout accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(
      <SettingsLayout>
        <div>Children Content</div>
      </SettingsLayout>
    );
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
describe('SettingsLayout Component', () => {
  beforeEach(() => {
    const router = initializeRouter(
      <SettingsLayout>
        <div>Children Content</div>
      </SettingsLayout>
    );
    render(<RouterProvider router={router} />);
  });
  it('should render settings layout correctly', () => {
    // Check if the title and description are rendered
    expect(screen.getByText('settings')).toBeInTheDocument();
    expect(screen.getByText('settings-desc')).toBeInTheDocument();

    // Check if the sidebar navigation items are rendered
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();

    // Check if the children content is rendered
    expect(screen.getByText('Children Content')).toBeInTheDocument();
  });

  it('should have correct links in the sidebar', () => {
    // Check if the sidebar links have correct href attributes
    expect(screen.getByText('Overview').closest('a')).toHaveAttribute(
      'href',
      '/settings'
    );
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute(
      'href',
      '/settings/profile'
    );
    expect(screen.getByText('Language').closest('a')).toHaveAttribute(
      'href',
      '/settings/language'
    );
    expect(screen.getByText('Help').closest('a')).toHaveAttribute(
      'href',
      '/settings/help'
    );
  });
});
