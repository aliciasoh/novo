import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const isAuthenticated = context.auth;
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    } else {
      redirect({
        to: '/dashboard',
      });
    }
  },
});
