import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsLanguage } from './settings-language'; // Adjust the path if needed
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

// Mock react-i18next
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key, // Mock translation function to return the key
      i18n: { language: 'en', changeLanguage: vi.fn() }, // Mock language and changeLanguage method
    }),
  };
});

const user = userEvent.setup();

describe('SettingsLanguage accessibility', () => {
  it('accessibility', async () => {
    const { container } = render(<SettingsLanguage />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
describe('SettingsLanguage Component', () => {
  it('should render the language selection elements correctly', () => {
    render(<SettingsLanguage />);

    // Check if the title, description, and language label are rendered
    expect(screen.getByText('language')).toBeInTheDocument();
    expect(screen.getByText('language-desc')).toBeInTheDocument();
    expect(screen.getByText('select-lang')).toBeInTheDocument();

    // Check if the dropdown menu button is rendered with the correct language (default 'en')
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should show the correct language options in the dropdown menu', async () => {
    render(<SettingsLanguage />);

    // Click the dropdown to open it
    await user.click(screen.getByText('EN'));

    // Check if the language options are visible
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Norsk')).toBeInTheDocument();
  });

  it('should change the language when a new language is selected', async () => {
    render(<SettingsLanguage />);

    // Click the dropdown to open it
    await user.click(screen.getByText('EN'));

    // Select "Norsk" from the dropdown
    await user.click(screen.getByText('Norsk'));

    // Ensure the language is changed and localStorage is updated
    expect(localStorage.getItem('language')).toBe('nor');
  });
});
