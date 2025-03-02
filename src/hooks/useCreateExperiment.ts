import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Experiment } from '../api-types';

export const useCreateExperiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Experiment) => {
      try {
        const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/experiments`);
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return response.json();
      } catch {
        throw new Error('error creating experiment');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
      return data;
    },
    onError: () => {
      throw new Error('error creating experiment');
    },
  });
};
