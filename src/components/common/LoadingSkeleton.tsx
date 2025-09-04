import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'list' | 'form';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ 
  variant = 'card', 
  count = 1, 
  className = '' 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </CardContent>
          </Card>
        );
      
      case 'table':
        return (
          <div className="border rounded-md">
            <div className="border-b p-4">
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b p-4 last:border-b-0">
                <div className="flex space-x-4">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        );
      
      case 'form':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        );
      
      default:
        return <Skeleton className="h-20 w-full" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

// Specific loading components for common use cases
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main content */}
      <LoadingSkeleton variant="card" count={2} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return <LoadingSkeleton variant="table" />;
}

export function FormSkeleton() {
  return <LoadingSkeleton variant="form" />;
}