export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'Income' | 'Groceries' | 'Utilities' | 'Entertainment' | 'Transport';
}

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentValue: number;
}

export interface NetWorthDataPoint {
  date: string;
  netWorth: number;
}
