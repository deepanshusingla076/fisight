import { PageHeader } from '@/components/shared/page-header';
import { User } from 'lucide-react';
import { ProfileForm } from '@/components/profile/profile-form';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Profile"
        description="This information helps our AI provide personalized financial insights. It is only stored in your browser."
        icon={User}
      />
      <div className="max-w-2xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
}
