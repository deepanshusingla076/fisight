'use client';

import { ClientLayoutWrapper } from '@/components/layout/client-layout-wrapper';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  ProfileContext,
  defaultProfile,
  type UserProfile,
} from '@/hooks/use-profile';
import { useState, useEffect, ReactNode } from 'react';

const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') {
      return defaultProfile;
    }
    try {
      const item = window.localStorage.getItem('userProfile');
      return item ? JSON.parse(item) : defaultProfile;
    } catch (error) {
      console.error(error);
      return defaultProfile;
    }
  });

  const setProfile = (newProfile: UserProfile) => {
    try {
      setProfileState(newProfile);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userProfile', JSON.stringify(newProfile));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is for the authenticated app experience.
  // The landing page has its own layout.
  return (
    <ProtectedRoute>
      <ProfileProvider>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </ProfileProvider>
    </ProtectedRoute>
  );
}
