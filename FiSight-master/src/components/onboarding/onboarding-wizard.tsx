'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, DollarSign, Target, TrendingUp, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  annualIncome: number;
  monthlyExpenses: number;
  financialGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  creditScore?: number;
  hasEmergencyFund: boolean;
  emergencyFundMonths?: number;
  hasDebts: boolean;
  totalDebtAmount?: number;
  hasInvestments: boolean;
  currentInvestmentValue?: number;
  employmentStatus: string;
  age?: number;
  dependents?: number;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => Promise<void>;
  onSkip?: () => void;
}

const FINANCIAL_GOALS = [
  'Emergency Fund',
  'Retirement Planning',
  'Home Purchase',
  'Education Funding',
  'Debt Payoff',
  'Vacation/Travel',
  'Investment Growth',
  'Start a Business',
  'Car Purchase',
  'Medical Expenses'
];

const EMPLOYMENT_OPTIONS = [
  'Full-time Employee',
  'Part-time Employee',
  'Self-employed/Freelancer',
  'Business Owner',
  'Student',
  'Retired',
  'Unemployed',
  'Other'
];

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<OnboardingData>({
    annualIncome: 0,
    monthlyExpenses: 0,
    financialGoals: [],
    riskTolerance: 'medium',
    hasEmergencyFund: false,
    hasDebts: false,
    hasInvestments: false,
    employmentStatus: '',
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter(g => g !== goal)
        : [...prev.financialGoals, goal]
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onComplete(formData);
      toast({
        title: "Welcome to FiSight!",
        description: "Your financial profile has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.annualIncome > 0 && formData.monthlyExpenses > 0;
      case 2:
        return formData.financialGoals.length > 0;
      case 3:
        return formData.riskTolerance && formData.employmentStatus;
      case 4:
        return true; // Optional step
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <DollarSign className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Income & Expenses</h2>
              <p className="text-muted-foreground">Let's start with your basic financial information</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.annualIncome || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: Number(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="expenses">Monthly Expenses</Label>
                <Input
                  id="expenses"
                  type="number"
                  placeholder="e.g., 3000"
                  value={formData.monthlyExpenses || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyExpenses: Number(e.target.value) }))}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Include rent, utilities, food, transportation, etc.
                </p>
              </div>

              <div>
                <Label htmlFor="age">Age (Optional)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="dependents">Number of Dependents (Optional)</Label>
                <Input
                  id="dependents"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.dependents || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dependents: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Financial Goals</h2>
              <p className="text-muted-foreground">What are you hoping to achieve financially?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {FINANCIAL_GOALS.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.financialGoals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label htmlFor={goal} className="text-sm">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Risk & Employment</h2>
              <p className="text-muted-foreground">Help us understand your financial situation</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Employment Status</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employmentStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Risk Tolerance</Label>
                <Select
                  value={formData.riskTolerance}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setFormData(prev => ({ ...prev, riskTolerance: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Conservative - Minimize risk</SelectItem>
                    <SelectItem value="medium">Moderate - Balanced approach</SelectItem>
                    <SelectItem value="high">Aggressive - Higher returns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="creditScore">Credit Score (Optional)</Label>
                <Input
                  id="creditScore"
                  type="number"
                  placeholder="e.g., 750"
                  value={formData.creditScore || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, creditScore: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold">Current Financial Status</h2>
              <p className="text-muted-foreground">Tell us about your current assets and debts</p>
            </div>
            
            <div className="space-y-6">
              {/* Emergency Fund */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergencyFund"
                    checked={formData.hasEmergencyFund}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, hasEmergencyFund: checked as boolean }))
                    }
                  />
                  <Label htmlFor="emergencyFund">I have an emergency fund</Label>
                </div>
                {formData.hasEmergencyFund && (
                  <Input
                    type="number"
                    placeholder="How many months of expenses?"
                    value={formData.emergencyFundMonths || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      emergencyFundMonths: Number(e.target.value) 
                    }))}
                  />
                )}
              </div>

              {/* Debts */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="debts"
                    checked={formData.hasDebts}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, hasDebts: checked as boolean }))
                    }
                  />
                  <Label htmlFor="debts">I have outstanding debts</Label>
                </div>
                {formData.hasDebts && (
                  <Input
                    type="number"
                    placeholder="Total debt amount"
                    value={formData.totalDebtAmount || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      totalDebtAmount: Number(e.target.value) 
                    }))}
                  />
                )}
              </div>

              {/* Investments */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="investments"
                    checked={formData.hasInvestments}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, hasInvestments: checked as boolean }))
                    }
                  />
                  <Label htmlFor="investments">I have existing investments</Label>
                </div>
                {formData.hasInvestments && (
                  <Input
                    type="number"
                    placeholder="Current investment value"
                    value={formData.currentInvestmentValue || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      currentInvestmentValue: Number(e.target.value) 
                    }))}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Review Your Information</h2>
              <p className="text-muted-foreground">Make sure everything looks correct</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Financial Overview</h3>
                <p>Annual Income: ${formData.annualIncome.toLocaleString()}</p>
                <p>Monthly Expenses: ${formData.monthlyExpenses.toLocaleString()}</p>
                <p>Risk Tolerance: {formData.riskTolerance}</p>
                <p>Employment: {formData.employmentStatus}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Financial Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.financialGoals.map((goal) => (
                    <span key={goal} className="bg-primary/10 px-2 py-1 rounded text-sm">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {(formData.hasEmergencyFund || formData.hasDebts || formData.hasInvestments) && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  {formData.hasEmergencyFund && (
                    <p>Emergency Fund: {formData.emergencyFundMonths} months</p>
                  )}
                  {formData.hasDebts && (
                    <p>Total Debts: ${formData.totalDebtAmount?.toLocaleString()}</p>
                  )}
                  {formData.hasInvestments && (
                    <p>Investments: ${formData.currentInvestmentValue?.toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Welcome to FiSight</CardTitle>
            <CardDescription>
              Step {currentStep} of {totalSteps} - Let's set up your financial profile
            </CardDescription>
          </div>
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Skip for now
            </Button>
          )}
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent>
        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Setting up...' : 'Complete Setup'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
