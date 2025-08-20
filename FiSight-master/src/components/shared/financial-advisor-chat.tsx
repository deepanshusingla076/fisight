'use client';

import { useState, useEffect } from 'react';
import { User, CornerDownLeft, Sparkles, AlertTriangle, TrendingUp, DollarSign, Brain } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '../ui/skeleton';
import { useProfile, profileToFinancialSituation } from '@/hooks/use-profile';
import { financialAdvisorChatbot, type FinancialAdvisorInput, type FinancialAdvisorOutput } from '@/ai/flows/financial-advisor-chatbot';

interface Message {
  id: number;
  role: 'user' | 'advisor';
  content: React.ReactNode;
  timestamp: string;
  financialAdvice?: FinancialAdvisorOutput;
}

interface UserInteraction {
  timestamp: string;
  query: string;
  response: string;
  actionTaken?: string;
}

export function FinancialAdvisorChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [interactionHistory, setInteractionHistory] = useState<UserInteraction[]>([]);
  const [currentHealthScore, setCurrentHealthScore] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const { profile } = useProfile();

  // only render on client side to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        role: 'advisor',
        content: (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold">Hi! I'm your AI Financial Advisor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              I'm here to help you manage your finances, track your spending, and suggest actions based on your financial health. 
              I have access to your financial data and can provide personalized advice.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setInput("What's my current financial health score?")}
              >
                Check my financial health
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setInput("Should I invest more or pay off debt?")}
              >
                Investment advice
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setInput("How can I save more money this month?")}
              >
                Savings tips
              </Button>
            </div>
          </div>
        ),
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare financial data from profile
      const financialData = {
        currentBalance: 0, // Not available in current profile structure
        monthlyIncome: Math.floor((profile?.annualIncome || 0) / 12),
        monthlyExpenses: profile?.monthlyExpenses || 0,
        investments: [], // Parse from assets string if needed
        debts: [], // Parse from liabilities string if needed
        recentTransactions: [], // Not available in current profile structure
      };

      // Prepare context
      const now = new Date();
      const context = {
        timeOfDay: now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening',
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        season: now.toLocaleDateString('en-US', { month: 'long' }),
        marketConditions: 'stable', // This could come from real market data
      };

      // Prepare input for the financial advisor
      const advisorInput: FinancialAdvisorInput = {
        userId: 'anonymous', // Profile doesn't have id property
        userQuery: input,
        financialData,
        interactionHistory,
        context,
      };

      // Get AI response
      const advisorResponse = await financialAdvisorChatbot(advisorInput);

      // Update health score
      setCurrentHealthScore(advisorResponse.financialHealthScore);

      // Store interaction
      const newInteraction: UserInteraction = {
        timestamp: new Date().toISOString(),
        query: input,
        response: advisorResponse.response,
      };
      setInteractionHistory(prev => [...prev, newInteraction]);

      // Create advisor message with structured response
      const advisorMessage: Message = {
        id: Date.now() + 1,
        role: 'advisor',
        content: <FinancialAdviceCard advice={advisorResponse} />,
        timestamp: new Date().toISOString(),
        financialAdvice: advisorResponse,
      };

      setMessages(prev => [...prev, advisorMessage]);
    } catch (error) {
      console.error('Error getting financial advice:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'advisor',
        content: (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>I'm sorry, I'm having trouble processing your request right now. Please try again.</span>
          </div>
        ),
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const FinancialAdviceCard = ({ advice }: { advice: FinancialAdvisorOutput }) => (
    <div className="space-y-4">
      {/* Main Response */}
      <div className="prose prose-sm dark:prose-invert">
        <p>{advice.response}</p>
      </div>

      {/* Financial Health Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Progress value={advice.financialHealthScore} className="flex-1" />
            <Badge variant={advice.financialHealthScore > 70 ? 'default' : advice.financialHealthScore > 40 ? 'secondary' : 'destructive'}>
              {advice.financialHealthScore}/100
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {advice.suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {advice.suggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="border-l-2 border-primary pl-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                    {suggestion.priority}
                  </Badge>
                  <span className="text-sm font-medium">{suggestion.action}</span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                <p className="text-xs text-blue-600">Impact: {suggestion.estimatedImpact}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      {advice.insights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {advice.insights.slice(0, 3).map((insight, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card className={`border ${advice.riskAssessment.level === 'high' ? 'border-red-200' : advice.riskAssessment.level === 'medium' ? 'border-yellow-200' : 'border-green-200'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={advice.riskAssessment.level === 'high' ? 'destructive' : advice.riskAssessment.level === 'medium' ? 'secondary' : 'default'}>
              {advice.riskAssessment.level} risk
            </Badge>
          </div>
          {advice.riskAssessment.factors.length > 0 && (
            <ul className="space-y-1">
              {advice.riskAssessment.factors.slice(0, 2).map((factor, index) => (
                <li key={index} className="text-xs text-muted-foreground">• {factor}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Follow-up Questions */}
      {advice.followUpQuestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {advice.followUpQuestions.slice(0, 2).map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInput(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
          <div className="flex flex-col items-center">
            <Brain className="h-5 w-5" />
            <span className="text-xs">AI</span>
          </div>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <SheetTitle className="text-left font-headline">AI Financial Advisor</SheetTitle>
              <SheetDescription className="text-left">
                Personalized financial guidance powered by AI
              </SheetDescription>
            </div>
          </div>
          
          {currentHealthScore > 0 && (
            <Card className="mt-3">
              <CardContent className="pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Financial Health</span>
                  <Badge variant={currentHealthScore > 70 ? 'default' : currentHealthScore > 40 ? 'secondary' : 'destructive'}>
                    {currentHealthScore}/100
                  </Badge>
                </div>
                <Progress value={currentHealthScore} className="mt-2" />
              </CardContent>
            </Card>
          )}
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'advisor' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <SheetFooter className="p-6 pt-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
