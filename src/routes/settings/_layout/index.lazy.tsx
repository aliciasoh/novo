import { SettingsOverview } from '@/settings/settings-overview';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/settings/_layout/')({
  component: SettingsOverview,
});
