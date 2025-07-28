'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { PiggyBank, Plus, Building, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

export default function PFLoansPage() {
  const pfAccounts = [
    {
      id: '1',
      name: 'Employee Provident Fund',
      type: 'EPF',
      employer: 'TechCorp India Pvt Ltd',
      balance: 425000,
      monthlyContribution: 3600,
      lastContribution: '2025-01-25',
      status: 'active'
    },
    {
      id: '2',
      name: 'Public Provident Fund',
      type: 'PPF',
      employer: 'SBI Bank',
      balance: 180000,
      monthlyContribution: 8000,
      lastContribution: '2025-01-15',
      status: 'active'
    },
    {
      id: '3',
      name: 'National Pension System',
      type: 'NPS',
      employer: 'PFRDA',
      balance: 95000,
      monthlyContribution: 2000,
      lastContribution: '2025-01-20',
      status: 'active'
    }
  ];

  const loans = [
    {
      id: '1',
      name: 'Home Loan',
      type: 'Housing',
      lender: 'HDFC Bank',
      principal: 2500000,
      outstanding: 1850000,
      emi: 23500,
      interestRate: 8.5,
      tenure: '15 years',
      nextEmi: '2025-02-01',
      status: 'active'
    },
    {
      id: '2',
      name: 'Car Loan',
      type: 'Vehicle',
      lender: 'ICICI Bank',
      principal: 800000,
      outstanding: 320000,
      emi: 18500,
      interestRate: 9.2,
      tenure: '2 years remaining',
      nextEmi: '2025-02-03',
      status: 'active'
    },
    {
      id: '3',
      name: 'Personal Loan',
      type: 'Personal',
      lender: 'Axis Bank',
      principal: 300000,
      outstanding: 85000,
      emi: 8500,
      interestRate: 11.5,
      tenure: '10 months remaining',
      nextEmi: '2025-02-05',
      status: 'active'
    }
  ];

  const totalPF = pfAccounts.reduce((sum, pf) => sum + pf.balance, 0);
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstanding, 0);
  const totalEMI = loans.reduce((sum, loan) => sum + loan.emi, 0);
  const totalPFContribution = pfAccounts.reduce((sum, pf) => sum + pf.monthlyContribution, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="PF & Loans" 
          description="Track your retirement savings and loan obligations"
        />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PF Balance</CardTitle>
            <PiggyBank className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPF.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Retirement savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly PF</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPFContribution.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Monthly contributions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly EMIs</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalEMI.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total monthly EMIs
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provident Fund Accounts</CardTitle>
          <CardDescription>Your retirement and savings accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pfAccounts.map((pf) => (
              <div key={pf.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <PiggyBank className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{pf.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pf.type} • {pf.employer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last contribution: {pf.lastContribution}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">₹{pf.balance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    +₹{pf.monthlyContribution}/month
                  </p>
                  <Badge variant="default" className="text-xs">
                    {pf.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>Your current loan obligations and EMI schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Building className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{loan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {loan.type} • {loan.lender} • {loan.interestRate}% interest
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Next EMI: {loan.nextEmi} • {loan.tenure}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Principal</p>
                      <p className="font-medium">₹{loan.principal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="font-medium text-red-600">₹{loan.outstanding.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">EMI</p>
                      <p className="font-semibold text-orange-600">₹{loan.emi.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {loan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>PF Projection</CardTitle>
            <CardDescription>Estimated retirement corpus at age 60</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">₹2.8 Cr</p>
                <p className="text-sm text-muted-foreground">Projected PF corpus</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current balance</span>
                  <span className="font-medium">₹{totalPF.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly contributions</span>
                  <span className="font-medium">₹{totalPFContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Years to retirement</span>
                  <span className="font-medium">25 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Expected returns</span>
                  <span className="font-medium">8.5% p.a.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming EMIs</CardTitle>
            <CardDescription>EMI payment schedule for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{loan.name}</p>
                    <p className="text-sm text-muted-foreground">Due: {loan.nextEmi}</p>
                  </div>
                  <span className="font-medium text-orange-600">₹{loan.emi.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-3">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Monthly EMIs</span>
                  <span className="text-orange-600">₹{totalEMI.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
