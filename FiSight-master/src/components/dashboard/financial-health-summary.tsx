'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzeFinancialTrends, type AnalyzeFinancialTrendsOutput } from '@/ai/flows/analyze-financial-trends';
import { mockTransactions } from '@/lib/mock-data';
import { AIResponseCard } from '../shared/ai-response-card';
import { Sparkles } from 'lucide-react';

export function FinancialHealthSummary() {
  const [analysis, setAnalysis] = useState<AnalyzeFinancialTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const financialData = JSON.stringify(mockTransactions);
      const result = await analyzeFinancialTrends({ financialData });
      setAnalysis(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">AI Financial Health Check</CardTitle>
        <CardDescription>
          Get instant AI-powered insights into your spending habits and financial health.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analysis && !isLoading && !error && (
            <AIResponseCard 
              title="Analysis Results"
              data={analysis}
              isLoading={isLoading}
              error={error}
              dataMap={[
                { key: 'summary', label: 'Summary', type: 'string', icon: 'summary' },
                { key: 'insights', label: 'Key Insights', type: 'list', icon: 'list' },
                { key: 'recommendations', label: 'Recommendations', type: 'list', icon: 'list' }
              ]}
            />
        )}
        {!analysis && !isLoading && (
            <div className="text-center text-muted-foreground p-8">
                <p>Click the button below to analyze your financial trends.</p>
            </div>
        )}
         {isLoading && (
            <AIResponseCard 
              title="Analyzing..."
              data={null}
              isLoading={true}
              error={null}
              dataMap={[
                { key: 'summary', label: 'Summary', type: 'string', icon: 'summary' },
                { key: 'insights', label: 'Key Insights', type: 'list', icon: 'list' },
                { key: 'recommendations', label: 'Recommendations', type: 'list', icon: 'list' }
              ]}
            />
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleAnalyze} disabled={isLoading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Analyzing...' : 'Analyze My Financial Health'}
        </Button>
      </CardFooter>
    </Card>
  );
}
