import { Button } from '@/components/ui/button';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useBlocker, useNavigate, useParams } from '@tanstack/react-router';
import { useCreateExperiment } from '@/hooks/useCreateExperiment';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useDraftExperiment } from '@/hooks/useDraftExperiment';
import { LeaveDialog } from '@/components/leave-dialog';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useDeleteDraftExperiment } from '@/hooks/useDeleteDraftExperiment';
import { useTranslation } from 'react-i18next';
import { useSaveDraftExperiment } from '@/hooks/useSaveDraftExperiment';
import { useUpdateDraftExperiment } from '@/hooks/useUpdateDraftExperiment';

export const DraftForm = () => {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const { data: draftExperiment } = useDraftExperiment(id ?? '');
  const { mutate: deleteDraft } = useDeleteDraftExperiment();
  const { mutate: saveDraft } = useSaveDraftExperiment();
  const { mutate: updateDraft } = useUpdateDraftExperiment();
  const { mutate: create } = useCreateExperiment();
  const { closeDialog, isOpen, setIsOpen, openDialog } = useAlertDialog();
  const navigate = useNavigate();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: t('name-validation-min'),
      })
      .max(30, {
        message: t('name-validation-max'),
      }),
    date: z.date({
      required_error: t('date-validation-required'),
    }),
    description: z
      .string({
        required_error: t('description-validation-required'),
      })
      .min(2, {
        message: t('description-validation-min'),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      date: new Date(),
      description: '',
    },
  });
  const {
    setValue,
    formState: { isDirty },
    getValues,
  } = form;

  useBlocker({
    shouldBlockFn: ({ next }) => {
      if (next.fullPath.includes('/dashboard/experiment')) {
        return false;
      } else {
        if (isDirty) {
          return new Promise(async (resolve) => {
            const response = await openDialog();
            if (response) {
              if (id) {
                const values = getValues();
                const data = {
                  name: values.name,
                  date: values.date.toString(),
                  description: values.description,
                };
                updateDraft(
                  { data, id },
                  {
                    onSuccess: () => {
                      toast(t('draft-updated-successfully'));
                      resolve(false);
                    },
                    onError: () => {
                      toast(t('failed-to-updated-draft'));
                      resolve(true);
                    },
                  }
                );
              } else {
                const values = getValues();
                const data = {
                  name: values.name,
                  date: values.date.toString(),
                  description: values.description,
                };
                saveDraft(data, {
                  onSuccess: () => {
                    toast(t('draft-created-successfully'));
                    resolve(false);
                  },
                  onError: () => {
                    toast(t('failed-to-create-draft'));
                    resolve(true);
                  },
                });
              }
            } else {
              resolve(response);
            }
          });
        } else {
          return false;
        }
      }
    },
  });

  useEffect(() => {
    if (draftExperiment) {
      setValue('name', draftExperiment.name ?? '');
      setValue(
        'date',
        draftExperiment.date ? new Date(draftExperiment.date) : new Date()
      );
      setValue('description', draftExperiment.description ?? '');
    }
  }, [draftExperiment]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      name: values.name,
      date: values.date.toString(),
      description: values.description,
    };
    create(data, {
      onSuccess: (data) => {
        if (id) {
          deleteDraft(id, {
            onSuccess: () => {
              toast(t('experiment-created-successfully'));
              navigate({
                to: '/dashboard/experiment/$id',
                params: { id: data },
              });
            },
            onError: () => {
              toast(t('failed-to-delete-draft'));
            },
          });
        } else {
          toast(t('experiment-created-successfully'));
          navigate({
            to: '/dashboard/experiment/$id',
            params: { id: data },
          });
        }
      },
      onError: () => {
        toast(t('failed-to-create-experiment'));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('create-new-experiment')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('save-as-draft-description')}
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>{t('pick-a-date')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>{t('date-of-the-experiment')}</FormDescription>
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
                    {...field}
                    placeholder={t('enter-description-placeholder')}
                  />
                </FormControl>
                <FormDescription>{t('experiment-description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t('create-experiment')}</Button>
        </form>
      </Form>
      {isOpen && (
        <LeaveDialog closeDialog={closeDialog} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};
