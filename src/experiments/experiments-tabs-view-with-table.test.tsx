import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ExperimentsTabsViewWithTable } from './experiments-tabs-view-with-table';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { initializeRouter } from '@/test/router';
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
    useRouterState: () => ({ location: { hash: '' } }),
    h,
  };
});

const TestFixture = () => {
  return <ExperimentsTabsViewWithTable />;
};

const user = userEvent.setup();
describe('ExperimentsTabsViewWithTable accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(<TestFixture />);
    server.use(
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/experiments`,
        ({ request }) => {
          return HttpResponse.json([
            {
              id: '1',
              name: 'Exp 1',
              description: 'Exp 1 desc',
              date: '2025-03-01',
            },
            {
              id: '2',
              name: 'Exp 2',
              description: 'Exp 2 desc',
              date: '2025-03-15',
            },
          ]);
        }
      ),
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`,
        ({ request }) => {
          return HttpResponse.json([
            {
              id: 'd1',
              name: 'Draft 1',
              description: 'Draft 1 desc',
              date: '2025-03-05',
            },
            {
              id: 'd2',
              name: 'Draft 2',
              description: 'Draft 2 desc',
              date: '2025-03-20',
            },
          ]);
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
describe('ExperimentsTabsViewWithTable', () => {
  beforeEach(() => {
    server.use(
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/experiments`,
        ({ request }) => {
          return HttpResponse.json([
            {
              id: '1',
              name: 'Exp 1',
              description: 'Exp 1 desc',
              date: '2025-03-01',
            },
            {
              id: '2',
              name: 'Exp 2',
              description: 'Exp 2 desc',
              date: '2025-03-15',
            },
          ]);
        }
      ),
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`,
        ({ request }) => {
          return HttpResponse.json([
            {
              id: 'd1',
              name: 'Draft 1',
              description: 'Draft 1 desc',
              date: '2025-03-05',
            },
            {
              id: 'd2',
              name: 'Draft 2',
              description: 'Draft 2 desc',
              date: '2025-03-20',
            },
          ]);
        }
      )
    );

    const router = initializeRouter(
      <QueryClientProvider client={queryClient}>
        <TestFixture />
      </QueryClientProvider>
    );
    render(<RouterProvider router={router} />);
  });

  it('should render tabs with experiments data by default', async () => {
    await waitFor(() => {
      expect(screen.getByText('Exp 1')).toBeInTheDocument();
    });

    expect(screen.getByText('experiments')).toBeInTheDocument();
    expect(screen.getByText('draft-experiments')).toBeInTheDocument();

    expect(screen.getByText('dashboard')).toBeInTheDocument();
    expect(screen.getByText('Exp 2')).toBeInTheDocument();
    expect(screen.queryByText('Draft 1')).not.toBeInTheDocument();
  });

  it('should switch to draft-experiments tab and show drafts', async () => {
    const draftTab = screen.getByText('draft-experiments');
    await user.click(draftTab);

    await waitFor(() => {
      expect(screen.getByText('Draft 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Draft 2')).toBeInTheDocument();
    expect(screen.queryByText('Exp 1')).not.toBeInTheDocument();
  });
});
