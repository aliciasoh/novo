import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DraftExperiment } from '../api-types';

export const useUpdateDraftExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }: { data: DraftExperiment; id: string }) => {
      try {
        const url = new URL(
          `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`
        );
        url.searchParams.set('id', id);
        const response = await fetch(url, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return response.json();
      } catch {
        throw new Error('error updating draft experiment');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['draft-experiments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['draft-experiment', data.id],
      });
      return data;
    },
    onError: () => {
      throw new Error('error updating draft experiment');
    },
  });
};
