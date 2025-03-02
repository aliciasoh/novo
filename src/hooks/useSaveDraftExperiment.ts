import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DraftExperiment } from '../api-types';

export const useSaveDraftExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DraftExperiment) => {
      try {
        const url = new URL(
          `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`
        );
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return response.json();
      } catch {
        throw new Error('error creating draft experiment');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['draft-experiments'] });
      return data;
    },
    onError: () => {
      throw new Error('error creating draft experiment');
    },
  });
};
