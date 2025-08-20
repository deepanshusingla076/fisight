'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  User, 
  CornerDownLeft, 
  Sparkles, 
  AlertTriangle, 
  Brain, 
  Send, 
  Trash2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Command
} from 'lucide-react';
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
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';

// Lazy load voice settings panel
const VoiceSettingsPanel = dynamic(() => 
  import('@/components/shared/voice-settings-panel').then(mod => ({ 
    default: mod.VoiceSettingsPanel 
  })), {
  loading: () => <div className="p-2 bg-muted/20 animate-pulse rounded text-xs">Loading settings...</div>,
});

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
      content: "Hello! I'm FiSight AI, your personal financial advisor with voice assistance. I can help you with budgeting, investments, loans, taxes, retirement planning, and more. You can type or speak your questions!",
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [currentSpeakingMessageId, setCurrentSpeakingMessageId] = useState<number | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showVoiceTest, setShowVoiceTest] = useState(false);
  const { profile } = useProfile();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Voice Assistant Hook
  const voice = useVoiceAssistant();

  const handleClearMessages = () => {
    setMessages([]);
  };

  // Initialize speech synthesis with user interaction
  const initializeSpeech = () => {
    if (!speechEnabled && window.speechSynthesis) {
      // Create a silent utterance to initialize speech synthesis
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
      setSpeechEnabled(true);
    }
  };

  const handleSpeakMessage = (message: Message) => {
    // Ensure speech is initialized
    initializeSpeech();
    
    // Clean the message for better speech
    const cleanText = message.content
      .replace(/\*\*/g, '') // Remove markdown bold
      .replace(/\*/g, '') // Remove markdown italics
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1') // Replace inline code
      .replace(/•/g, 'bullet point:') // Replace bullet points
      .replace(/₹/g, 'rupees ') // Replace currency symbol
      .replace(/\n\n/g, '. ') // Replace double line breaks
      .replace(/\n/g, '. ') // Replace line breaks
      .trim();
    
    // Stop current speech and speak this message
    voice.stopSpeaking();
    setCurrentSpeakingMessageId(null);
    
    setTimeout(() => {
      setCurrentSpeakingMessageId(message.id);
      voice.speak(cleanText);
    }, 200);
  };

  // Track when speech ends to clear the speaking message ID
  useEffect(() => {
    if (!voice.isSpeaking) {
      setCurrentSpeakingMessageId(null);
    }
  }, [voice.isSpeaking]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle voice transcript
  useEffect(() => {
    if (voice.transcript && !voice.isListening) {
      const trimmedTranscript = voice.transcript.trim();
      if (trimmedTranscript) {
        setInput(trimmedTranscript);
        voice.resetTranscript();
        
        // Auto-submit voice input after a short delay
        setTimeout(() => {
          if (trimmedTranscript && !isLoading) {
            // Trigger form submission programmatically
            const form = document.querySelector('form[data-voice-form]') as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }
        }, 500);
      }
    }
  }, [voice.transcript, voice.isListening, voice.resetTranscript, isLoading]);

  // Voice commands processing
  useEffect(() => {
    if (voiceCommandsEnabled && voice.transcript) {
      const command = voice.transcript.toLowerCase().trim();
      
      // Voice commands
      if (command.includes('stop talking') || command.includes('stop speaking')) {
        voice.stopSpeaking();
        voice.resetTranscript();
        return;
      }
      
      if (command.includes('clear chat') || command.includes('clear messages')) {
        handleClearMessages();
        voice.resetTranscript();
        return;
      }
      
      if (command.includes('repeat') || command.includes('say again')) {
        const lastMessage = messages.filter(m => m.role === 'assistant').pop();
        if (lastMessage) {
          handleSpeakMessage(lastMessage);
        }
        voice.resetTranscript();
        return;
      }
    }
  }, [voice.transcript, voiceCommandsEnabled, voice, messages]);

  // Auto-speak AI responses
  useEffect(() => {
    if (autoSpeak && speechEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.id !== 1) { // Skip initial greeting
        // Stop any current speech before speaking new response
        if (voice.isSpeaking) {
          voice.stopSpeaking();
        }
        setCurrentSpeakingMessageId(null);
        
        // Use a delay to ensure clean speech transition and the UI is ready
        const timeoutId = setTimeout(() => {
          // Double-check that auto-speak is still enabled and we're not already speaking
          if (autoSpeak && speechEnabled && !voice.isSpeaking && !isLoading) {
            // Clean up the response text for better speech
            const cleanText = lastMessage.content
              .replace(/\*\*/g, '') // Remove markdown bold
              .replace(/\*/g, '') // Remove markdown italics
              .replace(/```[\s\S]*?```/g, '') // Remove code blocks
              .replace(/`([^`]+)`/g, '$1') // Replace inline code
              .replace(/•/g, 'bullet point:') // Replace bullet points
              .replace(/₹/g, 'rupees ') // Replace currency symbol
              .replace(/\n\n/g, '. ') // Replace double line breaks
              .replace(/\n/g, '. ') // Replace line breaks
              .trim();
            
            if (cleanText) {
              setCurrentSpeakingMessageId(lastMessage.id);
              voice.speak(cleanText);
            }
          }
        }, 1000); // Longer delay for better reliability
        
        // Cleanup timeout if effect reruns
        return () => clearTimeout(timeoutId);
      }
    }
  }, [messages, autoSpeak, speechEnabled, voice, isLoading]);

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

    // Initialize speech synthesis on first user interaction
    initializeSpeech();

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
    setIsLoading(true);    try {
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
    <div className="flex flex-col h-full max-w-7xl mx-auto p-3">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold font-headline whitespace-nowrap">
                AI Financial Advisor
              </h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Financial Health Score: <span className="font-bold text-primary">72/100</span>
            </p>
          </div>
        </div>
        
        {/* Voice Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-card border rounded-lg p-2">
            <Button
              variant={voice.isListening ? "default" : "outline"}
              size="sm"
              onClick={voice.isListening ? voice.stopListening : voice.startListening}
              className="relative h-8 px-3"
            >
              {voice.isListening ? (
                <>
                  <MicOff className="h-3 w-3 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-3 w-3 mr-1" />
                  Voice Input
                </>
              )}
              {voice.isListening && (
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
              )}
            </Button>
            
            <Button
              variant={autoSpeak ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className="relative h-7 px-2 transition-all duration-200 hover:shadow-md"
            >
              {autoSpeak ? <Volume2 className="h-3 w-3 mr-1" /> : <VolumeX className="h-3 w-3 mr-1" />}
              {autoSpeak ? 'On' : 'Off'}
              {autoSpeak && voice.isSpeaking && (
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary/50" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="h-7 px-2 transition-all duration-200 hover:shadow-md hover:bg-accent/10"
            >
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVoiceTest(!showVoiceTest)}
              className="h-8 px-3"
            >
              <Command className="h-3 w-3 mr-1" />
              Test
            </Button>
          </div>
          
          <Button variant="outline" onClick={handleClearMessages} className="shrink-0 h-8 px-3">
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Voice Test Component */}
      {showVoiceTest && (
        <div className="mb-3">
          <div className="p-3 bg-muted/20 rounded text-sm text-muted-foreground">
            Voice test component removed for cleaner interface
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex gap-4">
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-card/95 backdrop-blur-sm shadow-xl border-0 ring-1 ring-border/50 min-h-[400px]">
          <CardHeader className="pb-1 bg-gradient-to-r from-primary/8 to-accent/8 rounded-t-lg border-b border-border/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary/50"></div>
                <CardTitle className="text-base font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">AI Financial Advisor</CardTitle>
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            <CardDescription className="text-xs mt-0.5 text-muted-foreground/80">
              👋 AI Financial Advisor with voice assistance. Ask about budgeting, investing, debt & taxes.
            </CardDescription>
          </CardHeader>

          {/* Voice Settings Panel */}
          {showVoiceSettings && (
            <div className="border-b p-2 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm">
              <VoiceSettingsPanel 
                voices={voice.voices}
                settings={voice.settings}
                updateSettings={voice.updateSettings}
                isRecognitionSupported={voice.isRecognitionSupported}
                isAudioSupported={voice.isAudioSupported}
                speak={voice.speak}
                isSpeaking={voice.isSpeaking}
              />
            </div>
          )}

          {/* Voice Status */}
          {(voice.isListening || voice.isSpeaking || voice.transcript) && (
            <div className="border-b p-3 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {voice.isListening && (
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs font-medium">🎤 Listening</span>
                    </div>
                  )}
                  {voice.isSpeaking && (
                    <div className="flex items-center gap-1 text-accent">
                      <Volume2 className="h-3 w-3" />
                      <span className="text-xs font-medium">🔊 Speaking</span>
                    </div>
                  )}
                  {!voice.isListening && !voice.isSpeaking && voice.transcript && (
                    <span className="text-xs text-muted-foreground">⚡ Processing</span>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {voice.isSpeaking && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={voice.stopSpeaking}
                      className="h-6 px-2 text-xs"
                    >
                      <VolumeX className="h-3 w-3 mr-1" />
                      Stop
                    </Button>
                  )}
                </div>
              </div>
              
              {voice.transcript && (
                <div className="mt-1 p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg text-xs border border-border/50 backdrop-blur-sm shadow-sm">
                  <span className="text-muted-foreground">You said: </span>
                  <span className="font-medium text-emerald-600">{voice.transcript}</span>
                </div>
              )}
            </div>
          )}

          <CardContent className="flex-1 flex flex-col space-y-3 p-4">
            <ScrollArea ref={scrollAreaRef} className="flex-1 pr-3 min-h-[400px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 border-2 border-primary/30 ring-2 ring-primary/10 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
                          <Brain className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`rounded-xl p-3 max-w-[75%] relative shadow-lg backdrop-blur-sm border ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-primary/95 to-accent/95 text-primary-foreground border-primary/30 shadow-primary/20' 
                        : message.type === 'rejected'
                        ? 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30 shadow-destructive/10'
                        : 'bg-gradient-to-br from-card/95 to-muted/95 border-border/50 shadow-md'
                    } ${
                      currentSpeakingMessageId === message.id && voice.isSpeaking 
                        ? 'ring-2 ring-primary/50 animate-pulse shadow-xl shadow-primary/30' 
                        : ''
                    }`}>
                      {currentSpeakingMessageId === message.id && voice.isSpeaking && (
                        <div className="absolute top-1 right-1">
                          <div className="flex items-center gap-0.5">
                            <div className="w-0.5 h-2 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-0.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-xs leading-relaxed">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/30 dark:border-gray-600/50">
                        <div className={`text-xs font-medium ${message.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground/80'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        {message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-primary/20 rounded-full transition-all duration-200"
                            onClick={() => handleSpeakMessage(message)}
                            title="Listen to this message"
                          >
                            {currentSpeakingMessageId === message.id && voice.isSpeaking ? (
                              <Volume2 className="h-3 w-3 text-primary animate-pulse drop-shadow-sm" />
                            ) : (
                              <Volume2 className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors duration-200" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 border-2 border-primary/40 ring-2 ring-primary/20 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm">
                          <User className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/30 ring-2 ring-primary/10 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
                        <Brain className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-br from-card/95 to-muted/95 rounded-xl p-3 border border-border/50 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce shadow-sm shadow-primary/50" />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce shadow-sm shadow-primary/50" style={{ animationDelay: '0.1s' }} />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce shadow-sm shadow-primary/50" style={{ animationDelay: '0.2s' }} />
                        <span className="ml-2 font-medium">Analyzing your financial question...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="space-y-2 p-3 bg-gradient-to-r from-primary/8 to-accent/8 rounded-lg border border-border/50 backdrop-blur-sm shadow-sm">
                <p className="text-xs font-medium text-muted-foreground/90">💡 Try saying: "How can I improve my budget?" or use the microphone button.</p>
                <div className="grid gap-1">
                  {suggestionQueries.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-3 whitespace-normal hover:bg-primary/5 text-sm"
                      onClick={() => setInput(suggestion)}
                    >
                      <Sparkles className="h-3 w-3 mr-2 shrink-0 text-primary" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex gap-3" data-voice-form>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about investments, budgeting, loans, taxes... (or speak)"
                  disabled={isLoading}
                  className="pr-16 h-10 text-sm bg-card border border-border focus:border-primary rounded-lg"
                />
                
                <Button
                  type="button"
                  variant={voice.isListening ? "default" : "ghost"}
                  size="sm"
                  onClick={voice.isListening ? voice.stopListening : voice.startListening}
                  disabled={isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 p-0"
                >
                  {voice.isListening ? (
                    <MicOff className="h-3 w-3 text-primary-foreground" />
                  ) : (
                    <Mic className="h-3 w-3" />
                  )}
                  {voice.isListening && (
                    <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-destructive rounded-full animate-pulse" />
                  )}
                </Button>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="h-8 px-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-lg shadow-lg text-xs font-medium transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Side Panel - Quick Actions */}
        <Card className="w-96 bg-card shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-headline flex items-center gap-3">
              <Command className="h-6 w-6 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-base font-medium text-muted-foreground">💰 Health Check</h4>
              <Button variant="outline" size="default" className="w-full justify-start h-12 text-base">
                📊 Budget Help
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-base font-medium text-muted-foreground">📈 Investments</h4>
              <Button variant="outline" size="default" className="w-full justify-start h-12 text-base">
                💹 Investment Tips
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2"><span className="text-lg">🎤</span> Voice Commands</p>
                <p className="flex items-center gap-2"><span className="text-lg">🔊</span> Text-to-Speech</p>
                <p className="flex items-center gap-2"><span className="text-lg">⚡</span> AI-Powered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
