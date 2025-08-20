import { PageHeader } from '@/components/shared/page-header';
import { User } from 'lucide-react';
import { ProfileForm } from '@/components/profile/profile-form';
import { UserProfile } from '@/components/auth/user-profile';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Profile"
        description="Manage your account settings and personal information."
        icon={User}
      />
      <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <UserProfile />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Financial Profile</h3>
          <div className="text-sm text-muted-foreground mb-4">
            This information helps our AI provide personalized financial insights. It is only stored in your browser.
          </div>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
