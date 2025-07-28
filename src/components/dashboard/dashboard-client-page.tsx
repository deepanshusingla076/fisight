'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

const NetWorthCard = dynamic(
  () => import('@/components/dashboard/net-worth-card').then(mod => mod.NetWorthCard),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> }
);

const RecentTransactions = dynamic(
  () => import('@/components/dashboard/recent-transactions').then(mod => mod.RecentTransactions),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> }
);

const FinancialHealthSummary = dynamic(
  () => import('@/components/dashboard/financial-health-summary').then(mod => mod.FinancialHealthSummary),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);

export function DashboardClientPage() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <NetWorthCard />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <RecentTransactions />
          </Suspense>
        </div>
      </div>
      <div>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <FinancialHealthSummary />
        </Suspense>
      </div>
    </>
  );
}
