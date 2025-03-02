import { ViewExperiment } from '@/experiments/experiment-view';
import { experimentQueryFn } from '@/hooks/useExperiment';
import { queryClient } from '@/main';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout/experiment/$id')({
  component: ViewExperiment,
  loader: async ({ params }) => {
    const { id } = params;
    try {
      const data = await queryClient.ensureQueryData(experimentQueryFn(id));
      if (data.error) {
        throw new Error(data.status);
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
