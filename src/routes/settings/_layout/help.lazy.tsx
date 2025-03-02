import { SettingsHelp } from '@/settings/settings-help';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/settings/_layout/help')({
  component: SettingsHelp,
});
