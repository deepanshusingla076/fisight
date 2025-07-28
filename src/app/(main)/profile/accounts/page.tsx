'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link2, CreditCard, TrendingUp, PiggyBank, Landmark, Shield, Check, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';

interface LinkedAccount {
  id: string;
  name: string;
  type: string;
  bank: string;
  status: 'connected' | 'pending' | 'error';
  balance?: string;
}

export default function AccountsLinkingPage() {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    {
      id: '1',
      name: 'Savings Account',
      type: 'Bank Account',
      bank: 'HDFC Bank',
      status: 'connected',
      balance: '₹2,45,000'
    },
    {
      id: '2',
      name: 'SIP Portfolio',
      type: 'Mutual Fund',
      bank: 'Zerodha Coin',
      status: 'connected',
      balance: '₹1,25,000'
    }
  ]);
  const { toast } = useToast();

  const handleConnectAccount = (accountType: string, provider: string) => {
    const newAccount: LinkedAccount = {
      id: Date.now().toString(),
      name: `New ${accountType}`,
      type: accountType,
      bank: provider,
      status: 'pending'
    };

    setLinkedAccounts(prev => [...prev, newAccount]);

    // Simulate connection process
    setTimeout(() => {
      setLinkedAccounts(prev => 
        prev.map(acc => 
          acc.id === newAccount.id 
            ? { ...acc, status: Math.random() > 0.2 ? 'connected' : 'error' }
            : acc
        )
      );
    }, 3000);

    toast({
      title: "Connecting account",
      description: `Connecting your ${accountType} from ${provider}...`,
    });
  };

  const accountTypes = [
    {
      title: "Bank Accounts",
      description: "Link your savings, current, and salary accounts",
      icon: Landmark,
      providers: [
        { name: "HDFC Bank", logo: "🏦" },
        { name: "ICICI Bank", logo: "🏦" },
        { name: "SBI", logo: "🏦" },
        { name: "Axis Bank", logo: "🏦" },
        { name: "Kotak Mahindra", logo: "🏦" },
        { name: "IDFC First", logo: "🏦" }
      ]
    },
    {
      title: "Credit Cards",
      description: "Monitor your credit card spending and dues",
      icon: CreditCard,
      providers: [
        { name: "HDFC Credit Card", logo: "💳" },
        { name: "ICICI Credit Card", logo: "💳" },
        { name: "SBI Credit Card", logo: "💳" },
        { name: "American Express", logo: "💳" }
      ]
    },
    {
      title: "Investments & Mutual Funds",
      description: "Track your investment portfolio performance",
      icon: TrendingUp,
      providers: [
        { name: "Zerodha", logo: "📈" },
        { name: "Groww", logo: "📈" },
        { name: "ETMoney", logo: "📈" },
        { name: "Paytm Money", logo: "📈" },
        { name: "HDFC Securities", logo: "📈" },
        { name: "ICICI Direct", logo: "📈" }
      ]
    },
    {
      title: "PF & Retirement",
      description: "Connect your EPF, PPF, and retirement accounts",
      icon: PiggyBank,
      providers: [
        { name: "EPFO", logo: "🏛️" },
        { name: "PPF Account", logo: "🏛️" },
        { name: "NPS", logo: "🏛️" },
        { name: "VPF", logo: "🏛️" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Link Your Financial Accounts" 
        description="Securely connect your bank accounts, investments, and financial services for comprehensive analysis and insights."
      />

      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 text-sm space-y-2">
          <p>• We use bank-level 256-bit SSL encryption for all connections</p>
          <p>• Your login credentials are never stored on our servers</p>
          <p>• All data is processed with read-only access</p>
          <p>• You can disconnect any account at any time</p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {accountTypes.map((accountType, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <accountType.icon className="h-5 w-5" />
                {accountType.title}
              </CardTitle>
              <CardDescription>{accountType.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {accountType.providers.map((provider, providerIndex) => (
                  <div key={providerIndex} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.logo}</span>
                      <span className="font-medium">{provider.name}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleConnectAccount(accountType.title, provider.name)}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {linkedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Your linked financial accounts and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {linkedAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {account.type.includes('Bank') && <Landmark className="h-4 w-4" />}
                      {account.type.includes('Credit') && <CreditCard className="h-4 w-4" />}
                      {account.type.includes('Mutual') && <TrendingUp className="h-4 w-4" />}
                      {account.type.includes('PF') && <PiggyBank className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.bank} • {account.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {account.balance && (
                      <span className="font-medium">{account.balance}</span>
                    )}
                    <Badge 
                      variant={
                        account.status === 'connected' ? 'default' : 
                        account.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {account.status === 'connected' && <Check className="h-3 w-3 mr-1" />}
                      {account.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {account.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
