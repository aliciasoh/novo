import { DraftForm } from '@/create/draft-form';
import { draftExperimentQueryFn } from '@/hooks/useDraftExperiment';
import { queryClient } from '@/main';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/create/_layout/draft-experiment/$id')({
  component: DraftForm,
  loader: async ({ params }) => {
    const { id } = params;
    try {
      const data = await queryClient.ensureQueryData(
        draftExperimentQueryFn(id)
      );
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
