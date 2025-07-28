'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AffordabilityAnalyzer = dynamic(
  () => import('@/components/affordability/affordability-analyzer').then(mod => mod.AffordabilityAnalyzer),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" /> 
  }
);

export function AffordabilityClientPage() {
    return <AffordabilityAnalyzer />;
}
