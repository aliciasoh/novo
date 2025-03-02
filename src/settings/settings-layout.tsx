import { DashboardLayout } from '@/dashboard/dashboard-layout';
import { LinkProps } from '@tanstack/react-router';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/sidebar-nav';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const sidebarNavItems = [
  {
    title: 'Overview',
    to: '/settings' as LinkProps['to'],
  },
  {
    title: 'Profile',
    to: '/settings/profile' as LinkProps['to'],
  },
  {
    title: 'Language',
    to: '/settings/language' as LinkProps['to'],
  },
  {
    title: 'Help',
    to: '/settings/help' as LinkProps['to'],
  },
];

export const SettingsLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{t('settings')}</h2>
          <p className="text-muted-foreground">{t('settings-desc')}</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 flex-row space-x-12 space-y-0">
          <aside className="-mx-4 w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 max-w-2xl">{children}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};
