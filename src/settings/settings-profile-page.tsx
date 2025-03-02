import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

export function SettingsProfile() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('profile')}</h3>
        <p className="text-sm text-muted-foreground">{t('profile-desc')}</p>
      </div>
      <Separator />
      <div className="space-y-8">
        <Label>{t('email')}</Label>
        <Input aria-label="email" disabled value="aliciasoh@example.com" />
      </div>
    </div>
  );
}
