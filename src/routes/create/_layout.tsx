import { DraftFormLayout } from '@/create/create-draft-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/create/_layout')({
  component: Index,
});

function Index() {
  return (
    <DraftFormLayout>
      <Outlet />
    </DraftFormLayout>
  );
}
