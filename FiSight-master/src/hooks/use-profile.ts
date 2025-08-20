'use client';

import { createContext, useContext } from 'react';

export interface UserProfile {
  annualIncome: number;
  monthlyExpenses: number;
  assets: string;
  liabilities: string;
}

export interface ProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export const defaultProfile: UserProfile = {
  annualIncome: 1200000,
  monthlyExpenses: 50000,
  assets: 'Savings Account: ₹25,00,000\nChecking Account: ₹5,00,000\nInvestment Portfolio: ₹10,25,000',
  liabilities: 'Credit Card Debt: ₹2,00,000\nStudent Loans: ₹15,00,000',
};

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};


export function profileToFinancialSituation(profile: UserProfile): string {
    return `
      Annual Income: ₹${profile.annualIncome.toLocaleString('en-IN')}
      Monthly Expenses: ₹${profile.monthlyExpenses.toLocaleString('en-IN')}
      Assets:
        ${profile.assets.split('\n').map(line => `- ${line}`).join('\n')}
      Liabilities:
        ${profile.liabilities.split('\n').map(line => `- ${line}`).join('\n')}
    `;
}
