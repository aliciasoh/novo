import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export const DraftFormLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="min-w-[800px] flex-col flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav header={t('create-experiment-header')} hideHeaderButtons />
            <div className="ml-auto flex items-center space-x-4">
              <Button asChild>
                <Link to="/dashboard">{t('close')}</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="m-auto my-10">{children}</div>
      </div>
    </>
  );
};
