'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NetWorthCard } from './net-worth-card';
import { RecentTransactions } from './recent-transactions';
import { FinancialHealthSummary } from './financial-health-summary';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';
import { BankConnection } from '@/components/onboarding/bank-connection';
import { useFinancialData } from '@/hooks/use-financial-data';
import { useAuth } from '@/contexts/auth-context';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target, DollarSign, AlertCircle, UserPlus, Building2 } from 'lucide-react';

export function DashboardClientPage() {
  const { currentUser } = useAuth();
  const {
    // Enhanced state from user management
    isNewUser,
    isLoading,
    hasCompletedOnboarding,
    dashboardData,
    
    // Existing data
    userProfile,
    transactions,
    goals,
    netWorth,
    monthlySpending,
    loading,
    error,
    isProfileComplete,
    totalAssets,
    totalLiabilities,
    totalNetWorth,
    monthlySpendingTotal,
    
    // Functions
    completeOnboarding,
    connectBankAccount,
    getFinancialInsights,
    initializeUserData
  } = useFinancialData();

  const [showBankConnection, setShowBankConnection] = useState(false);

  // Show onboarding for new users who haven't completed it
  if (isNewUser && !hasCompletedOnboarding && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <OnboardingWizard 
          onComplete={completeOnboarding}
          onSkip={() => {
            // For demo purposes, allow skipping
            initializeUserData();
          }}
        />
      </div>
    );
  }

  // Show bank connection if user completed onboarding but has no connected accounts
  if (!isNewUser && hasCompletedOnboarding && !showBankConnection && 
      (!dashboardData?.accounts || dashboardData.accounts.length === 0) && !loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Almost There!</h1>
          <p className="text-muted-foreground">
            Connect your bank account to start tracking your finances automatically.
          </p>
        </div>
        
        <BankConnection 
          onConnect={connectBankAccount}
          existingAccounts={dashboardData?.accounts || []}
        />
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowBankConnection(true)}
          >
            Skip for now - Use demo data
          </Button>
        </div>
      </div>
    );
  }

  const insights = getFinancialInsights();

  if (loading || isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => initializeUserData()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser?.displayName || userProfile?.personalInfo?.firstName || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          {isNewUser 
            ? "Your financial journey starts here." 
            : "Here's your financial overview for today."
          }
        </p>
      </div>

      {/* New User Welcome Message */}
      {isNewUser && hasCompletedOnboarding && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Welcome to FiSight!
            </CardTitle>
            <CardDescription>
              Your financial profile has been set up. We're generating your personalized dashboard with sample data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={() => setShowBankConnection(true)}>
                <Building2 className="h-4 w-4 mr-2" />
                Connect Bank Account
              </Button>
              <Button variant="outline" onClick={() => initializeUserData()}>
                Continue with Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Connection Modal */}
      {showBankConnection && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Bank Account</CardTitle>
            <CardDescription>
              Securely connect your bank to automatically import transactions and account balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BankConnection 
              onConnect={async (bankData) => {
                await connectBankAccount(bankData);
                setShowBankConnection(false);
              }}
              existingAccounts={dashboardData?.accounts || []}
            />
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowBankConnection(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights and Alerts */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Insights & Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${
                insight.priority === 'high' ? 'border-l-red-500' :
                insight.priority === 'medium' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                    <Badge variant={
                      insight.priority === 'high' ? 'destructive' :
                      insight.priority === 'medium' ? 'default' :
                      'secondary'
                    }>
                      {insight.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  {insight.actionable && (
                    <p className="text-sm font-medium text-primary">
                      💡 {insight.recommendation}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalNetWorth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalNetWorth >= 0 ? '+' : ''}${(totalNetWorth - (userProfile?.previousNetWorth || 0)).toLocaleString()} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAssets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalLiabilities.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Including all debts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlySpendingTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month so far
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <NetWorthCard netWorth={netWorth} />
          <RecentTransactions transactions={transactions.slice(0, 10)} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <FinancialHealthSummary 
            userProfile={userProfile}
            netWorth={netWorth}
            monthlySpending={monthlySpending}
          />

          {/* Connected Accounts Summary */}
          {dashboardData?.accounts && dashboardData.accounts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.accounts.slice(0, 3).map((account: any) => (
                    <div key={account.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{account.bankName}</div>
                        <div className="text-sm text-muted-foreground">
                          {account.accountType} •••• {account.accountNumber.slice(-4)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${account.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {dashboardData.accounts.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View All Accounts ({dashboardData.accounts.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Financial Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant="outline">
                          {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${goal.currentAmount.toLocaleString()}</span>
                        <span>${goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {goals.length > 3 && (
                    <Button variant="outline" className="w-full" size="sm">
                      View All Goals ({goals.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Goals Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set financial goals to track your progress
                  </p>
                  <Button size="sm">Add Your First Goal</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions for New Users */}
          {isNewUser && (
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Complete these steps to make the most of FiSight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setShowBankConnection(true)}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Connect Bank Account
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Set Financial Goals
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Get AI Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
