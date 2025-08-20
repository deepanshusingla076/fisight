'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { Landmark, Plus, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function BankAccountsPage() {
  const [showBalances, setShowBalances] = useState(false);

  const bankAccounts = [
    {
      id: '1',
      name: 'Primary Savings',
      bank: 'HDFC Bank',
      accountNumber: 'XXXX5678',
      type: 'Savings',
      balance: 245000,
      status: 'active',
      lastSync: '2 mins ago'
    },
    {
      id: '2',
      name: 'Salary Account',
      bank: 'ICICI Bank',
      accountNumber: 'XXXX9012',
      type: 'Salary',
      balance: 89000,
      status: 'active',
      lastSync: '5 mins ago'
    },
    {
      id: '3',
      name: 'Business Current',
      bank: 'Axis Bank',
      accountNumber: 'XXXX3456',
      type: 'Current',
      balance: 156000,
      status: 'active',
      lastSync: '1 hour ago'
    }
  ];

  const recentTransactions = [
    { id: '1', description: 'Salary Credit', amount: 85000, type: 'credit', date: '2025-01-25' },
    { id: '2', description: 'Rent Payment', amount: -25000, type: 'debit', date: '2025-01-24' },
    { id: '3', description: 'Grocery Shopping', amount: -3500, type: 'debit', date: '2025-01-23' },
    { id: '4', description: 'Mutual Fund SIP', amount: -10000, type: 'debit', date: '2025-01-22' },
    { id: '5', description: 'Freelance Payment', amount: 15000, type: 'credit', date: '2025-01-21' }
  ];

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Bank Accounts" 
          description="Manage and monitor your connected bank accounts"
        />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBalances(!showBalances)}
              className="h-8 w-8 p-0"
            >
              {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalances ? `₹${totalBalance.toLocaleString()}` : '₹••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {bankAccounts.length} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+₹65,500</div>
            <p className="text-xs text-muted-foreground">
              Net inflow this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹38,500</div>
            <p className="text-xs text-muted-foreground">
              Average monthly spending
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Your linked bank accounts and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Landmark className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{account.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {account.bank} • {account.accountNumber} • {account.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last synced: {account.lastSync}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {showBalances ? `₹${account.balance.toLocaleString()}` : '₹••••••'}
                  </p>
                  <Badge variant="default" className="text-xs">
                    {account.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest transactions across all your bank accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
