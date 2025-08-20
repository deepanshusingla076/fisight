// ===============================
// FIREBASE FIRESTORE DATA TYPES
// ===============================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt?: Date;
  profile: FinancialProfile;
  settings: UserSettings;
}

export interface FinancialProfile {
  annualIncome: number;
  monthlyExpenses: number;
  assets: string;
  liabilities: string;
  creditScore: number;
  riskTolerance: 'low' | 'medium' | 'high';
  financialGoals: string[];
  bankAccounts: BankAccount[];
  isProfileComplete: boolean;
}

export interface UserSettings {
  currency: string;
  notifications: boolean;
  theme: 'light' | 'dark';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  accountNumber: string; // Masked for security
  balance: number;
  isConnected: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: 'income' | 'expense';
  accountId?: string;
  tags?: string[];
  isRecurring?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export type TransactionCategory = 
  | 'Income' 
  | 'Salary'
  | 'Groceries' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Transport'
  | 'Healthcare'
  | 'Shopping'
  | 'Dining'
  | 'Travel'
  | 'Education'
  | 'Insurance'
  | 'Rent'
  | 'Investment'
  | 'Other';

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  type: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'crypto' | 'real_estate' | 'other';
  quantity: number;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  performance: number; // Percentage change
  createdAt: Date;
  updatedAt?: Date;
}

export interface FinancialGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency_fund' | 'vacation' | 'house' | 'car' | 'retirement' | 'education' | 'other';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt?: Date;
}

export interface NetWorthData {
  netWorth: number;
  assets: number;
  liabilities: number;
  investments: number;
}

export interface MonthlySpending {
  total: number;
  byCategory: Record<string, number>;
}

// ===============================
// AI ANALYSIS TYPES
// ===============================

export interface FinancialData {
  income: number;
  expenses: number;
  savings: number;
  investments: Investment[];
  debt: number;
  creditScore: number;
  goals: FinancialGoal[];
  transactions: Transaction[];
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface AffordabilityAnalysis {
  canAfford: boolean;
  recommendations: string[];
  impactOnGoals: string[];
  alternativeOptions: string[];
  monthlyPaymentBreakdown?: {
    principal: number;
    interest: number;
    total: number;
  };
}

export interface InvestmentRecommendation {
  action: 'buy' | 'sell' | 'hold';
  symbol: string;
  quantity: number;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
}

export interface FinancialInsight {
  type: 'spending' | 'saving' | 'investment' | 'goal' | 'budget';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation?: string;
}

// ===============================
// COMPONENT PROPS TYPES
// ===============================

export interface DashboardData {
  netWorth: NetWorthData;
  recentTransactions: Transaction[];
  monthlySpending: MonthlySpending;
  goals: FinancialGoal[];
  insights: FinancialInsight[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: 'financial_advice' | 'investment' | 'budgeting' | 'goals';
}

export interface NetWorthDataPoint {
  date: string;
  netWorth: number;
}

// ===============================
// API RESPONSE TYPES
// ===============================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FirestoreError {
  code: string;
  message: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// ===============================
// FORM DATA TYPES
// ===============================

export interface ProfileFormData {
  annualIncome: string;
  monthlyExpenses: string;
  assets: string;
  liabilities: string;
  creditScore: string;
  riskTolerance: 'low' | 'medium' | 'high';
  financialGoals: string[];
}

export interface TransactionFormData {
  description: string;
  amount: string;
  category: TransactionCategory;
  type: 'income' | 'expense';
  date: string;
}

export interface GoalFormData {
  name: string;
  description: string;
  targetAmount: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}
