'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const PortfolioOverview = dynamic(
  () => import('@/components/investments/portfolio-overview').then(mod => mod.PortfolioOverview),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> }
);

const RebalancingTool = dynamic(
  () => import('@/components/investments/rebalancing-tool').then(mod => mod.RebalancingTool),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> }
);

export function InvestmentsClientPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <PortfolioOverview />
      </div>
      <div className="lg:col-span-2">
        <RebalancingTool />
      </div>
    </div>
  );
}
