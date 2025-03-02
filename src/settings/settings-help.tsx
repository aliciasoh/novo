import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function SettingsHelp() {
  const { t } = useTranslation();

  const helpFormSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: t('title-validation-min'),
      })
      .max(30, {
        message: t('title-validation-max'),
      }),
    email: z
      .string({
        required_error: t('email-validation-required'),
      })
      .email(t('email-validation-invalid')),
    body: z
      .string()
      .min(2, {
        message: t('body-validation-min'),
      })
      .max(160, {
        message: t('body-validation-max'),
      }),
  });

  type HelpFormValues = z.infer<typeof helpFormSchema>;

  const form = useForm<HelpFormValues>({
    resolver: zodResolver(helpFormSchema),
    defaultValues: {
      title: '',
      email: '',
      body: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof helpFormSchema>) => {
    // Integrate with GitHub issues or ServiceNow
    console.log(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('help')}</h3>
        <p className="text-sm text-muted-foreground">{t('help-desc')}</p>
      </div>
      <Separator />
      <div className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('title')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('title-placeholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('title-description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('email-placeholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('email-description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('body')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('body-placeholder')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t('body-description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t('create-ticket')}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
