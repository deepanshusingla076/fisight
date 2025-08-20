import type { Transaction, Investment, NetWorthDataPoint } from './types';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-07-26', description: 'Salary Deposit', amount: 5000, category: 'Income' },
  { id: '2', date: '2024-07-25', description: 'Grocery Store', amount: -120.50, category: 'Groceries' },
  { id: '3', date: '2024-07-24', description: 'Electricity Bill', amount: -75.00, category: 'Utilities' },
  { id: '4', date: '2024-07-23', description: 'Movie Tickets', amount: -30.00, category: 'Entertainment' },
  { id: '5', date: '2024-07-22', description: 'Gas Station', amount: -45.25, category: 'Transport' },
];

export const mockPortfolio: Investment[] = [
    { id: '1', name: 'Vanguard S&P 500 ETF', symbol: 'VOO', quantity: 10, purchasePrice: 400, currentValue: 4500 },
    { id: '2', name: 'Apple Inc.', symbol: 'AAPL', quantity: 15, purchasePrice: 150, currentValue: 3000 },
    { id: '3', name: 'Tesla, Inc.', symbol: 'TSLA', quantity: 5, purchasePrice: 200, currentValue: 1250 },
    { id: '4', name: 'iShares MSCI EAFE ETF', symbol: 'EFA', quantity: 20, purchasePrice: 70, currentValue: 1500 },
];

export const mockNetWorthHistory: NetWorthDataPoint[] = [
  { date: 'Jan', netWorth: 50000 },
  { date: 'Feb', netWorth: 52000 },
  { date: 'Mar', netWorth: 51500 },
  { date: 'Apr', netWorth: 54000 },
  { date: 'May', netWorth: 56500 },
  { date: 'Jun', netWorth: 58000 },
  { date: 'Jul', netWorth: 61000 },
];

export const mockCurrentFinancialSituation = `
  Annual Income: $120,000
  Monthly Expenses: $4,000
  Assets:
    - Savings Account: $25,000
    - Checking Account: $5,000
    - Investment Portfolio: $10,250
    - Real Estate: $0
  Liabilities:
    - Credit Card Debt: $2,000
    - Student Loans: $15,000
`;
