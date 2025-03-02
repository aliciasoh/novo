import { ExperimentsTabsViewWithTable } from '@/experiments/experiments-tabs-view-with-table';
import { draftExperimentsQueryFn } from '@/hooks/useDraftExperiments';
import { experimentsQueryFn } from '@/hooks/useExperiments';
import { queryClient } from '@/main';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout/')({
  component: ExperimentsTabsViewWithTable,
  loader: async () => {
    try {
      const [draftExp, exp] = await Promise.all([
        queryClient.ensureQueryData(draftExperimentsQueryFn),
        queryClient.ensureQueryData(experimentsQueryFn),
      ]);
      if (draftExp.error && exp.error) {
        throw new Error(exp.status);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '404') {
          throw notFound();
        } else {
          throw new Error('Failed to load data');
        }
      }
    }
  },
});
