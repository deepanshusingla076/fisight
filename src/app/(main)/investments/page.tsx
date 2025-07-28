import { PageHeader } from '@/components/shared/page-header';
import { BarChart3 } from 'lucide-react';
import { InvestmentsClientPage } from '@/components/investments/investments-client-page';


export default function InvestmentsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Investment Portfolio"
        description="Monitor your investment performance and get AI-powered suggestions for rebalancing your portfolio to meet your goals."
        icon={BarChart3}
      />
      <InvestmentsClientPage />
    </div>
  );
}
