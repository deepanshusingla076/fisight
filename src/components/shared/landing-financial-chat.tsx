'use client';

import { useState, useEffect, useRef } from 'react';
import { User, CornerDownLeft, Sparkles, Brain, LogIn, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

interface Message {
  id: number;
  role: 'user' | 'advisor';
  content: React.ReactNode;
  timestamp: string;
}

// Sample financial responses that don't require user data
const getSampleFinancialResponse = (query: string): string => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('budget') || queryLower.includes('save money')) {
    return `Here's a proven budgeting strategy:

**The 50/30/20 Rule:**
• 50% for needs (rent, utilities, groceries)
• 30% for wants (entertainment, dining out)
• 20% for savings and debt repayment

**Quick Tips:**
• Track expenses for 30 days to understand spending patterns
• Use apps like Mint or YNAB for automated tracking
• Set up automatic transfers to savings accounts
• Review and adjust monthly

Start with one category at a time for sustainable habit building!`;
  }
  
  if (queryLower.includes('invest') || queryLower.includes('mutual fund') || queryLower.includes('sip')) {
    return `**Smart Investment Strategy for Beginners:**

**Mutual Fund SIP Approach:**
• Start with ₹2,000-5,000 monthly SIP
• Choose large-cap funds for stability (60%)
• Add mid-cap funds for growth (30%)
• Keep debt funds for safety (10%)

**Recommended Timeline:**
• Emergency fund first (6 months expenses)
• Then start SIP investments
• Increase SIP by 10% annually

**Popular Beginner Funds:**
• HDFC Top 100 Fund
• ICICI Prudential Bluechip Fund
• SBI Small Cap Fund

Remember: Time in market beats timing the market!`;
  }
  
  if (queryLower.includes('emergency fund') || queryLower.includes('emergency')) {
    return `**Emergency Fund Essentials:**

**Target Amount:**
• 3-6 months of monthly expenses
• For ₹40,000 monthly expenses = ₹1.2-2.4 lakh fund

**Where to Keep It:**
• 60% in high-yield savings account
• 30% in liquid mutual funds
• 10% in short-term FDs

**Building Strategy:**
• Save 20% of income monthly
• Use windfalls (bonus, tax refunds)
• Automate transfers on salary day

**Don't Touch Unless:**
• Job loss or income reduction
• Medical emergencies
• Major home/vehicle repairs

This fund is your financial safety net - protect it!`;
  }
  
  if (queryLower.includes('credit card') || queryLower.includes('debt') || queryLower.includes('loan')) {
    return `**Debt Management Strategy:**

**Priority Order (Pay highest interest first):**
1. Credit Cards (18-24% interest) - URGENT
2. Personal Loans (11-16% interest)
3. Vehicle Loans (8-12% interest)
4. Home Loans (7-9% interest)

**Credit Card Best Practices:**
• Pay full amount before due date
• Keep utilization under 30% of limit
• Never withdraw cash from credit cards
• Set up auto-pay for minimum amount

**Debt Snowball Method:**
• List all debts smallest to largest
• Pay minimums on all
• Attack smallest debt with extra payments
• Roll payments to next debt when done

Financial freedom starts with eliminating high-interest debt!`;
  }
  
  if (queryLower.includes('tax') || queryLower.includes('80c') || queryLower.includes('save tax')) {
    return `**Tax Saving Guide (Section 80C):**

**₹1.5 Lakh Annual Limit Options:**
• ELSS Mutual Funds (3-year lock, market returns)
• PPF (15-year lock, 7.1% returns)
• EPF (automatic for salaried employees)
• Life Insurance Premiums
• Home Loan Principal Repayment

**Other Deductions:**
• 80D: Health Insurance (₹25,000 limit)
• 80E: Education Loan Interest (no limit)
• 80G: Donations to approved charities

**Strategy Tips:**
• ELSS for wealth creation potential
• PPF for guaranteed returns
• Health insurance for family protection
• Start investing early in financial year

**New vs Old Tax Regime:**
Calculate both to see which saves more based on your deductions!`;
  }
  
  // Default response for other financial queries
  return `**General Financial Wellness Tips:**

**Monthly Financial Checklist:**
✓ Track income vs expenses
✓ Review and categorize spending
✓ Ensure emergency fund growth
✓ Check investment performance
✓ Pay all bills on time

**Long-term Wealth Building:**
• Start investing early (compound interest magic)
• Diversify across asset classes
• Increase investments with income growth
• Stay invested during market volatility
• Review and rebalance annually

**Financial Goals Framework:**
• Short-term (1-3 years): Emergency fund, vacation
• Medium-term (3-7 years): House down payment, car
• Long-term (7+ years): Retirement, children's education

Want personalized advice? Sign up for detailed analysis of your financial situation!`;
};

