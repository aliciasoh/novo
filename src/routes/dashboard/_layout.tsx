import { DashboardLayout } from '@/dashboard/dashboard-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';

function Index() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export const Route = createFileRoute('/dashboard/_layout')({
  component: Index,
});
