import { PageHeader } from '@/components/shared/page-header';
import { FileText } from 'lucide-react';
import { ScenariosClientPage } from '@/components/scenarios/scenarios-client-page';


export default function ScenariosPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Financial Scenario Simulator"
        description="Explore the future. Describe a financial scenario to see how it might impact your net worth and get an AI risk assessment."
        icon={FileText}
      />
      <ScenariosClientPage />
    </div>
  );
}
