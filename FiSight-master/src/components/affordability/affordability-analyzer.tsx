'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzeAffordability, type AffordabilityAnalysisOutput } from '@/ai/flows/affordability-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AIResponseCard } from '../shared/ai-response-card';
import { Sparkles, Calculator, IndianRupee, TrendingUp, AlertCircle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  purchaseDescription: z.string().min(3, 'Please describe the purchase.'),
  purchaseCost: z.coerce.number().positive('Must be a positive number.'),
  annualIncome: z.coerce.number().positive('Must be a positive number.'),
  monthlyExpenses: z.coerce.number().positive('Must be a positive number.'),
  downPayment: z.coerce.number().nonnegative('Cannot be negative.'),
  interestRate: z.coerce.number().nonnegative('Cannot be negative.').max(100, 'Rate seems too high.'),
  loanTerm: z.coerce.number().positive('Must be a positive number of months.'),
});

// Common loan terms for different purchase types
const loanTermOptions = [
  { value: 12, label: '1 Year' },
  { value: 24, label: '2 Years' },
  { value: 36, label: '3 Years' },
  { value: 48, label: '4 Years' },
  { value: 60, label: '5 Years' },
  { value: 84, label: '7 Years' },
  { value: 120, label: '10 Years' },
  { value: 180, label: '15 Years' },
  { value: 240, label: '20 Years' },
  { value: 360, label: '30 Years' },
];

export function AffordabilityAnalyzer() {
  const [result, setResult] = useState<AffordabilityAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [monthlyEMI, setMonthlyEMI] = useState<number>(0);
  const [affordabilityScore, setAffordabilityScore] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseDescription: '',
      purchaseCost: 0,
      annualIncome: 0,
      monthlyExpenses: 0,
      downPayment: 0,
      interestRate: 8.5,
      loanTerm: 60,
    },
  });

  const watchedValues = form.watch();

  // Calculate form completion progress
  useEffect(() => {
    const fields = Object.values(watchedValues);
    const filledFields = fields.filter(value => value !== '' && value !== 0).length;
    const progress = (filledFields / fields.length) * 100;
    setFormProgress(progress);
  }, [watchedValues]);

  // Calculate EMI and affordability score in real-time
  useEffect(() => {
    const { purchaseCost, downPayment, interestRate, loanTerm, annualIncome, monthlyExpenses } = watchedValues;
    
    if (purchaseCost && downPayment && interestRate && loanTerm) {
      const principal = purchaseCost - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
      setMonthlyEMI(emi);
      
      if (annualIncome && monthlyExpenses) {
        const monthlyIncome = annualIncome / 12;
        const availableIncome = monthlyIncome - monthlyExpenses;
        const affordability = Math.max(0, Math.min(100, ((availableIncome - emi) / availableIncome) * 100));
        setAffordabilityScore(affordability);
      }
    }
  }, [watchedValues]);

  const getAffordabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAffordabilityIcon = (score: number) => {
    if (score >= 70) return CheckCircle2;
    if (score >= 40) return AlertCircle;
    return AlertCircle;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeAffordability(values);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-5xl mx-auto shadow-lg border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
            <CardHeader className="pb-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl sm:text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Affordability Analysis
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex items-center space-x-2">
                      <span>Smart financial assessment powered by AI</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Our AI analyzes your financial data to provide personalized affordability insights and recommendations.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Form Progress</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={formProgress} className="w-16 sm:w-20 h-2" />
                      <span className="text-xs font-medium">{Math.round(formProgress)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time calculations display */}
              <AnimatePresence>
                {monthlyEMI > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <IndianRupee className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Monthly EMI</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ₹{monthlyEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                    
                    {affordabilityScore > 0 && (
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${affordabilityScore >= 70 ? 'bg-green-100 dark:bg-green-900/30' : affordabilityScore >= 40 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          {(() => {
                            const IconComponent = getAffordabilityIcon(affordabilityScore);
                            return <IconComponent className={`h-4 w-4 ${getAffordabilityColor(affordabilityScore)}`} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Affordability Score</p>
                          <p className={`text-lg font-bold ${getAffordabilityColor(affordabilityScore)}`}>
                            {Math.round(affordabilityScore)}%
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FormField 
                      control={form.control} 
                      name="purchaseDescription" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Purchase Description</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Car, Home, Investment Property" 
                              className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <FormField 
                      control={form.control} 
                      name="purchaseCost" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                            <IndianRupee className="h-4 w-4" />
                            <span>Total Cost</span>
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="25,00,000" 
                              className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="downPayment" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                            <IndianRupee className="h-4 w-4" />
                            <span>Down Payment</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Initial payment made when purchasing. Higher down payment reduces loan amount.</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="5,00,000" 
                              className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="annualIncome" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Annual Income</span>
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="12,00,000" 
                              className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="monthlyExpenses" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                            <IndianRupee className="h-4 w-4" />
                            <span>Monthly Expenses</span>
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Include rent, utilities, food, transportation, and other regular expenses.</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="50,000" 
                              className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="interestRate" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                            <Calculator className="h-4 w-4" />
                            <span>Interest Rate (% p.a.)</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Annual interest rate offered by lender. Current rates: Car 8-12%, Home 8-10%.</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              placeholder="8.5" 
                              className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField 
                      control={form.control} 
                      name="loanTerm" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Loan Term</span>
                          </FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                <SelectValue placeholder="Select term" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loanTermOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={isLoading || formProgress < 70} 
                      className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      {isLoading ? (
                        <span className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent"></div>
                          <span>Analyzing Financial Data...</span>
                        </span>
                      ) : formProgress < 70 ? (
                        `Complete ${Math.round(70 - formProgress)}% more to analyze`
                      ) : (
                        'Generate Comprehensive Analysis'
                      )}
                    </Button>
                    
                    {formProgress < 70 && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Fill in the required fields to enable analysis
                      </p>
                    )}
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
        
        <AnimatePresence>
          {(isLoading || error || result) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIResponseCard
                title="💡 Smart Affordability Assessment"
                data={result}
                isLoading={isLoading}
                error={error}
                dataMap={[
                  { key: 'summary', label: '📊 Executive Summary', type: 'string', icon: 'summary' },
                  { key: 'impactOnNetWorth', label: '💰 Financial Impact Analysis', type: 'string', icon: 'rationale' },
                  { key: 'recommendation', label: '🎯 Professional Recommendation', type: 'string', icon: 'rationale' },
                ]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
