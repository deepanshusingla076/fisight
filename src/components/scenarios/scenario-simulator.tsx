'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simulateFinancialScenario, type SimulateFinancialScenarioOutput } from '@/ai/flows/simulate-financial-scenarios';
import { mockCurrentFinancialSituation } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AIResponseCard } from '../shared/ai-response-card';
import { Sparkles } from 'lucide-react';

const formSchema = z.object({
  scenarioDescription: z.string().min(20, 'Please provide a detailed description of the scenario.'),
});

export function ScenarioSimulator() {
  const [result, setResult] = useState<SimulateFinancialScenarioOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenarioDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await simulateFinancialScenario({
        ...values,
        currentFinancialSituation: mockCurrentFinancialSituation,
      });
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Describe Your Scenario</CardTitle>
          <CardDescription>What financial move are you considering?</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="scenarioDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scenario Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'What if I invest $10,000 into a high-growth tech stock index fund and hold it for 5 years?' or 'What is the impact of taking a year off work to travel?'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be as specific as possible for the best results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Simulating...' : 'Simulate Scenario'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:mt-0">
        {(isLoading || error || result) && (
            <AIResponseCard
              title="Simulation Results"
              data={result}
              isLoading={isLoading}
              error={error}
              dataMap={[
                { key: 'projectedNetWorthChange', label: 'Projected Net Worth Change', type: 'string', icon: 'summary' },
                { key: 'riskAssessment', label: 'Risk Assessment', type: 'string', icon: 'list' },
                { key: 'alternativeSuggestions', label: 'Alternative Suggestions', type: 'string', icon: 'rationale' },
              ]}
            />
        )}
         {!isLoading && !error && !result && (
            <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground p-8">
                    <p>Your AI-powered simulation results will appear here.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
