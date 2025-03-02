import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { ReactNode } from 'react';

export const initializeRouter = (component: ReactNode) => {
  const history = createMemoryHistory({
    initialEntries: ['/'], // Start at the index route
  });
  // Create the root route
  const rootRoute = createRootRoute({
    component: () => component,
  });

  // Define the index route with the DraftFormLayout as a child route
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  });

  // Add child route to the root route
  const routeTree = rootRoute.addChildren([indexRoute]) as any;

  // Create the router instance
  const router = createRouter({ routeTree, history });
  return router;
};
