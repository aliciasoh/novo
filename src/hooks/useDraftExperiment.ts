import { useQuery } from '@tanstack/react-query';
import { DraftExperiment } from '../api-types';
import { BASE_CONFIG } from '.';
import { format } from 'date-fns';

export const draftExperimentQueryFn = (id: string) => {
  return {
    queryKey: ['draft-experiment', id],
    queryFn: async () => {
      try {
        const url = new URL(
          `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`
        );
        url.searchParams.set('id', id);
        const res = await fetch(url, {
          credentials: 'include',
        });
        return res.json();
      } catch {
        throw new Error('error fetching draft experiment');
      }
    },
    select: (data: DraftExperiment) => ({
      ...data,
      date: data.date
        ? format(new Date(data.date), 'EEEE, dd MMMM yyyy HH:mm')
        : undefined,
    }),
    enabled: !!id,
    ...BASE_CONFIG,
  };
};
export const useDraftExperiment = (id: string) => {
  return useQuery<DraftExperiment>(draftExperimentQueryFn(id));
};
