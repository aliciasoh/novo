import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function LoginForm() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col text-center">
          <Card>
            <CardHeader>
              <CardTitle>{t('login-with-sso')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" asChild>
                      <Link to="/dashboard">{t('login')}</Link>
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
