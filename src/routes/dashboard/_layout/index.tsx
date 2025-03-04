import { SkeletonLoading } from '@/components/skeleton-loading';
import { ExperimentsTabsViewWithTable } from '@/experiments/experiments-tabs-view-with-table';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createFileRoute('/dashboard/_layout/')({
  component: () => (
    <Suspense fallback={<SkeletonLoading />}>
      <ExperimentsTabsViewWithTable />
    </Suspense>
  ),
});
