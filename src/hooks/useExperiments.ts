import { useQuery } from '@tanstack/react-query';
import { Experiment } from '../api-types';
import { BASE_CONFIG } from '.';
import { format } from 'date-fns';

export const experimentsQueryFn = {
  queryKey: ['experiments'],
  queryFn: async () => {
    try {
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/experiments`);
      const res = await fetch(url, {
        credentials: 'include',
      });
      return res.json();
    } catch {
      throw new Error('error fetching experiments');
    }
  },
  select: (data: Experiment[]) =>
    data.map((row: Experiment) => ({
      ...row,
      date: format(new Date(row.date), 'EEEE, dd MMMM yyyy HH:mm'),
    })),
  ...BASE_CONFIG,
};

export const useExperiments = () => {
  return useQuery<Experiment[]>(experimentsQueryFn);
};
