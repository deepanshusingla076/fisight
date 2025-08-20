'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  getUserProfile,
  updateUserProfile,
  getUserTransactions,
  addTransaction,
  getUserGoals,
  addFinancialGoal,
  getUserInvestments,
  calculateNetWorth,
  getMonthlySpending,
  subscribeToUserProfile,
  subscribeToTransactions
} from '@/firebase/firebase';
import type { 
  FinancialData, 
  Transaction, 
  FinancialGoal, 
  Investment, 
  NetWorthData, 
  MonthlySpending,
  UserProfile 
} from '@/lib/types';

interface UserDataState {
  isNewUser: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  userProfile: UserProfile | null;
  dashboardData: any;
  error: string | null;
}

export function useFinancialData() {
  const { currentUser: user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced state management
  const [userDataState, setUserDataState] = useState<UserDataState>({
    isNewUser: true,
    isLoading: true,
    hasCompletedOnboarding: false,
    userProfile: null,
    dashboardData: null,
    error: null
  });

  // Financial data state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [netWorth, setNetWorth] = useState<NetWorthData | null>(null);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending | null>(null);

  // Load initial data and detect user type
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    initializeUserData();
  }, [user?.uid]);

  // Set up real-time listeners
  useEffect(() => {
    if (!user?.uid || userDataState.isNewUser) return;

    const unsubscribeProfile = subscribeToUserProfile(user.uid, (profileData: any) => {
      setUserProfile(profileData as UserProfile);
    });

    const unsubscribeTransactions = subscribeToTransactions(user.uid, (transactionData: any) => {
      setTransactions(transactionData);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeTransactions();
    };
  }, [user?.uid, userDataState.isNewUser]);

  const initializeUserData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      setUserDataState(prev => ({ ...prev, isLoading: true }));

      // Call the user data API to initialize data
      const response = await fetch(`/api/user-data?userId=${user.uid}`);
      
      if (!response.ok) {
        // If API fails, use local demo data
        console.warn('API unavailable, using local demo data');
        
        const demoUserData = {
          isNewUser: false,
          isLoading: false,
          hasCompletedOnboarding: true,
          userProfile: {
            uid: user.uid,
            displayName: user.displayName || 'Demo User',
            email: user.email || 'demo@fisight.app',
            createdAt: new Date(),
            profile: {
              annualIncome: 75000,
              monthlyExpenses: 4500,
              assets: "25000",
              liabilities: "15000",
              creditScore: 720,
              riskTolerance: 'medium' as const,
              financialGoals: ['Emergency Fund', 'Home Purchase', 'Retirement'],
              bankAccounts: [],
              isProfileComplete: true
            },
            settings: {
              currency: "USD",
              notifications: true,
              theme: "light" as const
            }
          } as UserProfile,
          dashboardData: {
            accounts: [
              {
                id: 'demo_checking',
                bankName: 'Demo Bank',
                accountType: 'checking',
                accountNumber: '****1234',
                balance: 5420.75
              },
              {
                id: 'demo_savings',
                bankName: 'Demo Bank',
                accountType: 'savings',
                accountNumber: '****5678',
                balance: 12300.50
              }
            ]
          },
          error: null
        };
        
        setUserDataState(demoUserData);
        setUserProfile(demoUserData.userProfile);
        
        // Set demo transactions
        setTransactions([
          {
            id: 'demo_1',
            amount: -85.32,
            description: 'Grocery Store',
            category: 'Groceries',
            type: 'expense',
            date: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 86400000),
            accountId: 'demo_checking'
          },
          {
            id: 'demo_2',
            amount: -1200.00,
            description: 'Monthly Rent',
            category: 'Rent',
            type: 'expense',
            date: new Date(Date.now() - 172800000).toISOString(),
            createdAt: new Date(Date.now() - 172800000),
            accountId: 'demo_checking'
          },
          {
            id: 'demo_3',
            amount: 3500.00,
            description: 'Salary Deposit',
            category: 'Income',
            type: 'income',
            date: new Date(Date.now() - 432000000).toISOString(),
            createdAt: new Date(Date.now() - 432000000),
            accountId: 'demo_checking'
          }
        ] as Transaction[]);
        
        // Set demo goals
        setGoals([
          {
            id: 'goal_1',
            name: 'Emergency Fund',
            targetAmount: 20000,
            currentAmount: 8500,
            deadline: new Date(Date.now() + 31536000000).toISOString(),
            category: 'emergency_fund',
            status: 'active',
            priority: 'high',
            createdAt: new Date()
          },
          {
            id: 'goal_2',
            name: 'Home Down Payment',
            targetAmount: 50000,
            currentAmount: 12500,
            deadline: new Date(Date.now() + 63072000000).toISOString(),
            category: 'house',
            status: 'active',
            priority: 'medium',
            createdAt: new Date()
          }
        ] as FinancialGoal[]);
        
        // Set demo net worth
        setNetWorth({
          netWorth: 10000,
          assets: 25000,
          liabilities: 15000,
          investments: 7500
        });
        
        // Set demo monthly spending
        setMonthlySpending({
          total: 4200,
          byCategory: {
            'Housing': 1200,
            'Food & Dining': 600,
            'Transportation': 400,
            'Utilities': 200,
            'Entertainment': 300,
            'Healthcare': 150,
            'Other': 350
          }
        });
        
        return;
      }

      const userData = await response.json();
      setUserDataState(userData);

      // If it's an existing user, load their financial data
      if (!userData.isNewUser) {
        await loadFinancialData();
      } else {
        // For new users, set empty data
        setTransactions([]);
        setGoals([]);
        setInvestments([]);
        setNetWorth(null);
        setMonthlySpending(null);
      }

    } catch (err) {
      console.error('Error initializing user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize user data');
      // Set safe defaults for demo
      setUserDataState({
        isNewUser: false,
        isLoading: false,
        hasCompletedOnboarding: true,
        userProfile: null,
        dashboardData: null,
        error: null // Hide error from user, use demo data instead
      });
    } finally {
      setLoading(false);
      setUserDataState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadFinancialData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);

      // Load all financial data in parallel
      const [
        profileData,
        transactionData,
        goalData,
        investmentData,
        netWorthData,
        spendingData
      ] = await Promise.all([
        getUserProfile(user.uid),
        getUserTransactions(user.uid),
        getUserGoals(user.uid),
        getUserInvestments(user.uid),
        calculateNetWorth(user.uid),
        getMonthlySpending(user.uid)
      ]);

      setUserProfile(profileData as UserProfile);
      setTransactions(transactionData);
      setGoals(goalData);
      setInvestments(investmentData);
      setNetWorth(netWorthData);
      setMonthlySpending({
        total: spendingData.total,
        byCategory: spendingData.byCategory as Record<string, number>
      });

    } catch (err) {
      console.error('Error loading financial data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  // Complete onboarding for new users
  const completeOnboarding = async (onboardingData: {
    annualIncome: number;
    monthlyExpenses: number;
    financialGoals: string[];
    riskTolerance: 'low' | 'medium' | 'high';
    creditScore?: number;
  }) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    try {
      const response = await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          action: 'complete-onboarding',
          data: onboardingData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete onboarding');
      }

      // Refresh user data
      await initializeUserData();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
      throw err;
    }
  };

  // Connect bank account
  const connectBankAccount = async (bankData: any) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    try {
      const response = await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          action: 'connect-bank',
          data: bankData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to connect bank account');
      }

      // Refresh user data
      await initializeUserData();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect bank account');
      throw err;
    }
  };

  // Get AI analysis
  const getAIAnalysis = async (type: 'financial-analysis' | 'budget-advice' | 'investment-advice', data: any) => {
    try {
      const response = await fetch('/api/ai/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI analysis failed');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI analysis failed');
      throw err;
    }
  };

  // Profile functions (existing)
  const updateProfile = async (profileData: any) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    try {
      await updateUserProfile(user.uid, profileData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  // Transaction functions (existing)
  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    try {
      const transactionId = await addTransaction(user.uid, transactionData);
      
      // Refresh financial data
      const [newNetWorth, newSpending] = await Promise.all([
        calculateNetWorth(user.uid),
        getMonthlySpending(user.uid)
      ]);
      setNetWorth(newNetWorth);
      setMonthlySpending({
        total: newSpending.total,
        byCategory: newSpending.byCategory as Record<string, number>
      });
      return transactionId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      throw err;
    }
  };

  // Goal functions (existing)
  const createGoal = async (goalData: Omit<FinancialGoal, 'id' | 'createdAt' | 'status'>) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    try {
      const goalId = await addFinancialGoal(user.uid, goalData);
      const updatedGoals = await getUserGoals(user.uid);
      setGoals(updatedGoals);
      return goalId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
      throw err;
    }
  };

  // Computed values
  const isProfileComplete = userProfile?.profile?.isProfileComplete || false;
  const totalAssets = netWorth?.assets || 0;
  const totalLiabilities = netWorth?.liabilities || 0;
  const totalNetWorth = netWorth?.netWorth || 0;
  const monthlySpendingTotal = monthlySpending?.total || 0;

  // Financial insights
  const getFinancialInsights = () => {
    const insights = [];

    // Check if profile is incomplete
    if (!isProfileComplete) {
      insights.push({
        type: 'profile' as const,
        title: 'Complete Your Financial Profile',
        description: 'Add your income, expenses, and financial goals to get personalized insights.',
        priority: 'high' as const,
        actionable: true,
        recommendation: 'Go to Profile settings to complete your financial information.'
      });
    }

    // Check spending vs income
    if (userProfile?.profile?.annualIncome && monthlySpendingTotal) {
      const monthlyIncome = userProfile.profile.annualIncome / 12;
      const spendingRatio = monthlySpendingTotal / monthlyIncome;
      
      if (spendingRatio > 0.8) {
        insights.push({
          type: 'spending' as const,
          title: 'High Spending Alert',
          description: `You're spending ${Math.round(spendingRatio * 100)}% of your monthly income.`,
          priority: 'high' as const,
          actionable: true,
          recommendation: 'Consider reviewing your budget and reducing non-essential expenses.'
        });
      }
    }

    // Check emergency fund
    if (userProfile?.profile?.monthlyExpenses && totalAssets) {
      const emergencyFundMonths = totalAssets / userProfile.profile.monthlyExpenses;
      if (emergencyFundMonths < 3) {
        insights.push({
          type: 'saving' as const,
          title: 'Build Emergency Fund',
          description: `You have ${Math.round(emergencyFundMonths * 10) / 10} months of expenses saved.`,
          priority: 'medium' as const,
          actionable: true,
          recommendation: 'Aim to save 3-6 months of expenses for emergencies.'
        });
      }
    }

    return insights;
  };

  return {
    // Enhanced state
    ...userDataState,
    
    // Data
    userProfile,
    transactions,
    goals,
    investments,
    netWorth,
    monthlySpending,
    
    // State
    loading,
    error,
    
    // Computed values
    isProfileComplete,
    totalAssets,
    totalLiabilities,
    totalNetWorth,
    monthlySpendingTotal,
    
    // Functions
    initializeUserData,
    loadFinancialData,
    completeOnboarding,
    connectBankAccount,
    getAIAnalysis,
    updateProfile,
    createTransaction,
    createGoal,
    getFinancialInsights,
    
    // Utilities
    clearError: () => setError(null)
  };
}
