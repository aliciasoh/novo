import { useQuery } from '@tanstack/react-query';
import { DraftExperiment } from '../api-types';
import { BASE_CONFIG } from '.';
import { format } from 'date-fns';

export const draftExperimentsQueryFn = {
  queryKey: ['draft-experiments'],
  queryFn: async () => {
    try {
      const url = new URL(
        `${import.meta.env.VITE_API_BASE_URL}/draft-experiments`
      );
      const res = await fetch(url, {
        credentials: 'include',
      });
      return res.json();
    } catch {
      throw new Error('error fetching draft experiments');
    }
  },
  select: (data: DraftExperiment[]) =>
    data.map((row: DraftExperiment) => ({
      ...row,
      date: row.date
        ? format(new Date(row.date), 'EEEE, dd MMMM yyyy HH:mm')
        : undefined,
    })),
  ...BASE_CONFIG,
};
export const useDraftExperiments = () => {
  return useQuery<DraftExperiment[]>(draftExperimentsQueryFn);
};
