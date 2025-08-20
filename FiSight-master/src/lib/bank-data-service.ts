/**
 * Bank Data Service for FiSight
 * Handles bank account connections, transaction fetching, and financial data aggregation
 */

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  accountNumber: string; // Masked for security
  routingNumber?: string;
  balance: number;
  availableBalance?: number;
  currency: string;
  isConnected: boolean;
  lastSynced: Date;
  isActive: boolean;
}

export interface BankTransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  type: 'income' | 'expense' | 'transfer';
  date: Date;
  merchantName?: string;
  location?: string;
  isRecurring: boolean;
  confidence: number; // AI categorization confidence
  tags: string[];
}

export interface UserFinancialData {
  userId: string;
  bankAccounts: BankAccount[];
  transactions: BankTransaction[];
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  creditScore?: number;
  lastUpdated: Date;
}

// Bank Data Service Class
export class BankDataService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Get all connected bank accounts for the user
   */
  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      // For now, return mock data. Later integrate with Plaid/Open Banking
      return this.getMockBankAccounts();
    } catch (error) {
      console.error('❌ Error fetching bank accounts:', error);
      throw error;
    }
  }

  /**
   * Get transactions for a specific account or all accounts
   */
  async getTransactions(accountId?: string, days: number = 30): Promise<BankTransaction[]> {
    try {
      // For now, return mock data. Later integrate with real bank APIs
      return this.getMockTransactions(accountId, days);
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive financial data for the user
   */
  async getUserFinancialData(): Promise<UserFinancialData> {
    try {
      const bankAccounts = await this.getBankAccounts();
      const transactions = await this.getTransactions();

      // Calculate financial metrics
      const totalAssets = bankAccounts
        .filter(acc => acc.accountType !== 'credit')
        .reduce((sum, acc) => sum + acc.balance, 0);

      const totalLiabilities = bankAccounts
        .filter(acc => acc.accountType === 'credit')
        .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

      const netWorth = totalAssets - totalLiabilities;

      // Calculate monthly income and expenses
      const currentDate = new Date();
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const monthlyTransactions = transactions.filter(t => t.date >= monthStart);
      
      const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

      return {
        userId: this.userId,
        bankAccounts,
        transactions,
        totalAssets,
        totalLiabilities,
        netWorth,
        monthlyIncome,
        monthlyExpenses,
        savingsRate,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('❌ Error calculating financial data:', error);
      throw error;
    }
  }

  /**
   * Sync bank data (fetch latest transactions and balances)
   */
  async syncBankData(): Promise<void> {
    try {
      console.log('🔄 Syncing bank data for user:', this.userId);
      
      // In a real implementation, this would:
      // 1. Call bank APIs to get latest data
      // 2. Categorize transactions using AI
      // 3. Update Firebase with new data
      // 4. Send notifications for important changes

      await this.simulateDataSync();
      
      console.log('✅ Bank data sync completed');
    } catch (error) {
      console.error('❌ Error syncing bank data:', error);
      throw error;
    }
  }

  /**
   * Get mock bank accounts (for development/demo)
   */
  private getMockBankAccounts(): BankAccount[] {
    const isNewUser = Math.random() > 0.7; // 30% chance of new user

    if (isNewUser) {
      // New user - no bank accounts connected yet
      return [];
    }

    // Existing user - return realistic bank data
    return [
      {
        id: 'acc_chase_checking',
        bankName: 'Chase Bank',
        accountType: 'checking',
        accountNumber: '****1234',
        routingNumber: '021000021',
        balance: 4750.23,
        availableBalance: 4750.23,
        currency: 'USD',
        isConnected: true,
        lastSynced: new Date(),
        isActive: true
      },
      {
        id: 'acc_chase_savings',
        bankName: 'Chase Bank',
        accountType: 'savings',
        accountNumber: '****5678',
        balance: 12500.00,
        availableBalance: 12500.00,
        currency: 'USD',
        isConnected: true,
        lastSynced: new Date(),
        isActive: true
      },
      {
        id: 'acc_amex_credit',
        bankName: 'American Express',
        accountType: 'credit',
        accountNumber: '****9876',
        balance: -1250.45, // Negative for credit card debt
        availableBalance: 8749.55, // Available credit
        currency: 'USD',
        isConnected: true,
        lastSynced: new Date(),
        isActive: true
      }
    ];
  }

  /**
   * Get mock transactions (for development/demo)
   */
  private getMockTransactions(accountId?: string, days: number = 30): BankTransaction[] {
    const transactions: BankTransaction[] = [];
    const currentDate = new Date();

    // Generate realistic transaction data
    for (let i = 0; i < days; i++) {
      const transactionDate = new Date(currentDate);
      transactionDate.setDate(currentDate.getDate() - i);

      // Random number of transactions per day (0-5)
      const dailyTransactions = Math.floor(Math.random() * 6);

      for (let j = 0; j < dailyTransactions; j++) {
        transactions.push(this.generateMockTransaction(transactionDate));
      }
    }

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Generate a single mock transaction
   */
  private generateMockTransaction(date: Date): BankTransaction {
    const transactionTypes = [
      { type: 'income', category: 'Salary', amount: 2500, description: 'Payroll Deposit', probability: 0.1 },
      { type: 'expense', category: 'Groceries', amount: 85, description: 'Whole Foods Market', probability: 0.2 },
      { type: 'expense', category: 'Utilities', amount: 120, description: 'Electric Bill', probability: 0.05 },
      { type: 'expense', category: 'Transport', amount: 45, description: 'Gas Station', probability: 0.15 },
      { type: 'expense', category: 'Dining', amount: 35, description: 'Restaurant', probability: 0.2 },
      { type: 'expense', category: 'Entertainment', amount: 15, description: 'Netflix', probability: 0.1 },
      { type: 'expense', category: 'Shopping', amount: 95, description: 'Amazon Purchase', probability: 0.15 },
      { type: 'expense', category: 'Healthcare', amount: 200, description: 'Medical Appointment', probability: 0.05 }
    ];

    // Select random transaction type based on probability
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let selectedTransaction = transactionTypes[0];

    for (const transType of transactionTypes) {
      cumulativeProbability += transType.probability;
      if (randomValue <= cumulativeProbability) {
        selectedTransaction = transType;
        break;
      }
    }

    // Add some randomness to the amount
    const baseAmount = selectedTransaction.amount;
    const variance = baseAmount * 0.3; // 30% variance
    const finalAmount = baseAmount + (Math.random() - 0.5) * variance;

    return {
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId: 'acc_chase_checking',
      amount: Math.round(finalAmount * 100) / 100,
      description: selectedTransaction.description,
      category: selectedTransaction.category,
      type: selectedTransaction.type as 'income' | 'expense',
      date: date,
      isRecurring: Math.random() > 0.8, // 20% chance of being recurring
      confidence: 0.95,
      tags: []
    };
  }

  /**
   * Simulate data sync process
   */
  private async simulateDataSync(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would:
    // - Fetch latest account balances
    // - Get new transactions
    // - Run AI categorization
    // - Update user profile in Firebase
  }
}

/**
 * Factory function to create BankDataService instance
 */
export function createBankDataService(userId: string): BankDataService {
  return new BankDataService(userId);
}

/**
 * Helper function to determine if user is new (no financial data)
 */
export function isNewUser(financialData: UserFinancialData): boolean {
  return (
    financialData.bankAccounts.length === 0 &&
    financialData.transactions.length === 0 &&
    financialData.totalAssets === 0
  );
}

/**
 * Helper function to get default data for new users
 */
export function getNewUserDefaults(): Partial<UserFinancialData> {
  return {
    bankAccounts: [],
    transactions: [],
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    lastUpdated: new Date()
  };
}
