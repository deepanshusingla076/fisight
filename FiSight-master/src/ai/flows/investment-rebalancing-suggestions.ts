'use server';
/**
 * @fileOverview An AI agent that provides investment rebalancing suggestions.
 *
 * - getInvestmentRebalancingSuggestions - A function that provides investment rebalancing suggestions.
 * - GetInvestmentRebalancingSuggestionsInput - The input type for the getInvestmentRebalancingSuggestions function.
 * - GetInvestmentRebalancingSuggestionsOutput - The return type for the getInvestmentRebalancingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetInvestmentRebalancingSuggestionsInputSchema = z.object({
  portfolioData: z.string().describe('A JSON string containing the user\'s current investment portfolio data, including asset names, quantities, and current market values.'),
  riskTolerance: z.string().describe('The user\'s risk tolerance level (e.g., conservative, moderate, aggressive).'),
  investmentGoals: z.string().describe('The user\'s investment goals (e.g., retirement, buying a home, general wealth building).'),
});
export type GetInvestmentRebalancingSuggestionsInput = z.infer<typeof GetInvestmentRebalancingSuggestionsInputSchema>;

const GetInvestmentRebalancingSuggestionsOutputSchema = z.object({
  summary: z.string().describe('A summary of the current portfolio performance and potential issues.'),
  underperformingAssets: z.array(z.string()).describe('A list of specific assets that are underperforming relative to the user\'s goals and risk tolerance.'),
  rebalancingSuggestions: z.string().describe('Specific, actionable suggestions for rebalancing the portfolio, including which assets to buy, sell, or hold, and in what quantities or proportions.'),
  rationale: z.string().describe('A detailed explanation of the rationale behind the rebalancing suggestions, taking into account the user\'s risk tolerance, investment goals, and current market conditions.'),
});
export type GetInvestmentRebalancingSuggestionsOutput = z.infer<typeof GetInvestmentRebalancingSuggestionsOutputSchema>;

export async function getInvestmentRebalancingSuggestions(input: GetInvestmentRebalancingSuggestionsInput): Promise<GetInvestmentRebalancingSuggestionsOutput> {
  return investmentRebalancingSuggestionsFlow(input);
}

const investmentRebalancingSuggestionsPrompt = ai.definePrompt({
  name: 'investmentRebalancingSuggestionsPrompt',
  input: {schema: GetInvestmentRebalancingSuggestionsInputSchema},
  output: {schema: GetInvestmentRebalancingSuggestionsOutputSchema},
  prompt: `You are an expert financial advisor specializing in investment portfolio optimization.

You will analyze the user's current investment portfolio, risk tolerance, and investment goals to provide personalized rebalancing suggestions.

Consider the following information:

Current Portfolio Data: {{{portfolioData}}}
Risk Tolerance: {{{riskTolerance}}}
Investment Goals: {{{investmentGoals}}}

Based on this information, provide the following:

- A summary of the current portfolio performance and potential issues.
- A list of specific assets that are underperforming relative to the user's goals and risk tolerance.
- Specific, actionable suggestions for rebalancing the portfolio, including which assets to buy, sell, or hold, and in what quantities or proportions.
- A detailed explanation of the rationale behind the rebalancing suggestions, taking into account the user's risk tolerance, investment goals, and current market conditions.

Ensure that the rebalancing suggestions are aligned with the user's risk tolerance and investment goals.

Output should be in JSON format:
{
  "summary": "string",
  "underperformingAssets": ["string"],
  "rebalancingSuggestions": "string",
  "rationale": "string"
}`,
});

const investmentRebalancingSuggestionsFlow = ai.defineFlow(
  {
    name: 'investmentRebalancingSuggestionsFlow',
    inputSchema: GetInvestmentRebalancingSuggestionsInputSchema,
    outputSchema: GetInvestmentRebalancingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await investmentRebalancingSuggestionsPrompt(input);
    return output!;
  }
);

