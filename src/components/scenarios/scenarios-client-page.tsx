'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ScenarioSimulator = dynamic(
  () => import('@/components/scenarios/scenario-simulator').then(mod => mod.ScenarioSimulator),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }
);

export function ScenariosClientPage() {
  return <ScenarioSimulator />;
}
