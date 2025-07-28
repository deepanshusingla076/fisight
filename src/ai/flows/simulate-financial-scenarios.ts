// This is a Genkit flow.

'use server';

/**
 * @fileOverview Simulates different financial scenarios to understand the potential impact on financial health.
 *
 * - simulateFinancialScenario - A function that handles the financial scenario simulation process.
 * - SimulateFinancialScenarioInput - The input type for the simulateFinancialScenario function.
 * - SimulateFinancialScenarioOutput - The return type for the simulateFinancialScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateFinancialScenarioInputSchema = z.object({
  scenarioDescription: z.string().describe('A description of the financial scenario to simulate, including details such as investment amount, asset type, or purchase details.'),
  currentFinancialSituation: z.string().describe('A summary of the user\'s current financial situation, including income, expenses, assets, and liabilities.'),
});
export type SimulateFinancialScenarioInput = z.infer<typeof SimulateFinancialScenarioInputSchema>;

const SimulateFinancialScenarioOutputSchema = z.object({
  projectedNetWorthChange: z.string().describe('A projection of how the scenario will impact the user\'s net worth over a specified time period.'),
  riskAssessment: z.string().describe('An assessment of the risks associated with the scenario.'),
  alternativeSuggestions: z.string().describe('Suggestions for alternative actions or modifications to the scenario to improve the outcome.'),
});
export type SimulateFinancialScenarioOutput = z.infer<typeof SimulateFinancialScenarioOutputSchema>;

export async function simulateFinancialScenario(input: SimulateFinancialScenarioInput): Promise<SimulateFinancialScenarioOutput> {
  return simulateFinancialScenarioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateFinancialScenarioPrompt',
  input: {schema: SimulateFinancialScenarioInputSchema},
  output: {schema: SimulateFinancialScenarioOutputSchema},
  prompt: `You are a financial advisor. The user will describe a financial scenario they are considering, along with their current financial situation. Your task is to:

  1.  Project how the scenario will impact the user\'s net worth over a specified time period.
  2.  Assess the risks associated with the scenario.
  3.  Suggest alternative actions or modifications to the scenario to improve the outcome.

Current Financial Situation: {{{currentFinancialSituation}}}
Scenario Description: {{{scenarioDescription}}}`,
});

const simulateFinancialScenarioFlow = ai.defineFlow(
  {
    name: 'simulateFinancialScenarioFlow',
    inputSchema: SimulateFinancialScenarioInputSchema,
    outputSchema: SimulateFinancialScenarioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
