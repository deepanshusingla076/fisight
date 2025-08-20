'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface MLTestResult {
  predicted_action: string
  confidence: number
  all_probabilities: Record<string, number>
  insights: Array<{
    type: string
    title: string
    description: string
    confidence?: number
    priority: string
    actionable: boolean
  }>
  risk_assessment: {
    level: string
    score: number
    description: string
  }
}

export default function MLIntegrationTest() {
  const [formData, setFormData] = useState({
    age: '30',
    income: '75000',
    account_balance: '25000',
    credit_score: '720',
    num_transactions: '45',
    avg_transaction_value: '125.50',
    spending_category: 'groceries',
    risk_profile: 'medium'
  })
  
  const [result, setResult] = useState<MLTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const testMLPrediction = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(formData.age),
          income: parseFloat(formData.income),
          account_balance: parseFloat(formData.account_balance),
          credit_score: parseInt(formData.credit_score),
          num_transactions: parseInt(formData.num_transactions),
          avg_transaction_value: parseFloat(formData.avg_transaction_value),
          spending_category: formData.spending_category,
          risk_profile: formData.risk_profile
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🤖 ML Integration Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Profile Input</CardTitle>
            <CardDescription>
              Enter financial data to test ML predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="income">Annual Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="balance">Account Balance ($)</Label>
                <Input
                  id="balance"
                  type="number"
                  value={formData.account_balance}
                  onChange={(e) => handleInputChange('account_balance', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="credit">Credit Score</Label>
                <Input
                  id="credit"
                  type="number"
                  value={formData.credit_score}
                  onChange={(e) => handleInputChange('credit_score', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transactions">Num Transactions</Label>
                <Input
                  id="transactions"
                  type="number"
                  value={formData.num_transactions}
                  onChange={(e) => handleInputChange('num_transactions', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="avg_transaction">Avg Transaction ($)</Label>
                <Input
                  id="avg_transaction"
                  type="number"
                  step="0.01"
                  value={formData.avg_transaction_value}
                  onChange={(e) => handleInputChange('avg_transaction_value', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Spending Category</Label>
              <Select 
                value={formData.spending_category} 
                onValueChange={(value) => handleInputChange('spending_category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="risk">Risk Profile</Label>
              <Select 
                value={formData.risk_profile} 
                onValueChange={(value) => handleInputChange('risk_profile', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={testMLPrediction} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Get ML Prediction'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>ML Prediction Results</CardTitle>
            <CardDescription>
              AI-powered financial recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-600 p-4 border border-red-200 rounded">
                Error: {error}
              </div>
            )}
            
            {result && (
              <div className="space-y-4">
                {/* Main Prediction */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg">Recommended Action</h3>
                  <p className="text-xl font-bold text-blue-600 capitalize">
                    {result.predicted_action.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {/* All Probabilities */}
                <div>
                  <h4 className="font-semibold mb-2">All Action Probabilities</h4>
                  <div className="space-y-1">
                    {Object.entries(result.all_probabilities).map(([action, prob]) => (
                      <div key={action} className="flex justify-between">
                        <span className="capitalize">{action.replace('_', ' ')}</span>
                        <span>{(prob * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="p-3 bg-green-50 rounded">
                  <h4 className="font-semibold">Risk Assessment</h4>
                  <p className="capitalize">
                    <span className="font-medium">{result.risk_assessment.level}</span> Risk
                  </p>
                  <p className="text-sm text-gray-600">{result.risk_assessment.description}</p>
                </div>

                {/* Insights */}
                <div>
                  <h4 className="font-semibold mb-2">AI Insights</h4>
                  <div className="space-y-2">
                    {result.insights.map((insight, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded">
                        <h5 className="font-medium">{insight.title}</h5>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Priority: {insight.priority}</span>
                          {insight.confidence && (
                            <span className="text-xs text-gray-500">
                              Confidence: {(insight.confidence * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {!result && !error && !loading && (
              <p className="text-gray-500">Enter financial data and click "Get ML Prediction" to see results.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
