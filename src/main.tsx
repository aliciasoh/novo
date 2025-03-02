// src/main.tsx
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorPage } from './components/error-page';
import { NotFoundPage } from './components/not-found-page';
import './i18'; // Keep i18n initialization
import { Suspense } from 'react';
import { SkeletonLoading } from './components/skeleton-loading';

// Utility to initialize MSW (moved out of main.tsx)
async function initializeMSW() {
  if (import.meta.env.VITE_MOCK && import.meta.env.MODE !== 'test') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
}

// Set up the router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorPage,
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Export QueryClient for reuse elsewhere
export const queryClient = new QueryClient();

// Main render function
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

// Initialize app
async function initApp() {
  await initializeMSW(); // Start MSW if applicable
  renderApp(); // Render the app
}

// Start the app
initApp().catch((error) => {
  console.error('Failed to initialize app:', error);
});
