import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-5 w-72 mt-2" />
    </div>
    <Skeleton className="h-40 rounded-2xl" />
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <Skeleton className="h-52 rounded-xl" />
      <Skeleton className="h-52 rounded-xl" />
    </div>
    <Skeleton className="h-64 rounded-xl" />
  </div>
);

export default DashboardSkeleton;
