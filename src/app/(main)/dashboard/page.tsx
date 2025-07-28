import { PageHeader } from '@/components/shared/page-header';
import { LayoutDashboard } from 'lucide-react';
import { DashboardClientPage } from '@/components/dashboard/dashboard-client-page';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your financial command center. Get a complete overview of your net worth, transactions, and AI-driven insights."
        icon={LayoutDashboard}
      />
      <DashboardClientPage />
    </div>
  );
}
