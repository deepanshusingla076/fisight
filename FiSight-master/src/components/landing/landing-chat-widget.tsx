'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  TrendingUp, 
  PiggyBank, 
  Calculator, 
  Target,
  Sparkles,
  Brain,
  ChevronRight,
  DollarSign,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'insight' | 'suggestion';
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  category: 'planning' | 'analysis' | 'advice';
}

const quickActions: QuickAction[] = [
  {
    id: 'budget-analysis',
    label: 'Budget Analysis',
    icon: Calculator,
    prompt: 'Help me analyze my budget and spending patterns',
    category: 'analysis'
  },
  {
    id: 'investment-advice',
    label: 'Investment Tips',
    icon: TrendingUp,
    prompt: 'Give me investment advice for a beginner',
    category: 'advice'
  },
  {
    id: 'savings-goal',
    label: 'Savings Goals',
    icon: PiggyBank,
    prompt: 'Help me set and achieve savings goals',
    category: 'planning'
  },
  {
    id: 'retirement-planning',
    label: 'Retirement Plan',
    icon: Target,
    prompt: 'What should I know about retirement planning?',
    category: 'planning'
  }
];

const demoResponses = {
  'budget-analysis': "📊 Great choice! Budget analysis is crucial for financial health. I can help you:\n\n• Track spending patterns\n• Identify areas to cut costs\n• Set realistic budget limits\n• Monitor progress\n\nFor personalized budget analysis with your actual data, sign up for FiSight Pro!",
  'investment-advice': "📈 Smart thinking! Here are key investment principles:\n\n• Start early with compound interest\n• Diversify your portfolio\n• Consider low-cost index funds\n• Invest regularly (dollar-cost averaging)\n\nFor AI-powered investment recommendations tailored to your goals, create your free account!",
  'savings-goal': "🎯 Excellent goal! Here's how to succeed:\n\n• Set specific, measurable targets\n• Automate your savings\n• Use the 50/30/20 rule\n• Track progress regularly\n\nOur AI can create personalized savings strategies based on your income and expenses. Sign up to get started!",
  'retirement-planning': "🏖️ Planning ahead is wise! Key considerations:\n\n• Start as early as possible\n• Contribute to 401(k) matching\n• Consider Roth vs Traditional IRA\n• Plan for 25x annual expenses\n\nGet a detailed retirement roadmap with our AI advisor - create your account today!",
  'default': [
    "Hi! I'm your AI financial advisor. I can help you with budgeting, investment planning, and financial analysis. To access my full capabilities, please sign up for FiSight!",
    "That's a great question about investments! For personalized advice based on your financial situation, I'd need to know more about your goals and portfolio. Sign up to get detailed, personalized recommendations!",
    "I'd love to help you with that financial planning question! Our full AI advisor has access to real-time market data and can create custom strategies. Create an account to unlock all features!",
    "Financial planning is crucial for your future! I can provide much more detailed analysis once you're logged in. Would you like to create a free account to get started?",
  ]
};

