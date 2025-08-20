import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

interface MLPredictionRequest {
  age: number;
  income: number;
  account_balance: number;
  credit_score: number;
  num_transactions: number;
  avg_transaction_value: number;
  spending_category: string;
  risk_profile: string;
}

interface MLPredictionResponse {
  predicted_action: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  insights: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    actionable: boolean;
  }>;
  risk_assessment: {
    level: string;
    score: number;
    description: string;
  };
  savings_recommendations: Array<{
    type: string;
    allocation: Record<string, number>;
    description: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const userData: MLPredictionRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      'age', 'income', 'account_balance', 'credit_score',
      'num_transactions', 'avg_transaction_value', 'spending_category', 'risk_profile'
    ];
    
    for (const field of requiredFields) {
      if (!(field in userData)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Call Python ML service
    const pythonResult = await callPythonMLService(userData);
    
    if ('error' in pythonResult) {
      return NextResponse.json(
        { error: pythonResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(pythonResult);

  } catch (error) {
    console.error('❌ ML prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ML prediction' },
      { status: 500 }
    );
  }
}

function callPythonMLService(userData: MLPredictionRequest): Promise<MLPredictionResponse | { error: string }> {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'faisight-dataset', 'ml_service.py');
    const python = spawn('python', [scriptPath, JSON.stringify(userData)]);
    
    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorOutput);
        resolve({ error: `Python script failed with code ${code}` });
        return;
      }

      try {
        // Parse the JSON output from Python
        const lines = output.split('\n');
        const jsonLine = lines.find(line => line.startsWith('{'));
        
        if (jsonLine) {
          const result = JSON.parse(jsonLine);
          resolve(result);
        } else {
          resolve({ error: 'No valid JSON output from Python script' });
        }
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        resolve({ error: 'Failed to parse Python script output' });
      }
    });

    python.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      resolve({ error: 'Failed to start Python process' });
    });
  });
}

// Fallback ML prediction using TypeScript (when Python is not available)
function fallbackMLPrediction(userData: MLPredictionRequest): MLPredictionResponse {
  const {
    age,
    income,
    account_balance,
    credit_score,
    num_transactions,
    avg_transaction_value,
    spending_category,
    risk_profile
  } = userData;

  // Simple rule-based prediction logic
  let predicted_action = 'save_money';
  let confidence = 0.6;

  // Rule-based decision tree
  const emergency_months = account_balance / (income / 12);
  
  if (credit_score < 650) {
    predicted_action = 'pay_debt';
    confidence = 0.8;
  } else if (emergency_months < 3) {
    predicted_action = 'save_money';
    confidence = 0.7;
  } else if (age < 35 && risk_profile === 'high' && emergency_months > 6) {
    predicted_action = 'invest_more';
    confidence = 0.65;
  } else if (avg_transaction_value > income / 12 * 0.3) {
    predicted_action = 'stop_spending';
    confidence = 0.6;
  }

  // Generate insights
  const insights = [];
  
  // Primary recommendation
  insights.push({
    type: 'primary_recommendation',
    title: `Recommended Action: ${predicted_action.replace('_', ' ').toUpperCase()}`,
    description: getActionDescription(predicted_action),
    priority: 'high',
    actionable: true
  });

  // Emergency fund check
  if (emergency_months < 3) {
    insights.push({
      type: 'emergency_fund',
      title: 'Build Emergency Fund',
      description: `You have ${emergency_months.toFixed(1)} months of expenses saved. Aim for 3-6 months.`,
      priority: 'high',
      actionable: true
    });
  }

  // Credit score insights
  if (credit_score < 700) {
    insights.push({
      type: 'credit_score',
      title: 'Improve Credit Score',
      description: `Your credit score of ${credit_score} can be improved for better financial opportunities.`,
      priority: credit_score < 650 ? 'high' : 'medium',
      actionable: true
    });
  }

  // Investment opportunity
  if (age < 40 && emergency_months > 3 && risk_profile !== 'low') {
    insights.push({
      type: 'investment',
      title: 'Consider Investment Opportunities',
      description: 'Your age and financial stability suggest you could benefit from long-term investments.',
      priority: 'medium',
      actionable: true
    });
  }

  // Risk assessment
  let risk_score = 0;
  if (emergency_months < 1) risk_score += 3;
  else if (emergency_months < 3) risk_score += 2;
  else if (emergency_months < 6) risk_score += 1;

  if (credit_score < 600) risk_score += 3;
  else if (credit_score < 700) risk_score += 2;
  else if (credit_score < 750) risk_score += 1;

  const risk_level = risk_score >= 5 ? 'high' : risk_score >= 3 ? 'medium' : 'low';
  
  // Savings recommendations
  const savings_recommendations = [];
  if (age < 30) {
    savings_recommendations.push({
      type: 'aggressive_growth',
      allocation: { stocks: 80, bonds: 15, cash: 5 },
      description: 'Young age allows for aggressive growth strategy'
    });
  } else if (age < 50) {
    savings_recommendations.push({
      type: 'balanced_growth',
      allocation: { stocks: 65, bonds: 25, cash: 10 },
      description: 'Balanced approach for steady growth'
    });
  } else {
    savings_recommendations.push({
      type: 'conservative',
      allocation: { stocks: 45, bonds: 40, cash: 15 },
      description: 'Conservative approach for retirement preparation'
    });
  }

  return {
    predicted_action,
    confidence,
    all_probabilities: {
      [predicted_action]: confidence,
      'save_money': predicted_action === 'save_money' ? confidence : 0.25,
      'invest_more': predicted_action === 'invest_more' ? confidence : 0.25,
      'pay_debt': predicted_action === 'pay_debt' ? confidence : 0.25,
      'stop_spending': predicted_action === 'stop_spending' ? confidence : 0.25
    },
    insights,
    risk_assessment: {
      level: risk_level,
      score: risk_score,
      description: getRiskDescription(risk_level)
    },
    savings_recommendations
  };
}

function getActionDescription(action: string): string {
  switch (action) {
    case 'save_money':
      return 'Focus on building your savings and emergency fund for financial security.';
    case 'invest_more':
      return 'Consider increasing your investment allocation for long-term wealth building.';
    case 'pay_debt':
      return 'Prioritize paying down high-interest debt to improve your financial health.';
    case 'stop_spending':
      return 'Review and reduce unnecessary expenses to improve your financial position.';
    default:
      return 'Follow a balanced approach to managing your finances.';
  }
}

function getRiskDescription(level: string): string {
  switch (level) {
    case 'high':
      return 'High financial risk - immediate attention needed';
    case 'medium':
      return 'Moderate financial risk - improvements recommended';
    case 'low':
      return 'Low financial risk - good financial health';
    default:
      return 'Financial risk assessment unavailable';
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'FiSight ML Prediction API',
    endpoints: {
      'POST /api/ml/predict': 'Get ML-powered financial predictions and insights'
    },
    required_fields: [
      'age', 'income', 'account_balance', 'credit_score',
      'num_transactions', 'avg_transaction_value', 'spending_category', 'risk_profile'
    ]
  });
}
