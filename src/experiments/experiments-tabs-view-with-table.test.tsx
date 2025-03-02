// src/create/experiments-tabs-view.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ExperimentsTabsViewWithTable } from './experiments-tabs-view-with-table'; // Adjust path
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { initializeRouter } from '@/test/router';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { axe } from 'jest-axe';

// Mock react-i18next
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouterState: () => ({ location: { hash: '' } }), // Default empty hash
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
    // Dynamic MSW mocking for useExperiments and useDraftExperiments
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
    // Wait for experiments tab content to load from MSW
    await waitFor(() => {
      expect(screen.getByText('Exp 1')).toBeInTheDocument();
    });

    // Check tabs
    expect(screen.getByText('experiments')).toBeInTheDocument();
    expect(screen.getByText('draft-experiments')).toBeInTheDocument();

    // Check default tab (experiments)
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
