import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const isAuthenticated = false;
    if (!isAuthenticated) {
      return redirect({
        to: '/login',
      });
    } else {
      return redirect({
        to: '/dashboard',
      });
    }
  },
});
