import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteDraftExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const url = new URL(
          `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`
        );
        url.searchParams.set('id', id);
        const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        return response.json();
      } catch {
        throw new Error('error deleting draft experiment');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['draft-experiments'],
      });
      return data;
    },
    onError: () => {
      throw new Error('error deleting draft experiment');
    },
  });
};
