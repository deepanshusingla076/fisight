/**
 * User Data Management Service
 * Handles user profile creation, data initialization, and state management
 */

import { 
  getUserProfile, 
  updateUserProfile, 
  createUserDocumentFromAuth,
  getUserTransactions,
  getUserGoals,
  getUserInvestments,
  calculateNetWorth
} from '@/firebase/firebase';
import { createBankDataService, isNewUser, getNewUserDefaults, type UserFinancialData } from './bank-data-service';
import type { UserProfile, FinancialProfile } from './types';

export interface UserDataState {
  isNewUser: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  userProfile: UserProfile | null;
  financialData: UserFinancialData | null;
  error: string | null;
}

export class UserDataManager {
  private userId: string;
  private bankDataService: ReturnType<typeof createBankDataService>;

  constructor(userId: string) {
    this.userId = userId;
    this.bankDataService = createBankDataService(userId);
  }

  /**
   * Initialize user data - determines if new or existing user and loads appropriate data
   */
  async initializeUserData(): Promise<UserDataState> {
    try {
      console.log('🔄 Initializing user data for:', this.userId);

      // Always work in offline mode for demo
      let userProfile: UserProfile | null = null;
      let isUserNew = false;

      // Check local storage first
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem(`user_data_${this.userId}`);
        if (localData) {
          userProfile = JSON.parse(localData);
          isUserNew = false;
          console.log('✅ Existing local user profile loaded');
        } else {
          // Create demo profile for new user
          userProfile = this.createFallbackProfile();
          isUserNew = true;
          localStorage.setItem(`user_data_${this.userId}`, JSON.stringify(userProfile));
          console.log('✅ New demo user profile created');
        }
      } else {
        userProfile = this.createFallbackProfile();
        isUserNew = true;
      }

      // Get financial data - always use demo data
      const financialData = this.createFallbackFinancialData();

      // For demo, assume onboarding is complete
      const hasCompletedOnboarding = true;

      return {
        isNewUser: isUserNew,
        isLoading: false,
        hasCompletedOnboarding,
        userProfile,
        financialData,
        error: null
      };

    } catch (error) {
      console.error('❌ Error initializing user data:', error);
      
      // Create fallback user data for demo purposes
      const fallbackProfile = this.createFallbackProfile();
      const fallbackData = this.createFallbackFinancialData();
      
      return {
        isNewUser: false,
        isLoading: false,
        hasCompletedOnboarding: true,
        userProfile: fallbackProfile,
        financialData: fallbackData,
        error: null // Don't show error to user, use fallback data
      };
    }
  }

  /**
   * Create a new user profile with default financial structure
   */
  private async createNewUserProfile(): Promise<UserProfile> {
    console.log('📝 Creating new user profile with financial structure');

    const newProfile: FinancialProfile = {
      annualIncome: 0,
      monthlyExpenses: 0,
      assets: "0",
      liabilities: "0",
      creditScore: 0,
      riskTolerance: 'medium',
      financialGoals: [],
      bankAccounts: [],
      isProfileComplete: false
    };

    try {
      // Update the user document in Firebase with the financial structure
      await updateUserProfile(this.userId, newProfile);

      // Get the updated profile
      const userProfile = await getUserProfile(this.userId) as UserProfile;
      
      console.log('✅ New user profile created successfully');
      return userProfile;
    } catch (error) {
      console.warn('Firebase unavailable, creating local profile');
      return this.createFallbackProfile();
    }
  }

  /**
   * Create fallback profile for offline mode
   */
  private createFallbackProfile(): UserProfile {
    return {
      uid: this.userId,
      displayName: 'Demo User',
      email: 'demo@fisight.app',
      createdAt: new Date(),
      profile: {
        annualIncome: 75000,
        monthlyExpenses: 4500,
        assets: "25000",
        liabilities: "15000",
        creditScore: 720,
        riskTolerance: 'medium',
        financialGoals: ['Emergency Fund', 'Home Purchase', 'Retirement'],
        bankAccounts: [],
        isProfileComplete: true
      },
      settings: {
        currency: "USD",
        notifications: true,
        theme: "light"
      }
    };
  }

  /**
   * Create fallback financial data for demo
   */
  private createFallbackFinancialData(): UserFinancialData {
    return {
      userId: this.userId,
      bankAccounts: [
        {
          id: 'demo_checking',
          bankName: 'Demo Bank',
          accountType: 'checking',
          accountNumber: '****1234',
          balance: 5420.75,
          isActive: true,
          currency: 'USD',
          isConnected: true,
          lastSynced: new Date()
        },
        {
          id: 'demo_savings',
          bankName: 'Demo Bank',
          accountType: 'savings',
          accountNumber: '****5678',
          balance: 12300.50,
          isActive: true,
          currency: 'USD',
          isConnected: true,
          lastSynced: new Date()
        }
      ],
      transactions: [
        {
          id: 'demo_1',
          accountId: 'demo_checking',
          amount: -85.32,
          description: 'Grocery Store',
          category: 'Food & Dining',
          type: 'expense',
          date: new Date(Date.now() - 86400000),
          isRecurring: false,
          confidence: 1.0,
          tags: ['groceries']
        },
        {
          id: 'demo_2',
          accountId: 'demo_checking',
          amount: -1200.00,
          description: 'Monthly Rent',
          category: 'Housing',
          type: 'expense',
          date: new Date(Date.now() - 172800000),
          isRecurring: true,
          confidence: 1.0,
          tags: ['rent', 'housing']
        }
      ],
      netWorth: 10000,
      totalAssets: 25000,
      totalLiabilities: 15000,
      monthlyIncome: 6250,
      monthlyExpenses: 4500,
      savingsRate: 28,
      creditScore: 720,
      lastUpdated: new Date()
    };
  }

  /**
   * Load financial data based on user type
   */
  private async loadFinancialData(isUserNew: boolean): Promise<UserFinancialData> {
    if (isUserNew) {
      console.log('🆕 Loading default data for new user');
      return {
        userId: this.userId,
        ...getNewUserDefaults(),
        lastUpdated: new Date()
      } as UserFinancialData;
    }

    console.log('📊 Loading existing user financial data');
    
    // For existing users, load their actual bank data
    const financialData = await this.bankDataService.getUserFinancialData();
    
    // Also load additional data from Firebase
    const [transactions, goals, investments, netWorth] = await Promise.allSettled([
      getUserTransactions(this.userId, 30),
      getUserGoals(this.userId),
      getUserInvestments(this.userId),
      calculateNetWorth(this.userId)
    ]);

    // Merge Firebase data with bank data
    if (transactions.status === 'fulfilled') {
      // Convert Firebase transactions to bank transaction format
      const firebaseTransactions = transactions.value.map(t => ({
        id: t.id,
        accountId: 'firebase_account',
        amount: t.amount,
        description: t.description,
        category: t.category,
        type: t.type,
        date: new Date(t.date),
        isRecurring: t.isRecurring || false,
        confidence: 1.0,
        tags: t.tags || []
      }));

      financialData.transactions = [...financialData.transactions, ...firebaseTransactions];
    }

    return financialData;
  }

  /**
   * Check if user has completed onboarding
   */
  private checkOnboardingStatus(userProfile: UserProfile | null, financialData: UserFinancialData | null): boolean {
    if (!userProfile || !financialData) return false;

    // User has completed onboarding if:
    // 1. Profile is marked as complete
    // 2. Has at least one bank account connected OR has entered basic financial info
    // 3. Has set at least one financial goal

    const hasProfileInfo = userProfile.profile.isProfileComplete;
    const hasFinancialData = financialData.bankAccounts.length > 0 || 
                            userProfile.profile.annualIncome > 0;
    const hasGoals = userProfile.profile.financialGoals.length > 0;

    return hasProfileInfo && hasFinancialData && hasGoals;
  }

  /**
   * Complete user onboarding with provided data
   */
  async completeOnboarding(onboardingData: {
    annualIncome: number;
    monthlyExpenses: number;
    financialGoals: string[];
    riskTolerance: 'low' | 'medium' | 'high';
    creditScore?: number;
  }): Promise<void> {
    try {
      console.log('✅ Completing user onboarding');

      const updatedProfile: FinancialProfile = {
        annualIncome: onboardingData.annualIncome,
        monthlyExpenses: onboardingData.monthlyExpenses,
        assets: "0", // Will be updated when bank accounts are connected
        liabilities: "0",
        creditScore: onboardingData.creditScore || 0,
        riskTolerance: onboardingData.riskTolerance,
        financialGoals: onboardingData.financialGoals,
        bankAccounts: [],
        isProfileComplete: true
      };

      await updateUserProfile(this.userId, updatedProfile);
      
      console.log('🎉 User onboarding completed successfully');
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Connect bank account and sync data
   */
  async connectBankAccount(bankAccountData: any): Promise<void> {
    try {
      console.log('🏦 Connecting bank account for user');
      
      // In real implementation, this would:
      // 1. Validate bank credentials
      // 2. Establish secure connection
      // 3. Fetch account and transaction data
      // 4. Store encrypted credentials
      // 5. Schedule regular data syncs

      await this.bankDataService.syncBankData();
      
      console.log('✅ Bank account connected successfully');
    } catch (error) {
      console.error('❌ Error connecting bank account:', error);
      throw error;
    }
  }

  /**
   * Get user dashboard data
   */
  async getDashboardData(): Promise<{
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    recentTransactions: any[];
    financialHealth: 'excellent' | 'good' | 'fair' | 'poor';
    insights: string[];
  }> {
    try {
      const financialData = await this.bankDataService.getUserFinancialData();
      const userProfile = await getUserProfile(this.userId) as UserProfile;

      // Calculate financial health score
      const financialHealth = this.calculateFinancialHealth(financialData, userProfile);

      // Generate insights
      const insights = this.generateFinancialInsights(financialData, userProfile);

      return {
        netWorth: financialData.netWorth,
        monthlyIncome: financialData.monthlyIncome,
        monthlyExpenses: financialData.monthlyExpenses,
        savingsRate: financialData.savingsRate,
        recentTransactions: financialData.transactions.slice(0, 10),
        financialHealth,
        insights
      };
    } catch (error) {
      console.error('❌ Error getting dashboard data:', error);
      throw error;
    }
  }

  /**
   * Calculate financial health score
   */
  private calculateFinancialHealth(
    financialData: UserFinancialData, 
    userProfile: UserProfile
  ): 'excellent' | 'good' | 'fair' | 'poor' {
    let score = 0;

    // Emergency fund (30% weight)
    const monthlyExpenses = financialData.monthlyExpenses || userProfile.profile.monthlyExpenses;
    const emergencyFundMonths = monthlyExpenses > 0 ? financialData.totalAssets / monthlyExpenses : 0;
    
    if (emergencyFundMonths >= 6) score += 30;
    else if (emergencyFundMonths >= 3) score += 20;
    else if (emergencyFundMonths >= 1) score += 10;

    // Savings rate (25% weight)
    if (financialData.savingsRate >= 20) score += 25;
    else if (financialData.savingsRate >= 10) score += 20;
    else if (financialData.savingsRate >= 5) score += 15;
    else if (financialData.savingsRate > 0) score += 10;

    // Debt-to-income ratio (25% weight)
    const monthlyIncome = financialData.monthlyIncome || userProfile.profile.annualIncome / 12;
    const debtToIncomeRatio = monthlyIncome > 0 ? (financialData.totalLiabilities / monthlyIncome) : 0;
    
    if (debtToIncomeRatio <= 0.1) score += 25;
    else if (debtToIncomeRatio <= 0.2) score += 20;
    else if (debtToIncomeRatio <= 0.3) score += 15;
    else if (debtToIncomeRatio <= 0.4) score += 10;

    // Credit score (20% weight)
    const creditScore = userProfile.profile.creditScore;
    if (creditScore >= 800) score += 20;
    else if (creditScore >= 740) score += 18;
    else if (creditScore >= 670) score += 15;
    else if (creditScore >= 580) score += 10;

    // Determine health category
    if (score >= 80) return 'excellent';
    else if (score >= 60) return 'good';
    else if (score >= 40) return 'fair';
    else return 'poor';
  }

  /**
   * Generate financial insights
   */
  private generateFinancialInsights(
    financialData: UserFinancialData, 
    userProfile: UserProfile
  ): string[] {
    const insights: string[] = [];

    // Emergency fund insight
    const monthlyExpenses = financialData.monthlyExpenses || userProfile.profile.monthlyExpenses;
    const emergencyFundMonths = monthlyExpenses > 0 ? financialData.totalAssets / monthlyExpenses : 0;
    
    if (emergencyFundMonths < 3) {
      insights.push(`Build your emergency fund: You have ${emergencyFundMonths.toFixed(1)} months of expenses saved. Aim for 3-6 months.`);
    }

    // Savings rate insight
    if (financialData.savingsRate < 10) {
      insights.push(`Increase your savings rate: Currently saving ${financialData.savingsRate.toFixed(1)}% of income. Try to reach 10-20%.`);
    }

    // Spending insights
    if (financialData.monthlyExpenses > financialData.monthlyIncome * 0.9) {
      insights.push('High spending alert: Your expenses are very close to your income. Consider reducing discretionary spending.');
    }

    return insights;
  }
}

/**
 * Factory function to create UserDataManager instance
 */
export function createUserDataManager(userId: string): UserDataManager {
  return new UserDataManager(userId);
}
