import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ViewExperiment } from './experiment-view';
import { RouterProvider } from '@tanstack/react-router';
import { initializeRouter } from '@/test/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
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

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

const TestFixture = () => {
  return <ViewExperiment />;
};

describe('ViewExperiment accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(<TestFixture />);
    server.use(
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/experiments`,
        ({ request }) => {
          const url = new URL(request.url);
          const id = url.searchParams.get('id');
          if (id === '1') {
            return HttpResponse.json({
              name: 'test name',
              description: 'test desc',
              date: 'Sun Mar 02 2025 10:01:24 GMT+0000 (Greenwich Mean Time)',
            });
          }
        }
      )
    );
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});
describe('ViewExperiment', () => {
  beforeEach(() => {
    const router = initializeRouter(<TestFixture />);

    server.use(
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/experiments`,
        ({ request }) => {
          const url = new URL(request.url);
          const id = url.searchParams.get('id');
          if (id === '1') {
            return HttpResponse.json({
              name: 'test name',
              description: 'test desc',
              date: 'Sun Mar 02 2025 10:01:24 GMT+0000 (Greenwich Mean Time)',
            });
          }
        }
      )
    );
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });

  it('should render the experiment data in read-only mode', async () => {
    await waitFor(() => {
      expect(screen.getByText('March 2nd, 2025')).toBeInTheDocument();
    });

    expect(screen.getByText('read-only-mode')).toBeInTheDocument();

    expect(screen.getByLabelText('name')).toHaveValue('test name');
    expect(screen.getByLabelText('description')).toHaveValue('test desc');

    expect(screen.getByLabelText('name')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('description')).toHaveAttribute('readonly');
    expect(
      screen.getByText('March 2nd, 2025').closest('button')
    ).toHaveAttribute('disabled');
  });
});
