import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Get API key from environment with better validation
const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.error('❌ Missing Google AI API Key in environment variables');
  console.error('Please set GOOGLE_AI_API_KEY or GOOGLE_GENAI_API_KEY in your .env.local file');
  console.error('Current environment variables:');
  console.error('GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? 'SET' : 'NOT SET');
  console.error('GOOGLE_GENAI_API_KEY:', process.env.GOOGLE_GENAI_API_KEY ? 'SET' : 'NOT SET');
} else {
  console.log('✅ Google AI API Key found in environment');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: apiKey || 'fallback-key-for-build'
  })],
  model: 'googleai/gemini-1.5-flash-latest',
});

// Test function to verify API key is working
export async function testGeminiConnection() {
  try {
    if (!apiKey) {
      throw new Error('No API key available');
    }

    const response = await ai.generate({
      prompt: 'Say "Hello from FiSight!" to test the connection',
    });
    console.log('✅ Gemini API connection successful:', response.text);
    return { success: true, response: response.text };
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Enhanced AI functions for financial analysis
// Enhanced financial analysis with ML integration
export async function analyzeFinancialData(input: {
  income: number;
  expenses: number;
  assets: number;
  liabilities: number;
  age?: number;
  goals?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
  creditScore?: number;
  numTransactions?: number;
  avgTransactionValue?: number;
  spendingCategory?: string;
}) {
  try {
    const netWorth = input.assets - input.liabilities;
    const savingsRate = ((input.income - input.expenses) / input.income) * 100;
    const debtToIncomeRatio = (input.liabilities / input.income) * 100;
    
    // Get ML prediction if we have enough data
    let mlPrediction = null;
    if (input.creditScore && input.numTransactions && input.avgTransactionValue && input.spendingCategory) {
      try {
        const mlResponse = await fetch('http://localhost:9002/api/ml/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age: input.age || 35,
            income: input.income,
            account_balance: input.assets,
            credit_score: input.creditScore,
            num_transactions: input.numTransactions,
            avg_transaction_value: input.avgTransactionValue,
            spending_category: input.spendingCategory,
            risk_profile: input.riskTolerance || 'medium'
          })
        });
        
        if (mlResponse.ok) {
          const mlData = await mlResponse.json();
          mlPrediction = {
            action: mlData.predicted_action,
            confidence: mlData.confidence,
            reasoning: `AI model recommends to ${mlData.predicted_action.replace('_', ' ')} with ${(mlData.confidence * 100).toFixed(1)}% confidence`
          };
        }
      } catch (error) {
        console.warn('ML prediction failed, using rule-based analysis only:', error);
      }
    }

    const prompt = `
    Analyze this financial profile and provide personalized insights:
    
    Financial Data:
    - Annual Income: $${input.income.toLocaleString()}
    - Monthly Expenses: $${input.expenses.toLocaleString()}
    - Total Assets: $${input.assets.toLocaleString()}
    - Total Liabilities: $${input.liabilities.toLocaleString()}
    - Net Worth: $${netWorth.toLocaleString()}
    - Savings Rate: ${savingsRate.toFixed(1)}%
    - Debt-to-Income Ratio: ${debtToIncomeRatio.toFixed(1)}%
    
    ${input.age ? `Age: ${input.age}` : ''}
    ${input.goals ? `Financial Goals: ${input.goals.join(', ')}` : ''}
    ${input.riskTolerance ? `Risk Tolerance: ${input.riskTolerance}` : ''}
    
    ${mlPrediction ? `ML Model Prediction: ${mlPrediction.reasoning}` : ''}
    
    Provide a comprehensive financial analysis including:
    1. Overall financial health assessment
    2. Specific areas of strength and concern
    3. Actionable recommendations for improvement
    4. Risk assessment and mitigation strategies
    ${mlPrediction ? '5. Analysis of the ML prediction and how it aligns with traditional financial advice' : ''}
    
    Be specific, actionable, and encouraging while being realistic about challenges.
    `;

    const result = await ai.generate({
      prompt,
    });

    // Determine risk level based on financial metrics
    let riskLevel = 'Low';
    let score = 85;
    
    if (debtToIncomeRatio > 40 || savingsRate < 0) {
      riskLevel = 'High';
      score = 45;
    } else if (debtToIncomeRatio > 20 || savingsRate < 10) {
      riskLevel = 'Medium';
      score = 65;
    }

    // Generate recommendations
    const recommendations = [];
    
    if (savingsRate < 20) {
      recommendations.push('Increase savings rate to at least 20% of income');
    }
    if (debtToIncomeRatio > 30) {
      recommendations.push('Focus on debt reduction to improve debt-to-income ratio');
    }
    if (netWorth < input.income * 0.5) {
      recommendations.push('Build emergency fund equal to 3-6 months of expenses');
    }
    if (input.age && input.age < 40 && input.riskTolerance !== 'low') {
      recommendations.push('Consider increasing investment allocation for long-term growth');
    }
    
    // Add ML-based recommendation if available
    if (mlPrediction) {
      recommendations.push(`AI recommends: ${mlPrediction.action.replace('_', ' ')} (${(mlPrediction.confidence * 100).toFixed(1)}% confidence)`);
    }

    return {
      analysis: result.text,
      recommendations,
      riskLevel,
      score,
      mlPrediction
    };

  } catch (error) {
    console.error('Error in financial analysis:', error);
    throw new Error('Failed to analyze financial data');
  }
}

export async function generateBudgetAdvice(transactions: any[]) {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const categorySpending = transactions.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});

    const prompt = `
Based on this spending data, provide budget advice:

Spending by category:
${Object.entries(categorySpending).map(([cat, amount]) => `${cat}: $${amount}`).join('\n')}

Provide:
1. Spending patterns analysis
2. Areas to reduce spending
3. Budget allocation suggestions
4. Money-saving tips

Keep advice practical and specific.
`;

    const response = await ai.generate({
      prompt: prompt,
    });

    return {
      success: true,
      advice: response.text
    };
  } catch (error) {
    console.error('❌ Error generating budget advice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Budget analysis failed'
    };
  }
}

export async function generateInvestmentAdvice(userProfile: any) {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `
Provide investment advice for this user profile:

Age: ${userProfile.age || 'Not specified'}
Risk Tolerance: ${userProfile.riskTolerance}
Annual Income: $${userProfile.annualIncome}
Investment Goals: ${userProfile.financialGoals?.join(', ') || 'Not specified'}
Time Horizon: ${userProfile.timeHorizon || 'Not specified'}

Provide:
1. Recommended asset allocation
2. Specific investment types
3. Risk management strategies
4. Next steps

Keep advice beginner-friendly but comprehensive.
`;

    const response = await ai.generate({
      prompt: prompt,
    });

    return {
      success: true,
      advice: response.text
    };
  } catch (error) {
    console.error('❌ Error generating investment advice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Investment analysis failed'
    };
  }
}

// Export for use in API routes and components
export { ai as genkitAI };
