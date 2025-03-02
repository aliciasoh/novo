import { render, screen } from '@testing-library/react';
import { DashboardLayout } from './dashboard-layout';
import { RouterProvider } from '@tanstack/react-router';
import { initializeRouter } from '@/test/router';
import { vi } from 'vitest';
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
    <DashboardLayout>
      <div data-testid="child-content">Dashboard Content</div>
    </DashboardLayout>
  );
};
describe('DashboardLayout accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(<TestFixture />);
    const { container } = render(<RouterProvider router={router} />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
describe('DashboardLayout', () => {
  beforeEach(() => {
    const router = initializeRouter(<TestFixture />);
    render(<RouterProvider router={router} />);
  });

  it('should render the layout with navigation and children correctly', async () => {
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();

    const dashboard = screen.getByRole('link', { name: 'dashboard' });
    const create = screen.getByRole('link', { name: 'create-new' });
    expect(dashboard).toBeInTheDocument();
    expect(create).toBeInTheDocument();
    expect(screen.getByText('experiment-website')).toBeInTheDocument();
    expect(screen.getByText('AS')).toBeInTheDocument();

    expect(screen.getByTestId('child-content')).toHaveTextContent(
      'Dashboard Content'
    );
  });
});
