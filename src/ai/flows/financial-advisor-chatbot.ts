'use server';

/**
 * financial advisor chatbot flow
 * 
 * basically an AI that:
 * - tracks your money stuff daily
 * - watches your financial vault
 * - gives you personalized money tips
 * - uses pre-trained models for speed
 * - connects with Fi Money's MCP server
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// input schema for the financial advisor chatbot
const FinancialAdvisorInputSchema = z.object({
  userId: z.string().describe("Unique identifier for the user"),
  userQuery: z.string().describe("The user's natural language query about their finances"),
  financialData: z.object({
    currentBalance: z.number().describe("Current account balance"),
    monthlyIncome: z.number().describe("Monthly income"),
    monthlyExpenses: z.number().describe("Monthly expenses"),
    investments: z.array(z.object({
      type: z.string(),
      value: z.number(),
      performance: z.number()
    })).describe("Investment portfolio"),
    debts: z.array(z.object({
      type: z.string(),
      amount: z.number(),
      interestRate: z.number()
    })).describe("Outstanding debts"),
    recentTransactions: z.array(z.object({
      date: z.string(),
      amount: z.number(),
      category: z.string(),
      description: z.string()
    })).describe("Recent financial transactions")
  }).describe("User's current financial state"),
  interactionHistory: z.array(z.object({
    timestamp: z.string(),
    query: z.string(),
    response: z.string(),
    actionTaken: z.string().optional()
  })).describe("Previous interactions with the financial advisor"),
  context: z.object({
    timeOfDay: z.string().describe("Current time of day"),
    dayOfWeek: z.string().describe("Current day of the week"),
    season: z.string().describe("Current season/month"),
    marketConditions: z.string().optional().describe("Current market conditions")
  }).describe("Contextual information")
});

export type FinancialAdvisorInput = z.infer<typeof FinancialAdvisorInputSchema>;

// Output schema for the financial advisor response
const FinancialAdvisorOutputSchema = z.object({
  response: z.string().describe("Personalized response to the user's query"),
  suggestions: z.array(z.object({
    action: z.string().describe("Recommended action"),
    priority: z.enum(['high', 'medium', 'low']).describe("Priority level"),
    reasoning: z.string().describe("Why this action is recommended"),
    estimatedImpact: z.string().describe("Expected financial impact"),
    timeframe: z.string().describe("Suggested timeframe for implementation")
  })).describe("Specific financial suggestions"),
  financialHealthScore: z.number().min(0).max(100).describe("Overall financial health score"),
  insights: z.array(z.string()).describe("Key insights about the user's financial situation"),
  nextSteps: z.array(z.string()).describe("Immediate next steps the user should consider"),
  riskAssessment: z.object({
    level: z.enum(['low', 'medium', 'high']).describe("Risk level"),
    factors: z.array(z.string()).describe("Risk factors identified")
  }).describe("Risk assessment"),
  followUpQuestions: z.array(z.string()).describe("Questions to ask in follow-up conversations")
});

export type FinancialAdvisorOutput = z.infer<typeof FinancialAdvisorOutputSchema>;

/**
 * Prompt template for the financial advisor chatbot
 */
const financialAdvisorPrompt = ai.definePrompt(
  {
    name: 'financialAdvisorPrompt',
    inputSchema: FinancialAdvisorInputSchema,
    outputSchema: FinancialAdvisorOutputSchema,
  },
  async (input) => {
    const { userId, userQuery, financialData, interactionHistory, context } = input;

    // Calculate financial health metrics
    const monthlyNetIncome = financialData.monthlyIncome - financialData.monthlyExpenses;
    const savingsRate = (monthlyNetIncome / financialData.monthlyIncome) * 100;
    const totalDebt = financialData.debts.reduce((sum, debt) => sum + debt.amount, 0);
    const totalInvestments = financialData.investments.reduce((sum, inv) => sum + inv.value, 0);
    const netWorth = financialData.currentBalance + totalInvestments - totalDebt;

    return {
      text: `You are an expert financial advisor with access to a user's complete financial profile. 
You have been tracking their daily interactions and financial activities.

USER PROFILE:
- User ID: ${userId}
- Current Balance: $${financialData.currentBalance.toLocaleString()}
- Monthly Income: $${financialData.monthlyIncome.toLocaleString()}
- Monthly Expenses: $${financialData.monthlyExpenses.toLocaleString()}
- Net Monthly Income: $${monthlyNetIncome.toLocaleString()}
- Savings Rate: ${savingsRate.toFixed(1)}%
- Total Debt: $${totalDebt.toLocaleString()}
- Total Investments: $${totalInvestments.toLocaleString()}
- Net Worth: $${netWorth.toLocaleString()}

RECENT FINANCIAL ACTIVITY:
${financialData.recentTransactions.slice(0, 5).map(t => 
  `- ${t.date}: ${t.amount < 0 ? '-' : '+'}$${Math.abs(t.amount)} (${t.category}) - ${t.description}`
).join('\n')}

INVESTMENT PORTFOLIO:
${financialData.investments.map(inv => 
  `- ${inv.type}: $${inv.value.toLocaleString()} (${inv.performance > 0 ? '+' : ''}${inv.performance.toFixed(1)}%)`
).join('\n')}

DEBT OBLIGATIONS:
${financialData.debts.map(debt => 
  `- ${debt.type}: $${debt.amount.toLocaleString()} at ${debt.interestRate.toFixed(1)}% interest`
).join('\n')}

INTERACTION HISTORY (Last 3 conversations):
${interactionHistory.slice(-3).map(h => 
  `[${h.timestamp}] User: "${h.query}" | Your Response: "${h.response.substring(0, 100)}..."`
).join('\n')}

CURRENT CONTEXT:
- Time: ${context.timeOfDay}, ${context.dayOfWeek}
- Season: ${context.season}
${context.marketConditions ? `- Market: ${context.marketConditions}` : ''}

USER'S CURRENT QUESTION: "${userQuery}"

As their personal financial advisor, provide comprehensive guidance that:
1. Directly addresses their question
2. Considers their complete financial picture
3. Builds on previous conversations
4. Provides actionable, prioritized recommendations
5. Assesses financial health and risks
6. Suggests specific next steps

Be conversational, empathetic, and practical. Consider the time context and their recent activities.

Provide your response in the following structured format:
- response: A conversational answer to their question
- suggestions: Specific actionable recommendations with priority, reasoning, impact, and timeframe
- financialHealthScore: A score from 0-100 based on their overall financial health
- insights: Key observations about their financial situation
- nextSteps: Immediate actions they should consider
- riskAssessment: Current risk level and factors
- followUpQuestions: Questions to continue the conversation`,
    };
  }
);

/**
 * Financial Advisor Chatbot Flow
 * Uses pre-trained model weights and Fi Money MCP server integration
 */
export const financialAdvisorChatbot = ai.defineFlow(
  {
    name: 'financialAdvisorChatbot',
    inputSchema: FinancialAdvisorInputSchema,
    outputSchema: FinancialAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await financialAdvisorPrompt(input);
    return output!;
  }
);
