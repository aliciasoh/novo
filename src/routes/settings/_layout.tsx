import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SettingsLayout } from '@/settings/settings-layout';

function Index() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  );
}

export const Route = createFileRoute('/settings/_layout')({
  component: Index,
});
