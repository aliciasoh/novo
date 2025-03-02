import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export function Search() {
  const { t } = useTranslation();

  return (
    <div>
      <Input
        type="search"
        placeholder={t('search-placeholder')}
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
