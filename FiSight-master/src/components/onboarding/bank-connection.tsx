'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  CreditCard, 
  DollarSign, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  isConnected: boolean;
  lastSync?: Date;
}

interface BankConnectionProps {
  onConnect: (bankData: any) => Promise<void>;
  existingAccounts?: BankAccount[];
  onDisconnect?: (accountId: string) => Promise<void>;
}

const POPULAR_BANKS = [
  { name: 'Chase Bank', code: 'chase' },
  { name: 'Bank of America', code: 'boa' },
  { name: 'Wells Fargo', code: 'wells' },
  { name: 'Citibank', code: 'citi' },
  { name: 'Capital One', code: 'capital' },
  { name: 'US Bank', code: 'usbank' },
  { name: 'PNC Bank', code: 'pnc' },
  { name: 'TD Bank', code: 'td' },
  { name: 'Fifth Third Bank', code: 'fifth' },
  { name: 'Regions Bank', code: 'regions' }
];

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'investment', label: 'Investment Account' },
  { value: 'loan', label: 'Loan Account' }
];

export function BankConnection({ onConnect, existingAccounts = [], onDisconnect }: BankConnectionProps) {
  const [selectedBank, setSelectedBank] = useState('');
  const [customBankName, setCustomBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMode, setConnectionMode] = useState<'demo' | 'manual'>('demo');
  const { toast } = useToast();

  const handleConnect = async () => {
    const bankName = selectedBank === 'other' ? customBankName : 
                     POPULAR_BANKS.find(b => b.code === selectedBank)?.name || '';

    if (!bankName || !accountType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);

      const bankData = {
        bankName,
        accountType,
        accountNumber: connectionMode === 'demo' ? 'DEMO-' + Date.now() : accountNumber,
        routingNumber: connectionMode === 'demo' ? '123456789' : routingNumber,
        connectionMode,
        connectedAt: new Date().toISOString()
      };

      await onConnect(bankData);

      toast({
        title: "Bank Connected Successfully",
        description: `Your ${bankName} ${accountType} account has been connected.`,
      });

      // Reset form
      setSelectedBank('');
      setCustomBankName('');
      setAccountType('');
      setAccountNumber('');
      setRoutingNumber('');

    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect your bank account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!onDisconnect) return;

    try {
      await onDisconnect(accountId);
      toast({
        title: "Account Disconnected",
        description: "Bank account has been disconnected successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Accounts */}
      {existingAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Connected Accounts
            </CardTitle>
            <CardDescription>
              Your currently connected bank accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {account.accountType === 'credit' ? (
                        <CreditCard className="w-5 h-5" />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{account.bankName}</div>
                      <div className="text-sm text-muted-foreground">
                        {account.accountType} •••• {account.accountNumber.slice(-4)}
                      </div>
                      {account.lastSync && (
                        <div className="text-xs text-muted-foreground">
                          Last synced: {account.lastSync.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">${account.balance.toLocaleString()}</div>
                      <Badge variant={account.isConnected ? "default" : "secondary"}>
                        {account.isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    {onDisconnect && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Connect New Account
          </CardTitle>
          <CardDescription>
            Add a bank account to automatically track your finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={connectionMode} onValueChange={(value) => setConnectionMode(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Demo Mode</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Demo mode will create a sample account with mock data for testing purposes.
                  No real banking credentials are required.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Manual entry allows you to add account details manually. This is for demonstration 
                  purposes only - do not enter real banking credentials.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-6">
            {/* Bank Selection */}
            <div>
              <Label htmlFor="bank">Select Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_BANKS.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Bank Name */}
            {selectedBank === 'other' && (
              <div>
                <Label htmlFor="customBank">Bank Name</Label>
                <Input
                  id="customBank"
                  placeholder="Enter your bank name"
                  value={customBankName}
                  onChange={(e) => setCustomBankName(e.target.value)}
                />
              </div>
            )}

            {/* Account Type */}
            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Manual Entry Fields */}
            {connectionMode === 'manual' && (
              <>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    placeholder="Enter routing number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Security Note */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Notice:</strong> This is a demo application. 
                Your data is stored locally and securely. In a production app, 
                we would use bank-grade encryption and secure APIs like Plaid.
              </AlertDescription>
            </Alert>

            {/* Connect Button */}
            <Button
              onClick={handleConnect}
              disabled={isConnecting || !selectedBank || !accountType}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Bank-Level Security</div>
                <div className="text-sm text-muted-foreground">
                  256-bit SSL encryption protects your data
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Read-Only Access</div>
                <div className="text-sm text-muted-foreground">
                  We can only view your data, never make changes
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Trusted Partner</div>
                <div className="text-sm text-muted-foreground">
                  Powered by industry-standard banking APIs
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">No Hidden Fees</div>
                <div className="text-sm text-muted-foreground">
                  Account connection is completely free
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
