import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { ReactNode } from 'react';

export const initializeRouter = (component: ReactNode) => {
  const history = createMemoryHistory({
    initialEntries: ['/'],
  });
  const rootRoute = createRootRoute({
    component: () => component,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  });

  const routeTree = rootRoute.addChildren([indexRoute]) as any;

  const router = createRouter({ routeTree, history });
  return router;
};
