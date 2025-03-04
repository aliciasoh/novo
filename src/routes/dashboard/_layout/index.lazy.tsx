import { SkeletonLoading } from '@/components/skeleton-loading';
import { ExperimentsTabsViewWithTable } from '@/experiments/experiments-tabs-view-with-table';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createLazyFileRoute('/dashboard/_layout/')({
  component: () => (
    <Suspense fallback={<SkeletonLoading />}>
      <ExperimentsTabsViewWithTable />
    </Suspense>
  ),
});
