'use server';

/**
 * @fileOverview An AI-powered affordability analysis flow.
 *
 * - analyzeAffordability - A function that handles the affordability analysis process.
 * - AffordabilityAnalysisInput - The input type for the analyzeAffordability function.
 * - AffordabilityAnalysisOutput - The return type for the analyzeAffordability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AffordabilityAnalysisInputSchema = z.object({
  purchaseDescription: z
    .string()
    .describe('Description of the major purchase being considered.'),
  purchaseCost: z.number().describe('The total cost of the purchase.'),
  annualIncome: z.number().describe('Your total annual income.'),
  monthlyExpenses: z.number().describe('Your total monthly expenses.'),
  downPayment: z.number().describe('The amount of down payment you plan to make.'),
  interestRate: z.number().describe('The interest rate for financing the purchase.'),
  loanTerm: z.number().describe('The loan term in months.'),
});
export type AffordabilityAnalysisInput = z.infer<typeof AffordabilityAnalysisInputSchema>;

const AffordabilityAnalysisOutputSchema = z.object({
  summary: z.string().describe('A summary of the affordability analysis.'),
  impactOnNetWorth: z.string().describe('The potential impact on your net worth.'),
  recommendation: z.string().describe('A recommendation on whether to proceed with the purchase.'),
});
export type AffordabilityAnalysisOutput = z.infer<typeof AffordabilityAnalysisOutputSchema>;

export async function analyzeAffordability(input: AffordabilityAnalysisInput): Promise<AffordabilityAnalysisOutput> {
  return analyzeAffordabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'affordabilityAnalysisPrompt',
  input: {schema: AffordabilityAnalysisInputSchema},
  output: {schema: AffordabilityAnalysisOutputSchema},
  prompt: `You are a financial advisor helping users determine if they can afford a major purchase.

  Analyze the following information provided to determine the affordability of the purchase:

  Purchase Description: {{{purchaseDescription}}}
  Purchase Cost: {{{purchaseCost}}}
  Annual Income: {{{annualIncome}}}
  Monthly Expenses: {{{monthlyExpenses}}}
  Down Payment: {{{downPayment}}}
  Interest Rate: {{{interestRate}}}
  Loan Term (months): {{{loanTerm}}}

  Provide a summary of your analysis, the potential impact on the user's net worth, and a recommendation on whether to proceed with the purchase.
  Be direct. Keep the summary, impact, and recommendation short and to the point.
  `,
});

const analyzeAffordabilityFlow = ai.defineFlow(
  {
    name: 'analyzeAffordabilityFlow',
    inputSchema: AffordabilityAnalysisInputSchema,
    outputSchema: AffordabilityAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
