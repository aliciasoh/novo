import { useTranslation } from 'react-i18next';

export function SettingsOverview() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('overview')}</h3>
        <p className="text-sm text-muted-foreground">{t('overview-desc')}</p>
      </div>
    </div>
  );
}
