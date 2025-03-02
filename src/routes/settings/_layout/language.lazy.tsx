import { SettingsLanguage } from '@/settings/settings-language';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/settings/_layout/language')({
  component: SettingsLanguage,
});
