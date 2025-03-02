import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ExperimentsTable } from './experiments-table';
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

const mockData = [
  {
    id: '1',
    name: 'Experiment 1',
    description: 'First experiment desc',
    date: '2025-03-01',
  },
  {
    id: '2',
    name: 'Experiment 2',
    description: 'Second experiment desc',
    date: '2025-04-01',
  },
];

const TestFixture = ({ isDraft = false }: { isDraft?: boolean }) => {
  return (
    <ExperimentsTable
      data={mockData}
      isDraft={isDraft}
      onClickRefresh={vi.fn()}
      isRefetching={false}
    />
  );
};
const user = userEvent.setup();
describe('ExperimentsTable accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(<TestFixture />);
    server.use(
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/experiments`,
        ({ request }) => {
          const url = new URL(request.url);
          const id = url.searchParams.get('id');
          if (id === '1') {
            return HttpResponse.json(mockData[0]);
          }
          return HttpResponse.json(mockData);
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
describe('ExperimentsTable', () => {
  beforeEach(() => {
    const router = initializeRouter(
      <QueryClientProvider client={queryClient}>
        <TestFixture />
      </QueryClientProvider>
    );
    render(<RouterProvider router={router} />);

    server.use(
      http.get(
        `${import.meta.env.VITE_API_BASE_URL}/experiments`,
        ({ request }) => {
          const url = new URL(request.url);
          const id = url.searchParams.get('id');
          if (id === '1') {
            return HttpResponse.json(mockData[0]);
          }
          return HttpResponse.json(mockData);
        }
      )
    );
  });

  it('should render the table with experiment data', async () => {
    await waitFor(() => {
      expect(screen.getByText('name')).toBeInTheDocument();
    });

    expect(screen.getByText('description')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'view' })).toHaveLength(2);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);

    const row1 = within(rows[1]);
    expect(row1.getByText('Experiment 1')).toBeInTheDocument();
    expect(row1.getByText('First experiment desc')).toBeInTheDocument();
    expect(row1.getByText('2025-03-01')).toBeInTheDocument();
    expect(row1.getByText('view')).toBeInTheDocument();

    const row2 = within(rows[2]);
    expect(row2.getByText('Experiment 2')).toBeInTheDocument();
    expect(row2.getByText('Second experiment desc')).toBeInTheDocument();
    expect(row2.getByText('2025-04-01')).toBeInTheDocument();
    expect(row2.getByText('view')).toBeInTheDocument();
  });

  it('should filter experiments by name', async () => {
    const filterInput = screen.getByPlaceholderText('filter-term');
    const filterByButton = screen.getByText('filter-by');

    await user.click(filterByButton);
    await user.click(screen.getByRole('menuitem', { name: 'name' }));

    await user.type(filterInput, 'Experiment 1');

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2);
      expect(within(rows[1]).getByText('Experiment 1')).toBeInTheDocument();
      expect(screen.queryByText('Experiment 2')).not.toBeInTheDocument();
    });
  });

  it('should sort experiments by date', async () => {
    const dateHeader = screen.getByText('date');
    await user.click(dateHeader);

    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('2025-03-01')).toBeInTheDocument();
    expect(within(rows[2]).getByText('2025-04-01')).toBeInTheDocument();
  });

  it('should render draft actions when isDraft is true', async () => {
    const router = initializeRouter(
      <QueryClientProvider client={queryClient}>
        <TestFixture isDraft />
      </QueryClientProvider>
    );
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getAllByText('edit')[0]).toBeInTheDocument();
    });

    const editLinks = screen.getAllByText('edit');
    expect(editLinks[0].closest('a')).toHaveAttribute(
      'href',
      '/create/draft-experiment/1'
    );
    expect(editLinks[1].closest('a')).toHaveAttribute(
      'href',
      '/create/draft-experiment/2'
    );
  });
});
