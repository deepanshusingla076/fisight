'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthStateChangedListener, 
  createUserDocumentFromAuth,
  signOutUser 
} from '@/firebase/firebase';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user: User | null) => {
      try {
        if (user) {
          // Only try to create user document if online
          if (typeof window !== 'undefined' && navigator.onLine) {
            await createUserDocumentFromAuth(user);
          } else {
            console.warn('User is offline, skipping user document creation');
          }
        }
        setCurrentUser(user);
      } catch (error) {
        console.error('Error handling auth state change:', error);
        // Set the user anyway, don't block authentication due to Firestore issues
        setCurrentUser(user);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      await signOutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
