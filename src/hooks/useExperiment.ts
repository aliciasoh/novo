import { useQuery } from '@tanstack/react-query';
import { Experiment } from '../api-types';
import { BASE_CONFIG } from '.';
import { format } from 'date-fns';

export const experimentQueryFn = (id: string) => {
  return {
    queryKey: ['experiment', id],
    queryFn: async () => {
      try {
        const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/experiments`);
        url.searchParams.set('id', id);
        const res = await fetch(url, {
          credentials: 'include',
        });
        return res.json();
      } catch {
        throw new Error('error fetching experiment');
      }
    },
    select: (data: Experiment) => ({
      ...data,
      date: format(new Date(data.date), 'EEEE, dd MMMM yyyy HH:mm'),
    }),
    ...BASE_CONFIG,
    enabled: !!id,
  };
};
export const useExperiment = (id: string) => {
  return useQuery<Experiment>(experimentQueryFn(id));
};
