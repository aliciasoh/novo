import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { worker } from './mocks/browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorPage } from './components/error-page';
import { NotFoundPage } from './components/not-found-page';
import './i18';
import { Suspense } from 'react';
import { SkeletonLoading } from './components/skeleton-loading';

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: false,
  },
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorPage,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const queryClient = new QueryClient();
// Start the mock server
const useMock = import.meta.env.VITE_MOCK;
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  if (useMock) {
    worker.start().then(() => {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<SkeletonLoading />}>
            <RouterProvider router={router} />
          </Suspense>
        </QueryClientProvider>
      );
    });
  } else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<SkeletonLoading />}>
          <RouterProvider router={router} context={{ auth: false }} />
        </Suspense>
      </QueryClientProvider>
    );
  }
}
