import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface MainNavProps {
  header?: string;
  hideHeaderButtons?: boolean;
}

export function MainNav({ header, hideHeaderButtons }: MainNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      <h1 className="text-md font-bold tracking-tight">
        {header ?? t('experiment-website')}
      </h1>
      {!hideHeaderButtons && (
        <>
          <Link
            to="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('dashboard')}
          </Link>
          <Button asChild>
            <Link to="/create" className="text-sm font-medium">
              {t('create-new')}
            </Link>
          </Button>
        </>
      )}
    </nav>
  );
}
