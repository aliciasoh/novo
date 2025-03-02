import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonLoading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[750px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[750px]" />
        <Skeleton className="h-4 w-[700px]" />
        <Skeleton className="h-4 w-[750px]" />
        <Skeleton className="h-4 w-[700px]" />
      </div>
    </div>
  );
}