export function LandingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "👋 Welcome to FiSight! I'm your AI financial advisor. Choose a quick action below or ask me anything about finances!\n\n💡 Demo users get 5 free messages.",
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const MAX_DEMO_MESSAGES = 5;

  useEffect(() => {
    if (isOpen && !isExpanded) {
      setTimeout(() => setIsExpanded(true), 100);
    }
  }, [isOpen]);

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      (window as any).speechRecognition = recognition;
    }
  }, []);

  const startListening = () => {
    if (messageCount >= MAX_DEMO_MESSAGES) return;
    
    if (typeof window !== 'undefined' && (window as any).speechRecognition) {
      setIsListening(true);
      (window as any).speechRecognition.start();
    }
  };

  const stopListening = () => {
    if (typeof window !== 'undefined' && (window as any).speechRecognition) {
      setIsListening(false);
      (window as any).speechRecognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (messageCount >= MAX_DEMO_MESSAGES) return;
    
    setSelectedAction(action.id);
    setMessageCount(prev => prev + 1);
    
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: action.prompt,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response with typing delay
    setTimeout(() => {
      const response = demoResponses[action.id as keyof typeof demoResponses] as string;
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        type: 'insight'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      setSelectedAction(null);
      
      // Speak the response
      speakText(response);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!input.trim() || messageCount >= MAX_DEMO_MESSAGES) return;

    setMessageCount(prev => prev + 1);
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = demoResponses.default;
      const response = responses[Math.floor(Math.random() * responses.length)];
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Speak the response
      speakText(response);
    }, 1500);
  };

  const handleClose = () => {
    setIsExpanded(false);
    stopSpeaking();
    stopListening();
    setTimeout(() => setIsOpen(false), 200);
  };

  const remainingMessages = MAX_DEMO_MESSAGES - messageCount;
  const isLimitReached = messageCount >= MAX_DEMO_MESSAGES;

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover:scale-110 group relative overflow-hidden"
          size="icon"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
          <Brain className="h-7 w-7 text-primary-foreground group-hover:rotate-12 transition-transform duration-300" />
          <Sparkles className="absolute top-2 right-2 h-3 w-3 text-yellow-300 animate-pulse" />
        </Button>
        
        {/* Floating indicator */}
        <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-foreground text-background px-3 py-1 rounded-lg text-sm whitespace-nowrap">
            Chat with AI Advisor
          </div>
        </div>
      </div>

      {/* Enhanced Chat Widget */}
      {isOpen && (
        <div className={`fixed inset-0 z-50 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Chat Container */}
          <div className={`absolute bottom-6 right-6 transition-all duration-500 ${
            isExpanded 
              ? 'w-[420px] h-[580px]' 
              : 'w-80 h-[450px] scale-90'
          }`}>
            <Card className="w-full h-full shadow-2xl border-2 border-primary/20 flex flex-col bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-lg">
              {/* Header */}
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Brain className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        FiSight AI Advisor
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <Sparkles className="h-2 w-2 mr-1" />
                          Demo
                        </Badge>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {isLimitReached ? 'Demo limit reached' : `${remainingMessages} messages left`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={isSpeaking ? stopSpeaking : undefined}
                      className={`h-7 w-7 ${isSpeaking ? 'text-primary hover:bg-primary/10' : 'opacity-50'}`}
                      disabled={!isSpeaking}
                    >
                      <Volume2 className={`h-3 w-3 ${isSpeaking ? 'animate-pulse' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-3 p-4">
                {/* Quick Actions */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Quick Help
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      const isSelected = selectedAction === action.id;
                      return (
                        <Button
                          key={action.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                          disabled={isTyping || isLimitReached}
                          className={`h-auto p-2 text-left justify-start transition-all duration-300 hover:scale-105 ${
                            isSelected ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/50'
                          } ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-1.5 w-full">
                            <Icon className={`h-3 w-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-medium ${isSelected ? 'text-primary' : ''}`}>
                                {action.label}
                              </div>
                            </div>
                            <ChevronRight className={`h-2 w-2 transition-transform ${isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 pr-1">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg'
                              : message.type === 'insight'
                              ? 'bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 shadow-sm'
                              : 'bg-muted border border-border'
                          }`}
                        >
                          {message.role === 'assistant' && message.type === 'insight' && (
                            <div className="flex items-center gap-1 mb-1 text-accent">
                              <Sparkles className="h-3 w-3" />
                              <span className="text-xs font-semibold">AI Insight</span>
                            </div>
                          )}
                          <div className="whitespace-pre-line text-xs leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                          <span className="text-xs text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    )}

                    {/* Limit Reached Message */}
                    {isLimitReached && (
                      <div className="flex justify-center">
                        <div className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 text-center">
                          <div className="text-xs text-accent font-semibold mb-1">Demo Limit Reached</div>
                          <div className="text-xs text-muted-foreground">Sign up for unlimited AI assistance!</div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isLimitReached ? "Sign up for more messages..." : "Ask about finances..."}
                      onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isLimitReached && handleSendMessage()}
                      disabled={isTyping || isLimitReached}
                      className="flex-1 focus:border-primary transition-colors text-sm h-9"
                    />
                    
                    {/* Voice Input Button */}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={isListening ? stopListening : startListening}
                      disabled={isTyping || isLimitReached}
                      className={`h-9 w-9 p-0 transition-all duration-300 ${
                        isListening 
                          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                          : 'hover:bg-primary/5 hover:border-primary/20'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="h-3 w-3 animate-pulse" />
                      ) : (
                        <Mic className="h-3 w-3" />
                      )}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      disabled={isTyping || !input.trim() || isLimitReached}
                      className="bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-9 w-9 p-0"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild 
                    className={`w-full bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] h-8 text-xs ${
                      isLimitReached ? 'animate-pulse' : ''
                    }`}
                  >
                    <Link href="/login" className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {isLimitReached ? 'Continue Chatting - Sign Up Free' : 'Unlock Full AI Advisor'}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>

                  {/* Voice Status */}
                  {isListening && (
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Listening... Speak now
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
