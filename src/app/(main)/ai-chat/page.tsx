'use client';

import { useState, useRef, useEffect } from 'react';
import { User, CornerDownLeft, Sparkles, AlertTriangle, Brain, Send, Trash2 } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { useProfile, profileToFinancialSituation } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'financial' | 'rejected' | 'normal';
}

// Enhanced system prompt for better financial NLP handling
const SYSTEM_PROMPT = `You are FiSight AI, an advanced financial advisor and assistant. Your role is to help users with their personal finance management, investment decisions, and financial planning.

CORE CAPABILITIES:
- Personal finance analysis and budgeting
- Investment portfolio management and recommendations
- Loan and debt management strategies
- Tax planning and optimization
- Retirement and pension planning
- Financial goal setting and tracking
- Market analysis and trends
- Banking and account management
- Insurance and risk management

RESPONSE GUIDELINES:
1. ONLY respond to finance-related queries
2. For non-financial questions, politely redirect to financial topics
3. Always provide actionable, personalized advice based on user's financial profile
4. Use clear, professional language avoiding jargon when possible
5. Include specific numbers, percentages, and calculations when relevant
6. Suggest concrete next steps or actions
7. Reference current market conditions when applicable

REJECTION CRITERIA - Politely decline to answer:
- Personal questions unrelated to finance
- General knowledge queries outside finance
- Technical support for non-financial software
- Health, relationship, or lifestyle advice
- Political opinions or news commentary
- Entertainment or sports discussions

SAMPLE RESPONSES:
✅ Good: "Based on your monthly income of ₹80,000 and expenses of ₹55,000, I recommend allocating ₹15,000 for investments..."
❌ Reject: "I'm a financial advisor AI. I can help with budgeting, investments, loans, and financial planning. How can I assist with your finances today?"

Always maintain a helpful, professional tone while staying strictly within financial advisory scope.`;

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm FiSight AI, your personal financial advisor. I can help you with budgeting, investments, loans, taxes, retirement planning, and more. What financial topic would you like to discuss today?",
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const isFinancialQuery = (query: string): boolean => {
    const financialKeywords = [
      'money', 'budget', 'invest', 'save', 'loan', 'debt', 'bank', 'account', 'credit', 'debit',
      'mutual fund', 'stock', 'equity', 'bond', 'sip', 'emi', 'interest', 'tax', 'income',
      'expense', 'salary', 'pf', 'epf', 'ppf', 'nps', 'insurance', 'retirement', 'pension',
      'portfolio', 'asset', 'liability', 'cash flow', 'financial', 'finance', 'economic',
      'wealth', 'profit', 'loss', 'return', 'dividend', 'inflation', 'market', 'trading',
      'rupee', 'dollar', 'currency', 'payment', 'transaction', 'balance', 'fd', 'rd',
      'gold', 'real estate', 'property', 'mortgage', 'housing loan', 'car loan', 'personal loan',
      'credit card', 'credit score', 'cibil', 'kyc', 'pan', 'aadhar', 'gst', 'tds'
    ];

    const queryLower = query.toLowerCase();
    return financialKeywords.some(keyword => queryLower.includes(keyword));
  };

  const generateFinancialResponse = async (query: string): Promise<string> => {
    // Simulate API call with enhanced financial responses
    await new Promise(resolve => setTimeout(resolve, 1500));

    const queryLower = query.toLowerCase();
    
    // Check if it's a financial query
    if (!isFinancialQuery(query)) {
      return "I'm a financial advisor AI specialized in helping with budgeting, investments, loans, taxes, and financial planning. I'd be happy to help with any finance-related questions you have. For example, you could ask about creating a budget, investment strategies, loan management, or retirement planning. What financial topic interests you?";
    }

    // Generate contextual financial responses
    if (queryLower.includes('budget') || queryLower.includes('expense')) {
      return `Based on typical financial planning principles, I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. 

For your specific situation:
• Track all expenses for 30 days to understand spending patterns
• Categorize expenses into fixed (rent, utilities) and variable (entertainment, dining)
• Set up automatic transfers to savings accounts
• Use apps or spreadsheets to monitor monthly cash flow

Would you like me to help create a personalized budget plan based on your income and goals?`;
    }

    if (queryLower.includes('invest') || queryLower.includes('sip') || queryLower.includes('mutual fund')) {
      return `For investment planning, I recommend a diversified approach:

**Equity Mutual Funds (60-70% allocation):**
• Large-cap funds for stability
• Mid-cap funds for growth potential
• International funds for diversification

**Debt Instruments (20-30% allocation):**
• PPF for tax benefits (15-year lock-in)
• ELSS funds for tax saving under 80C
• Liquid funds for emergency corpus

**SIP Strategy:**
• Start with ₹5,000-10,000 monthly SIP
• Increase by 10% annually (step-up SIP)
• Choose funds with consistent 5+ year performance

What's your investment horizon and risk tolerance? I can suggest specific fund categories based on your goals.`;
    }

    if (queryLower.includes('loan') || queryLower.includes('emi') || queryLower.includes('debt')) {
      return `For effective debt management, follow this priority order:

**1. High-Interest Debt First:**
• Credit cards (18-24% interest) - pay off immediately
• Personal loans (11-16% interest)
• Vehicle loans (8-12% interest)
• Home loans (8-10% interest) - lowest priority

**2. EMI Optimization:**
• Keep total EMIs under 40% of monthly income
• Consider loan consolidation if multiple debts exist
• Make partial prepayments for high-interest loans

**3. Strategies:**
• Use windfall money (bonus, tax refunds) for prepayment
• Consider balance transfer for credit cards
• Negotiate with banks for better interest rates

What specific loan concerns do you have? I can help create a debt repayment strategy.`;
    }

    if (queryLower.includes('tax') || queryLower.includes('save tax') || queryLower.includes('80c')) {
      return `Here are key tax-saving strategies for FY 2024-25:

**Section 80C (₹1.5 lakh limit):**
• EPF contributions (automatic for salaried)
• ELSS mutual funds (3-year lock-in)
• PPF (15-year lock-in, 7.1% return)
• Life insurance premiums
• Principal repayment of home loan

**Other Deductions:**
• 80D: Health insurance (₹25,000 for self, ₹50,000 for parents)
• 24B: Home loan interest (₹2 lakh for self-occupied)
• 80E: Education loan interest (no limit)

**New vs Old Tax Regime:**
• New regime: Lower rates but fewer deductions
• Old regime: Higher rates but more deductions available

Based on your income level, would you like me to calculate which regime works better for you?`;
    }

    if (queryLower.includes('emergency fund') || queryLower.includes('emergency')) {
      return `Emergency fund is crucial for financial security:

**Target Amount:**
• 6-12 months of monthly expenses
• For ₹50,000 monthly expenses = ₹3-6 lakh emergency fund

**Where to Keep:**
• 50% in savings account (instant access)
• 30% in liquid mutual funds (1-2 day withdrawal)
• 20% in short-term FDs (higher returns)

**Building Strategy:**
• Start with ₹10,000-20,000 monthly allocation
• Use tax refunds, bonuses to boost fund
• Automate transfers to separate emergency account
• Don't invest emergency funds in equity/volatile assets

**Usage Guidelines:**
• Only for genuine emergencies (job loss, medical, major repairs)
• Replenish immediately after use
• Review and adjust amount annually

Do you currently have an emergency fund? I can help you plan the right amount based on your expenses.`;
    }

    // Default financial response
    return `I understand you're asking about ${query}. As your financial advisor, I can provide personalized guidance on:

• **Investment Planning:** Mutual funds, stocks, bonds, SIPs
• **Budget Management:** Expense tracking, savings goals
• **Loan Strategy:** EMI optimization, debt consolidation
• **Tax Planning:** 80C deductions, regime comparison
• **Retirement Planning:** EPF, PPF, NPS contributions
• **Insurance:** Life, health, vehicle coverage

Could you be more specific about which financial area you'd like help with? For example, you could ask:
- "How should I invest ₹20,000 monthly?"
- "Help me create a budget for ₹80,000 salary"
- "Should I prepay my home loan or invest?"

What specific financial goal or challenge can I help you with today?`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      id: Date.now(), 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date(),
      type: 'normal'
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateFinancialResponse(currentInput);
      
      const assistantMessage: Message = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response,
        timestamp: new Date(),
        type: isFinancialQuery(currentInput) ? 'financial' : 'rejected'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try asking your financial question again in a moment.",
        timestamp: new Date(),
        type: 'normal'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Hello! I'm FiSight AI, your personal financial advisor. I can help you with budgeting, investments, loans, taxes, retirement planning, and more. What financial topic would you like to discuss today?",
      timestamp: new Date(),
      type: 'normal'
    }]);
    toast({
      title: "Chat cleared",
      description: "Starting a fresh conversation with FiSight AI."
    });
  };

  const suggestionQueries = [
    "How should I start investing with ₹10,000 monthly?",
    "Help me create a budget for ₹75,000 salary",
    "Should I prepay my home loan or invest in SIP?",
    "What are the best tax saving options under 80C?",
    "How much emergency fund do I need?",
    "Compare ELSS vs PPF for tax saving"
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          title="AI Financial Assistant" 
          description="Get personalized financial advice powered by AI"
        />
        <Button variant="outline" onClick={clearChat} className="shrink-0">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            FiSight AI Chat
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Financial Expert
            </Badge>
          </CardTitle>
          <CardDescription>
            Ask me anything about budgeting, investments, loans, taxes, and financial planning
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-primary/10">
                        <Logo className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.type === 'rejected'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-muted'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
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
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary/10">
                      <Logo className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="ml-2">Analyzing your financial question...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
              <div className="grid gap-2">
                {suggestionQueries.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3 whitespace-normal"
                    onClick={() => setInput(suggestion)}
                  >
                    <Sparkles className="h-3 w-3 mr-2 shrink-0 text-primary" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, budgeting, loans, taxes..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="shrink-0">
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
