import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from '@tanstack/react-router';
import { useExperiment } from '@/hooks/useExperiment';
import { Experiment } from '@/api-types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export const ViewExperiment = () => {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const { data: experiment } = useExperiment(id ?? '');
  const form = useForm<Experiment>({
    values: experiment,
  });

  return (
    <>
      <div className="min-w-[800px] flex-col flex">
        <div className="m-auto my-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{t('view-experiment')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('read-only-mode')}
              </p>
            </div>
            <Separator />
            <Form {...form}>
              <form className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          placeholder={t('experiment-name-placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('experiment-name-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('date')}</FormLabel>
                      <FormControl>
                        <Button
                          disabled
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {format(field.value, 'PPP')}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                      <FormDescription>
                        {t('date-of-experiment')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          readOnly
                          {...field}
                          placeholder={t('enter-description-placeholder')}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('experiment-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
