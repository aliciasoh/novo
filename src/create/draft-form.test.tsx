import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { DraftForm } from './draft-form';
import { RouterProvider } from '@tanstack/react-router';
import { initializeRouter } from '@/test/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { format } from 'date-fns';
import userEvent from '@testing-library/user-event';
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
  return <DraftForm />;
};

describe('DraftForm accessibility', () => {
  it('accessibility', async () => {
    const router = initializeRouter(<TestFixture />);
    server.use(
      http.post(`${import.meta.env.VITE_API_BASE_URL}/experiments`, () => {
        return HttpResponse.json(1);
      }),
      http.delete(
        `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`,
        ({ request }) => {
          const url = new URL(request.url);
          const id = url.searchParams.get('id');
          if (id === '1') {
            return HttpResponse.json();
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
describe('DraftForm', () => {
  beforeEach(() => {
    const router = initializeRouter(<TestFixture />);
    server.use(
      http.post(`${import.meta.env.VITE_API_BASE_URL}/experiments`, () => {
        return HttpResponse.json(1);
      }),
      http.delete(
        `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`,
        ({ request }) => {
          const url = new URL(request.url);
          const id = url.searchParams.get('id');
          if (id === '1') {
            return HttpResponse.json();
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

  it('should render the form with form elements and button correctly', async () => {
    await waitFor(() => {
      expect(screen.getByText('create-new-experiment')).toBeInTheDocument();
    });

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
    expect(screen.getByText('create-experiment')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'create-experiment' })
    ).toBeInTheDocument();
  });

  it('should submit the form without any error messages', async () => {
    const user = userEvent.setup();

    const nameInput = screen.getByRole('textbox', { name: 'name' });
    const descriptionInput = screen.getByRole('textbox', {
      name: 'description',
    });
    const submitButton = screen.getByRole('button', {
      name: 'create-experiment',
    });

    await user.type(nameInput, 'test name');
    await user.type(descriptionInput, 'test desc');
    const date = new Date();
    const formattedDate = format(date, 'PPP');

    expect(nameInput).toHaveValue('test name');
    expect(descriptionInput).toHaveValue('test desc');
    expect(screen.getByText(formattedDate.toString())).toBeInTheDocument();

    await user.click(submitButton);

    expect(screen.queryByText('name-validation-min')).not.toBeInTheDocument();
    expect(
      screen.queryByText('date-validation-required')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('description-validation-required')
    ).not.toBeInTheDocument();
  });

  it('should submit the form and trigger error messages', async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', {
      name: 'create-experiment',
    });

    const date = new Date();
    const formattedDate = format(date, 'PPP');

    expect(screen.getByText(formattedDate.toString())).toBeInTheDocument();

    await user.click(submitButton);

    expect(screen.getByText('name-validation-min')).toBeInTheDocument();
    expect(screen.getByText('description-validation-min')).toBeInTheDocument();
  });
});
