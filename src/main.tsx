import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorPage } from './components/error-page';
import { NotFoundPage } from './components/not-found-page';
import './i18';
import { Suspense } from 'react';
import { SkeletonLoading } from './components/skeleton-loading';

async function initializeMSW() {
  if (import.meta.env.VITE_MOCK && import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorPage,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const queryClient = new QueryClient();

function renderApp() {
  const rootElement = document.getElementById('app');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<SkeletonLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    );
  }
}

async function initApp() {
  await initializeMSW();
  renderApp();
}

initApp().catch((error) => {
  console.error('Failed to initialize app:', error);
});
