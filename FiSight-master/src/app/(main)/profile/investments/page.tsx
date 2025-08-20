'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { TrendingUp, Plus, PieChart, Target, DollarSign, BarChart3 } from 'lucide-react';

export default function InvestmentsPage() {
  const investments = [
    {
      id: '1',
      name: 'Axis Bluechip Fund',
      type: 'Equity Mutual Fund',
      platform: 'Groww',
      invested: 120000,
      current: 145000,
      returns: 25000,
      returnsPercent: 20.83,
      sipAmount: 10000,
      status: 'active'
    },
    {
      id: '2',
      name: 'ICICI Prudential Debt Fund',
      type: 'Debt Mutual Fund',
      platform: 'Zerodha Coin',
      invested: 80000,
      current: 84500,
      returns: 4500,
      returnsPercent: 5.63,
      sipAmount: 5000,
      status: 'active'
    },
    {
      id: '3',
      name: 'Reliance Large Cap',
      type: 'Equity Mutual Fund',
      platform: 'ETMoney',
      invested: 150000,
      current: 168000,
      returns: 18000,
      returnsPercent: 12.0,
      sipAmount: 15000,
      status: 'active'
    },
    {
      id: '4',
      name: 'HDFC Bank Stocks',
      type: 'Direct Equity',
      platform: 'Zerodha',
      invested: 50000,
      current: 47000,
      returns: -3000,
      returnsPercent: -6.0,
      sipAmount: 0,
      status: 'holding'
    }
  ];

  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.current, 0);
  const totalReturns = totalCurrent - totalInvested;
  const totalReturnsPercent = (totalReturns / totalInvested) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Investments & Mutual Funds" 
          description="Track your investment portfolio performance and SIPs"
        />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {investments.length} investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCurrent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio value today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUp className={`h-4 w-4 ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturns >= 0 ? '+' : ''}₹{totalReturns.toLocaleString()}
            </div>
            <p className={`text-xs ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturns >= 0 ? '+' : ''}{totalReturnsPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly SIP</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{investments.reduce((sum, inv) => sum + inv.sipAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Systematic investments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Your investment holdings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{investment.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {investment.type} • {investment.platform}
                    </p>
                    {investment.sipAmount > 0 && (
                      <p className="text-xs text-blue-600">
                        SIP: ₹{investment.sipAmount.toLocaleString()}/month
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Invested</p>
                      <p className="font-medium">₹{investment.invested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="font-medium">₹{investment.current.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Returns</p>
                      <p className={`font-semibold ${
                        investment.returns >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {investment.returns >= 0 ? '+' : ''}₹{investment.returns.toLocaleString()}
                      </p>
                      <p className={`text-xs ${
                        investment.returns >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ({investment.returns >= 0 ? '+' : ''}{investment.returnsPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={investment.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {investment.status}
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
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Distribution of your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Equity Mutual Funds</span>
                <span className="font-medium">68.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Debt Mutual Funds</span>
                <span className="font-medium">18.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Direct Equity</span>
                <span className="font-medium">10.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Others</span>
                <span className="font-medium">2.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SIP Calendar</CardTitle>
            <CardDescription>Upcoming SIP deductions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Axis Bluechip Fund</p>
                  <p className="text-sm text-muted-foreground">Due: Jan 30, 2025</p>
                </div>
                <span className="font-medium">₹10,000</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Reliance Large Cap</p>
                  <p className="text-sm text-muted-foreground">Due: Jan 30, 2025</p>
                </div>
                <span className="font-medium">₹15,000</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">ICICI Prudential Debt</p>
                  <p className="text-sm text-muted-foreground">Due: Feb 1, 2025</p>
                </div>
                <span className="font-medium">₹5,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
