"use client";

import { Card, CardContent } from "@/components/ui/card";

function SkeletonBox({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-7">
      <div className="mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-6 w-48" />
          <div className="flex gap-3">
            <SkeletonBox className="h-9 w-28" />
            <SkeletonBox className="h-9 w-28" />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border border-gray-200">
              <CardContent className="p-5 flex flex-col gap-3">
                <SkeletonBox className="h-5 w-5 rounded" />
                <SkeletonBox className="h-3 w-24" />
                <SkeletonBox className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health + Actions */}
        <div className="flex gap-5 flex-wrap">
          
          {/* Compliance Banner */}
          <Card className="flex-1 border border-gray-200">
            <CardContent className="p-7 flex gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <SkeletonBox className="h-3 w-20" />
                  <SkeletonBox className="h-7 w-10" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="w-72 border border-gray-200">
            <CardContent className="p-5 flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonBox key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex gap-5 flex-wrap items-start">

          {/* Activity Feed */}
          <div className="flex-1 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-4 flex gap-3">
                  <SkeletonBox className="h-8 w-8 rounded-full" />
                  <div className="flex-1 flex flex-col gap-2">
                    <SkeletonBox className="h-3 w-40" />
                    <SkeletonBox className="h-3 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-72 flex flex-col gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-5 flex flex-col gap-3">
                  <SkeletonBox className="h-4 w-32" />
                  <SkeletonBox className="h-3 w-full" />
                  <SkeletonBox className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}