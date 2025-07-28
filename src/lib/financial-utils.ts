/**
 * @fileOverview Financial Analysis Utilities
 * 
 * Helper functions for financial calculations and analysis
 */

export interface FinancialData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  investments: Array<{
    type: string;
    value: number;
    performance: number;
  }>;
  debts: Array<{
    type: string;
    amount: number;
    interestRate: number;
  }>;
  recentTransactions: Array<{
    date: string;
    amount: number;
    category: string;
    description: string;
  }>;
}

/**
 * Calculate financial health score based on multiple factors
 */
export function calculateFinancialHealthScore(financialData: FinancialData): number {
  let score = 0;
  
  // Emergency fund (30 points max)
  const monthlyExpenses = financialData.monthlyExpenses;
  const emergencyFundMonths = financialData.currentBalance / monthlyExpenses;
  if (emergencyFundMonths >= 6) score += 30;
  else if (emergencyFundMonths >= 3) score += 20;
  else if (emergencyFundMonths >= 1) score += 10;
  
  // Savings rate (25 points max)
  const savingsRate = ((financialData.monthlyIncome - financialData.monthlyExpenses) / financialData.monthlyIncome) * 100;
  if (savingsRate >= 20) score += 25;
  else if (savingsRate >= 10) score += 15;
  else if (savingsRate >= 5) score += 10;
  else if (savingsRate > 0) score += 5;
  
  // Debt-to-income ratio (25 points max)
  const totalDebt = financialData.debts.reduce((sum, debt) => sum + debt.amount, 0);
  const debtToIncomeRatio = (totalDebt / (financialData.monthlyIncome * 12)) * 100;
  if (debtToIncomeRatio <= 10) score += 25;
  else if (debtToIncomeRatio <= 30) score += 15;
  else if (debtToIncomeRatio <= 50) score += 10;
  else if (debtToIncomeRatio <= 80) score += 5;
  
  // Investment diversification (20 points max)
  const investmentTypes = new Set(financialData.investments.map(inv => inv.type));
  if (investmentTypes.size >= 4) score += 20;
  else if (investmentTypes.size >= 3) score += 15;
  else if (investmentTypes.size >= 2) score += 10;
  else if (investmentTypes.size >= 1) score += 5;
  
  return Math.min(score, 100);
}

/**
 * Calculate net worth
 */
export function calculateNetWorth(financialData: FinancialData): number {
  const totalAssets = financialData.currentBalance + 
    financialData.investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalDebt = financialData.debts.reduce((sum, debt) => sum + debt.amount, 0);
  return totalAssets - totalDebt;
}

/**
 * Calculate debt-to-income ratio
 */
export function calculateDebtToIncomeRatio(financialData: FinancialData): number {
  const totalDebt = financialData.debts.reduce((sum, debt) => sum + debt.amount, 0);
  return (totalDebt / (financialData.monthlyIncome * 12)) * 100;
}

/**
 * Calculate savings rate
 */
export function calculateSavingsRate(financialData: FinancialData): number {
  const netIncome = financialData.monthlyIncome - financialData.monthlyExpenses;
  return (netIncome / financialData.monthlyIncome) * 100;
}

/**
 * Assess financial risk level
 */
export function assessFinancialRisk(financialData: FinancialData): {
  level: 'low' | 'medium' | 'high';
  factors: string[];
} {
  const factors: string[] = [];
  const savingsRate = calculateSavingsRate(financialData);
  const debtToIncomeRatio = calculateDebtToIncomeRatio(financialData);
  const emergencyFundMonths = financialData.currentBalance / financialData.monthlyExpenses;
  
  // Check risk factors
  if (savingsRate < 5) {
    factors.push('Low savings rate');
  }
  
  if (debtToIncomeRatio > 50) {
    factors.push('High debt-to-income ratio');
  }
  
  if (emergencyFundMonths < 3) {
    factors.push('Insufficient emergency fund');
  }
  
  if (financialData.investments.length === 0) {
    factors.push('No investment portfolio');
  }
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high';
  if (factors.length >= 3) {
    level = 'high';
  } else if (factors.length >= 1) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  return { level, factors };
}

/**
 * Generate financial insights based on data analysis
 */
export function generateFinancialInsights(financialData: FinancialData): string[] {
  const insights: string[] = [];
  const savingsRate = calculateSavingsRate(financialData);
  const debtToIncomeRatio = calculateDebtToIncomeRatio(financialData);
  const netWorth = calculateNetWorth(financialData);
  const emergencyFundMonths = financialData.currentBalance / financialData.monthlyExpenses;
  
  // Savings insights
  if (savingsRate > 20) {
    insights.push('Excellent savings rate! You\'re on track for strong financial growth.');
  } else if (savingsRate > 10) {
    insights.push('Good savings rate, but there\'s room for improvement.');
  } else if (savingsRate > 0) {
    insights.push('You\'re saving money, but consider increasing your savings rate.');
  } else {
    insights.push('You\'re spending more than you earn - this needs immediate attention.');
  }
  
  // Emergency fund insights
  if (emergencyFundMonths >= 6) {
    insights.push('You have a solid emergency fund covering 6+ months of expenses.');
  } else if (emergencyFundMonths >= 3) {
    insights.push('Your emergency fund covers 3-6 months - consider building it up further.');
  } else {
    insights.push('Building an emergency fund should be a priority.');
  }
  
  // Debt insights
  if (debtToIncomeRatio <= 10) {
    insights.push('Your debt levels are very manageable.');
  } else if (debtToIncomeRatio <= 30) {
    insights.push('Your debt levels are reasonable but monitor them carefully.');
  } else {
    insights.push('Your debt levels are concerning and should be addressed.');
  }
  
  // Investment insights
  if (financialData.investments.length === 0) {
    insights.push('Consider starting an investment portfolio for long-term growth.');
  } else if (financialData.investments.length < 3) {
    insights.push('Your investment portfolio could benefit from more diversification.');
  } else {
    insights.push('You have a diversified investment portfolio.');
  }
  
  return insights;
}
