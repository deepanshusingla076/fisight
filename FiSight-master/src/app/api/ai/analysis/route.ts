import { NextRequest, NextResponse } from 'next/server';
import { analyzeFinancialData, generateBudgetAdvice, generateInvestmentAdvice } from '@/ai/genkit';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data in request' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'financial-analysis':
        result = await analyzeFinancialData(data);
        break;
      
      case 'budget-advice':
        result = await generateBudgetAdvice(data);
        break;
      
      case 'investment-advice':
        result = await generateInvestmentAdvice(data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error in AI analysis API:', error);
    return NextResponse.json(
      { 
        error: 'AI analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
