import { SettingsProfile } from '@/settings/settings-profile-page';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/settings/_layout/profile')({
  component: SettingsProfile,
});
