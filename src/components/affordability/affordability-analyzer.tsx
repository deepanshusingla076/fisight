'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzeAffordability, type AffordabilityAnalysisOutput } from '@/ai/flows/affordability-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AIResponseCard } from '../shared/ai-response-card';
import { Sparkles } from 'lucide-react';

const formSchema = z.object({
  purchaseDescription: z.string().min(3, 'Please describe the purchase.'),
  purchaseCost: z.coerce.number().positive('Must be a positive number.'),
  annualIncome: z.coerce.number().positive('Must be a positive number.'),
  monthlyExpenses: z.coerce.number().positive('Must be a positive number.'),
  downPayment: z.coerce.number().nonnegative('Cannot be negative.'),
  interestRate: z.coerce.number().nonnegative('Cannot be negative.').max(100, 'Rate seems too high.'),
  loanTerm: z.coerce.number().positive('Must be a positive number of months.'),
});

export function AffordabilityAnalyzer() {
  const [result, setResult] = useState<AffordabilityAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseDescription: '',
      purchaseCost: 0,
      annualIncome: 0,
      monthlyExpenses: 0,
      downPayment: 0,
      interestRate: 0,
      loanTerm: 0,
    },
  });

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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Can I Afford This?</CardTitle>
        <CardDescription>Fill in the details below for an AI-powered analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="purchaseDescription" render={({ field }) => (
              <FormItem><FormLabel>Purchase</FormLabel><FormControl><Input placeholder="e.g., New Car, Kitchen Remodel" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="purchaseCost" render={({ field }) => (
                <FormItem><FormLabel>Total Cost ($)</FormLabel><FormControl><Input type="number" placeholder="50000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="downPayment" render={({ field }) => (
                <FormItem><FormLabel>Down Payment ($)</FormLabel><FormControl><Input type="number" placeholder="10000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="annualIncome" render={({ field }) => (
                <FormItem><FormLabel>Annual Income ($)</FormLabel><FormControl><Input type="number" placeholder="120000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="monthlyExpenses" render={({ field }) => (
                <FormItem><FormLabel>Monthly Expenses ($)</FormLabel><FormControl><Input type="number" placeholder="4000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="interestRate" render={({ field }) => (
                <FormItem><FormLabel>Loan Interest Rate (%)</FormLabel><FormControl><Input type="number" placeholder="5.5" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="loanTerm" render={({ field }) => (
                <FormItem><FormLabel>Loan Term (Months)</FormLabel><FormControl><Input type="number" placeholder="60" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? 'Analyzing...' : 'Analyze Affordability'}
            </Button>
          </form>
        </Form>
        
        {(isLoading || error || result) && (
          <div className="mt-6">
            <AIResponseCard
              title="Affordability Report"
              data={result}
              isLoading={isLoading}
              error={error}
              dataMap={[
                { key: 'summary', label: 'Analysis Summary', type: 'string', icon: 'summary' },
                { key: 'impactOnNetWorth', label: 'Impact on Net Worth', type: 'string', icon: 'rationale' },
                { key: 'recommendation', label: 'Recommendation', type: 'string', icon: 'rationale' },
              ]}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
