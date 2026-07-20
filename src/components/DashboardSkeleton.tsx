// src/components/DashboardSkeleton.tsx
// Drop this into the dashboard where dataLoading === true

import { StatCardSkeleton, DashboardRowSkeleton } from './Skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Rows */}
      <div className="space-y-3">
        <DashboardRowSkeleton />
        <DashboardRowSkeleton />
        <DashboardRowSkeleton />
        <DashboardRowSkeleton />
        <DashboardRowSkeleton />
      </div>
    </div>
  )
}