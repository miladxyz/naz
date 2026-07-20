function Bone({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-bone/60 rounded-sm ${className}`} />
  )
}

// Single blog card skeleton
export function BlogCardSkeleton() {
  return (
    <div className="card space-y-3">
      <Bone className="h-3 w-20" />
      <Bone className="h-5 w-3/4" />
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-5/6" />
      <div className="flex items-center justify-between pt-2">
        <Bone className="h-3 w-16" />
        <Bone className="h-3 w-12" />
      </div>
    </div>
  )
}

// Grid of blog card skeletons
export function BlogListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Single case card skeleton
export function CaseCardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex justify-between items-start">
        <Bone className="h-5 w-20" />
        <Bone className="h-3 w-12" />
      </div>
      <Bone className="h-5 w-2/3" />
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-4/5" />
      <div className="space-y-1.5 pt-1">
        <Bone className="h-3 w-1/2" />
        <Bone className="h-3 w-2/5" />
        <Bone className="h-3 w-1/3" />
      </div>
    </div>
  )
}

// Grid of case card skeletons
export function CaseListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CaseCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Comment skeleton
export function CommentSkeleton() {
  return (
    <div className="card flex gap-4">
      <Bone className="w-9 h-9 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Bone className="h-3 w-24" />
          <Bone className="h-3 w-16" />
        </div>
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-3/4" />
      </div>
    </div>
  )
}

// Dashboard question/post row skeleton
export function DashboardRowSkeleton() {
  return (
    <div className="card bg-white flex items-start gap-4">
      <div className="flex-1 space-y-2">
        <Bone className="h-4 w-1/2" />
        <Bone className="h-3 w-3/4" />
        <Bone className="h-3 w-1/3" />
      </div>
      <Bone className="h-7 w-16 flex-shrink-0" />
    </div>
  )
}

// Dashboard stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="card bg-white space-y-2 py-5">
      <Bone className="h-7 w-12 mx-auto" />
      <Bone className="h-3 w-20 mx-auto" />
    </div>
  )
}

// Team member card skeleton
export function TeamCardSkeleton() {
  return (
    <div className="card flex gap-5">
      <Bone className="w-16 h-16 flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Bone className="h-4 w-32" />
        <Bone className="h-3 w-24" />
        <Bone className="h-3 w-40" />
      </div>
    </div>
  )
}