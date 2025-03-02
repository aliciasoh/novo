import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DraftFormLayout } from './create-draft-layout';
import { RouterProvider } from '@tanstack/react-router';
import { initializeRouter } from '@/test/router';
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

const TestFixture = () => {
  return (
    <DraftFormLayout>
      <div>Test Children</div>
    </DraftFormLayout>
  );
};
describe('DraftFormLayout accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(<TestFixture />);
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
describe('DraftFormLayout', () => {
  beforeEach(() => {
    const router = initializeRouter(<TestFixture />);
    render(<RouterProvider router={router} />);
  });
  it('should render the layout and translations correctly', async () => {
    expect(
      await screen.findByText('create-experiment-header')
    ).toBeInTheDocument();
    expect(screen.getByText('close')).toBeInTheDocument();
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });
  it('should navigate to the dashboard when the "Close" button is clicked', () => {
    const button = screen.getByRole('link');
    expect(button).toHaveAttribute('href', '/dashboard');
  });
});