const sampleQuestions = [
  "How should I start budgeting my money?",
  "What's the best way to begin investing?", 
  "How much emergency fund do I need?",
  "How to manage credit card debt?",
  "What are the best tax saving options?"
];

export function LandingFinancialChatWidget() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const MAX_FREE_RESPONSES = 5;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  // Initialize with welcome message using useEffect
  useEffect(() => {
    setMessages([{
      id: 1,
      role: 'advisor',
      content: (
        <div className="space-y-3">
                  {messages.length === 0 && (
          <p>{t('chat.welcome')}</p>
        )}
          <p className="text-sm text-muted-foreground">Try asking one of these sample questions:</p>
          <div className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto p-2 text-xs"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if user has reached the limit
    if (responseCount >= MAX_FREE_RESPONSES) {
      const limitMessage: Message = {
        id: Date.now(),
        role: 'advisor',
        content: (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Free Sample Limit Reached
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{t('chat.limitReached').replace('{count}', MAX_FREE_RESPONSES.toString())}</p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login" target="_blank">
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('chat.tryFiSight')}
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Get unlimited AI advice • Portfolio analysis • Goal tracking
                </p>
              </div>
            </CardContent>
          </Card>
        ),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, limitMessage]);
      setInput('');
      return;
    }

    const userMessage: Message = { 
      id: Date.now(), 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const response = getSampleFinancialResponse(currentInput);
      const newResponseCount = responseCount + 1;
      
      let advisorContent: React.ReactNode = response;
      
      // Add sign-up prompt after a few responses
      if (newResponseCount >= 3) {
        advisorContent = (
          <div className="space-y-3">
            <div className="whitespace-pre-line text-sm">{response}</div>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-900">Sample Responses Used</span>
                  <Badge variant="secondary" className="text-xs">
                    {newResponseCount}/{MAX_FREE_RESPONSES}
                  </Badge>
                </div>
                <Progress value={(newResponseCount / MAX_FREE_RESPONSES) * 100} className="h-2 mb-2" />
                <p className="text-xs text-blue-800">
                  {newResponseCount < MAX_FREE_RESPONSES 
                    ? `${MAX_FREE_RESPONSES - newResponseCount} more sample responses available. Sign up for unlimited access!`
                    : "Sign up now for unlimited personalized financial advice!"
                  }
                </p>
                {newResponseCount >= MAX_FREE_RESPONSES - 1 && (
                  <Button asChild size="sm" className="w-full mt-2">
                    <Link href="/login" target="_blank">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Get Full Access
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        );
      }
      
      const advisorMessage: Message = { 
        id: Date.now() + 1, 
        role: 'advisor', 
        content: advisorContent,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, advisorMessage]);
      setResponseCount(newResponseCount);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          size="icon"
        >
          <Brain className="h-6 w-6" />
          <span className="sr-only">Open Financial AI Chat</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Financial AI Assistant
            <Badge variant="secondary" className="ml-auto">
              Sample Mode
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Try our AI with sample financial questions. Sign up for personalized advice!
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          <ScrollArea className="flex-1 pr-4 max-h-[60vh]">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'advisor' && (
                    <Avatar className="h-8 w-8 border bg-gradient-to-r from-primary to-blue-600">
                      <AvatarFallback className="bg-transparent text-white">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`rounded-lg p-3 max-w-[85%] ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 border bg-gradient-to-r from-primary to-blue-600">
                    <AvatarFallback className="bg-transparent text-white">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="text-xs text-muted-foreground ml-2">Analyzing your financial question...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll to bottom reference */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="space-y-3">
            {responseCount < MAX_FREE_RESPONSES && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Sample responses: {responseCount}/{MAX_FREE_RESPONSES}</span>
                <Badge variant="outline" className="text-xs">
                  {MAX_FREE_RESPONSES - responseCount} remaining
                </Badge>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={responseCount >= MAX_FREE_RESPONSES ? t('nav.getStarted') : t('chat.placeholder')}
                disabled={isLoading || responseCount >= MAX_FREE_RESPONSES}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim() || responseCount >= MAX_FREE_RESPONSES}
                className="shrink-0"
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
