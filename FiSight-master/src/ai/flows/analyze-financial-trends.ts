'use server';

/**
 * @fileOverview A financial trend analysis AI agent.
 *
 * - analyzeFinancialTrends - A function that handles the financial trend analysis process.
 * - AnalyzeFinancialTrendsInput - The input type for the analyzeFinancialTrends function.
 * - AnalyzeFinancialTrendsOutput - The return type for the analyzeFinancialTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFinancialTrendsInputSchema = z.object({
  financialData: z
    .string()
    .describe('A consolidated string of normalized financial data.'),
});
export type AnalyzeFinancialTrendsInput = z.infer<typeof AnalyzeFinancialTrendsInputSchema>;

const AnalyzeFinancialTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of the key financial trends identified.'),
  insights: z.array(z.string()).describe('Specific insights into spending habits and financial health.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations based on the analysis.'),
});
export type AnalyzeFinancialTrendsOutput = z.infer<typeof AnalyzeFinancialTrendsOutputSchema>;

export async function analyzeFinancialTrends(input: AnalyzeFinancialTrendsInput): Promise<AnalyzeFinancialTrendsOutput> {
  return analyzeFinancialTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFinancialTrendsPrompt',
  input: {schema: AnalyzeFinancialTrendsInputSchema},
  output: {schema: AnalyzeFinancialTrendsOutputSchema},
  prompt: `You are an expert financial analyst. Analyze the following financial data to identify trends, provide insights, and suggest recommendations.

Financial Data: {{{financialData}}}

Provide a concise summary of the key trends, specific insights into spending habits and financial health, and actionable recommendations.

Format your response as a JSON object that satisfies the AnalyzeFinancialTrendsOutputSchema schema.  The insights and recommendations should be returned as arrays of strings.

Be concise in your analysis.
`,
});

const analyzeFinancialTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeFinancialTrendsFlow',
    inputSchema: AnalyzeFinancialTrendsInputSchema,
    outputSchema: AnalyzeFinancialTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
