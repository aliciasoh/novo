import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SettingsLanguage } from './settings-language';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { language: 'en', changeLanguage: vi.fn() },
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

    expect(screen.getByText('language')).toBeInTheDocument();
    expect(screen.getByText('language-desc')).toBeInTheDocument();
    expect(screen.getByText('select-lang')).toBeInTheDocument();

    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should show the correct language options in the dropdown menu', async () => {
    render(<SettingsLanguage />);

    await user.click(screen.getByText('EN'));

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Norsk')).toBeInTheDocument();
  });

  it('should change the language when a new language is selected', async () => {
    render(<SettingsLanguage />);

    await user.click(screen.getByText('EN'));

    await user.click(screen.getByText('Norsk'));

    expect(localStorage.getItem('language')).toBe('nor');
  });
});
